/* =========================================================================================
   js/app.js — LOGIKA ANTARMUKA BERSAMA + INISIALISASI PER HALAMAN
   -----------------------------------------------------------------------------------------
   Satu file ini dipakai keempat halaman. Halaman yang sedang aktif dikenali melalui
   atribut data-page pada <body>, lalu fungsi init yang sesuai dipanggil di bagian akhir.

   State antar halaman TIDAK disimpan secara permanen. Tidak ada localStorage,
   sessionStorage, maupun IndexedDB. Perpindahan sesi terpilih dari katalog ke halaman
   pemesanan dilakukan melalui parameter URL (contoh: booking.html?id=ST-004), dan objek
   sesinya dicari ulang secara manual dari array master.
   ========================================================================================= */

/* ---------------------------------------------------------------- utilitas umum */
function $(id){ return document.getElementById(id); }

function escapeHtml(t){
  return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function formatRupiah(n){
  var s = String(n), out = "", count = 0;
  for (var i = s.length - 1; i >= 0; i--){
    out = s.charAt(i) + out;
    count++;
    if (count % 3 === 0 && i > 0) out = "." + out;
  }
  return "Rp " + out;
}

var MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function formatDate(iso){
  var p = iso.split("-");
  return Number(p[2]) + " " + MONTHS[Number(p[1]) - 1] + " " + p[0];
}

function joinSeats(list){
  var s = "";
  for (var i = 0; i < list.length; i++){
    s += list[i];
    if (i < list.length - 1) s += ", ";
  }
  return s;
}

/* Membaca parameter URL tanpa library — dipakai booking.html?id=ST-00X */
function getQueryParam(name){
  var q = window.location.search;
  if (q.length < 2) return "";
  q = q.substring(1);
  var parts = q.split("&");
  for (var i = 0; i < parts.length; i++){
    var pair = parts[i].split("=");
    if (decodeURIComponent(pair[0]) === name){
      return decodeURIComponent(String(pair[1] || "").replace(/\+/g, " "));
    }
  }
  return "";
}

/* Penanganan poster gagal dimuat: sembunyikan <img> agar placeholder yang tampil.
   Fungsi ini dipanggil dari atribut onerror pada elemen gambar. */
function handlePosterError(img){ img.style.display = "none"; }

/* Menandai tautan navigasi yang sedang aktif */
function markActiveNav(){
  var page = document.body.getAttribute("data-page");
  var links = document.getElementsByClassName("nav-link");
  for (var i = 0; i < links.length; i++){
    if (links[i].getAttribute("data-nav") === page) links[i].className = "nav-link active";
  }
}

/* =========================================================================================
   NOTIFIKASI STATUS PENGUMPULAN
   -----------------------------------------------------------------------------------------
   Banner menempel di bagian paling atas halaman. Karena header juga bersifat sticky,
   jarak atas header dihitung ulang dari tinggi banner agar keduanya tidak saling menimpa.
   Status buka/tutup TIDAK disimpan permanen (tanpa localStorage), sesuai batasan tugas.
   ========================================================================================= */
function initStatusBanner(){
  var bar = $("statusBar");
  if (!bar) return;

  var detail   = $("statusDetail");
  var btn      = $("statusDetailBtn");
  var closeBtn = $("statusCloseBtn");
  var reopen   = $("statusReopen");
  var header   = document.getElementsByTagName("header")[0];

  /* menyesuaikan posisi sticky header dengan tinggi banner */
  function syncHeaderOffset(){
    if (!header) return;
    header.style.top = (bar.style.display === "none") ? "0px" : bar.offsetHeight + "px";
  }

  function closeDetail(){
    detail.className = "status-detail";
    btn.className = "status-btn";
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", function(){
    var isOpen = (detail.className.indexOf("open") !== -1);
    if (isOpen) closeDetail();
    else {
      detail.className = "status-detail open";
      btn.className = "status-btn open";
      btn.setAttribute("aria-expanded", "true");
    }
  });

  closeBtn.addEventListener("click", function(){
    closeDetail();
    bar.style.display = "none";
    reopen.className = "status-reopen show";
    syncHeaderOffset();
  });

  reopen.addEventListener("click", function(){
    bar.style.display = "";
    reopen.className = "status-reopen";
    syncHeaderOffset();
  });

  /* Escape menutup panel detail bila sedang terbuka */
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && detail.className.indexOf("open") !== -1) closeDetail();
  });

  window.addEventListener("resize", syncHeaderOffset);
  syncHeaderOffset();
  window.setTimeout(syncHeaderOffset, 120);   // setelah font selesai dimuat
}

/* ---------------------------------------------------------------- kartu film */
/* highlightIndex: indeks pada array master, ditampilkan sebagai badge bila bukan Best Seller */
function buildCard(s, masterIndex, selectedId){
  var isSel = (selectedId && s.id === selectedId);
  var href = "booking.html?id=" + encodeURIComponent(s.id);
  var html = "";
  html += '<article class="card' + (isSel ? " is-selected" : "") + '" data-id="' + s.id + '">';
  html +=   '<div class="poster">';
  html +=     '<div class="badge-row">';
  html +=       (s.isBestSeller ? '<span class="badge badge-best">★ Best Seller</span>'
                                : '<span class="badge badge-idx">idx ' + masterIndex + '</span>');
  html +=       '<span class="badge badge-age">' + escapeHtml(s.ageRating) + '</span>';
  html +=     '</div>';
  /* Placeholder lokal: ukuran kartu tetap walau gambar belum tersedia */
  html +=     '<div class="poster-ph"><i>🎞️</i><b>Masukkan Poster Film di Sini</b><span>' + escapeHtml(s.posterPath) + '</span></div>';
  html +=     '<img src="' + escapeHtml(s.posterPath) + '" alt="Poster ' + escapeHtml(s.movieTitle) + '" onerror="handlePosterError(this)">';
  html +=   '</div>';
  html +=   '<div class="card-body">';
  html +=     '<h4 class="card-title">' + escapeHtml(s.movieTitle) + '</h4>';
  html +=     '<div class="card-meta"><span>' + escapeHtml(s.franchise) + '</span><span>' + s.duration + ' mnt</span></div>';
  html +=     '<div class="card-info">';
  html +=       '<div>' + escapeHtml(s.cinemaName) + '</div>';
  html +=       '<div><b>' + escapeHtml(s.studio) + '</b></div>';
  html +=       '<div>' + formatDate(s.date) + ' · <b>' + s.time + '</b></div>';
  html +=     '</div>';
  html +=     '<div class="card-foot">';
  html +=       '<div><div class="price">' + formatRupiah(s.price) + '</div>';
  html +=       '<div class="seats-left">' + s.availableSeats + ' kursi tersedia</div></div>';
  html +=       '<a class="btn btn-primary btn-sm" href="' + href + '">Pesan</a>';
  html +=     '</div>';
  html +=   '</div>';
  html += '</article>';
  return html;
}

/* ---------------------------------------------------------------- render log & statistik */
function renderLogBox(boxId, logData, emptyText){
  var box = $(boxId);
  if (!box) return;
  if (logData.length === 0){
    box.innerHTML = '<div class="log-empty">' + escapeHtml(emptyText) + '</div>';
    return;
  }
  var html = "";
  for (var i = 0; i < logData.length; i++){
    html += '<div class="log-line log-' + logData[i].type + '">' + escapeHtml(logData[i].text) + '</div>';
  }
  box.innerHTML = html;
  box.scrollTop = 0;
}

function setText(id, value){
  var el = $(id);
  if (el) el.textContent = value;
}

/* =========================================================================================
   HALAMAN 1 — BERANDA (index.html)
   ========================================================================================= */
function initHome(){
  /* Statistik hero dihitung manual dari array master, tanpa filter() */
  var titles = [], studios = [], best = 0;
  for (var i = 0; i < showtimes.length; i++){
    var s = showtimes[i];
    var foundT = false;
    for (var a = 0; a < titles.length; a++) if (titles[a] === s.movieTitle) { foundT = true; break; }
    if (!foundT) titles[titles.length] = s.movieTitle;

    var foundS = false;
    for (var b = 0; b < studios.length; b++) if (studios[b] === s.studio) { foundS = true; break; }
    if (!foundS) studios[studios.length] = s.studio;

    if (s.isBestSeller) best++;
  }
  setText("statMovies", titles.length);
  setText("statShows", showtimes.length);
  setText("statStudios", studios.length);
  setText("statBest", best);

  /* Best Seller: perulangan manual atas array master */
  var html = "", count = 0;
  for (var k = 0; k < showtimes.length; k++){
    if (showtimes[k].isBestSeller === true){
      html += buildCard(showtimes[k], k, "");
      count++;
    }
  }
  if (count === 0) html = '<div class="empty">Belum ada sesi yang ditandai sebagai Best Seller.</div>';
  $("bestSellerGrid").innerHTML = html;

  /* Pencarian dari beranda diteruskan ke catalog.html sebagai parameter URL */
  function goSearch(){
    var q = trimText($("heroSearch").value);
    window.location.href = "catalog.html" + (q === "" ? "" : "?q=" + encodeURIComponent(q));
  }
  $("heroSearchBtn").addEventListener("click", goSearch);
  $("heroSearch").addEventListener("keydown", function(e){ if (e.key === "Enter") goSearch(); });
}

/* =========================================================================================
   HALAMAN 2 — KATALOG (catalog.html)
   ========================================================================================= */
var displayedShowtimes = [];   // daftar referensi yang sedang ditampilkan (bukan array master)

function initCatalog(){
  displayedShowtimes = copyArray(showtimes);

  fillDateOptions("qDate");

  /* Jika datang dari beranda dengan ?q=..., langsung jalankan Linear Search */
  var q = getQueryParam("q");
  if (q !== ""){
    $("qTitle").value = q;
    runCatalogSearch();
  } else {
    renderCatalog();
    renderLogBox("searchLogBox", [], "Belum ada proses pencarian dijalankan.");
    renderLogBox("sortLogBox", [], "Belum ada proses sorting dijalankan.");
  }

  $("btnSearch").addEventListener("click", runCatalogSearch);
  $("btnResetSearch").addEventListener("click", resetCatalog);
  $("btnSortAsc").addEventListener("click", function(){ runCatalogSort("asc"); });
  $("btnSortDesc").addEventListener("click", function(){ runCatalogSort("desc"); });
  $("qTitle").addEventListener("keydown", function(e){ if (e.key === "Enter") runCatalogSearch(); });
  $("qFranchise").addEventListener("keydown", function(e){ if (e.key === "Enter") runCatalogSearch(); });
}

function renderCatalog(){
  var grid = $("catalogGrid");
  var empty = $("catalogEmpty");

  if (displayedShowtimes.length === 0){
    grid.innerHTML = "";
    empty.style.display = "block";
    empty.innerHTML = "<b>Tidak ada sesi penayangan yang cocok.</b><br>" +
      "Coba longgarkan kriteria pencarian atau tekan tombol <i>Reset Pencarian</i> untuk menampilkan seluruh data.";
    setText("catalogNote", "menampilkan 0 dari " + showtimes.length + " sesi");
    return;
  }

  empty.style.display = "none";
  var html = "";
  for (var i = 0; i < displayedShowtimes.length; i++){
    var masterIndex = findMasterIndexById(displayedShowtimes[i].id);  // indeks master dicari ulang
    html += buildCard(displayedShowtimes[i], masterIndex, "");
  }
  grid.innerHTML = html;
  setText("catalogNote", "menampilkan " + displayedShowtimes.length + " dari " + showtimes.length + " sesi");
}

function runCatalogSearch(){
  var res = linearSearchWithLog(showtimes, {      // pencarian SELALU dari array master
    title: $("qTitle").value,
    franchise: $("qFranchise").value,
    date: $("qDate").value
  });

  displayedShowtimes = res.results;
  renderCatalog();
  renderLogBox("searchLogBox", res.log, "Belum ada proses pencarian dijalankan.");
  setText("srcChecked", res.checked);
  setText("srcFound", res.found);
  setText("srcCriteria", res.activeCount);
  setText("srcStatus", res.found > 0 ? "Ditemukan" : "Kosong");

  /* log sorting direset karena kumpulan data yang ditampilkan berubah */
  renderLogBox("sortLogBox", [], "Belum ada proses sorting dijalankan.");
  setText("sortCmp", 0); setText("sortSwap", 0); setText("sortPass", 0); setText("sortDir", "—");
}

function runCatalogSort(direction){
  if (displayedShowtimes.length === 0){
    renderLogBox("sortLogBox", [{ type:"final", text:"Tidak ada data yang ditampilkan, sorting tidak dijalankan." }], "");
    return;
  }
  var res = bubbleSortWithLog(displayedShowtimes, direction);   // array master tidak disentuh
  displayedShowtimes = res.sorted;

  renderCatalog();
  renderLogBox("sortLogBox", res.log, "Belum ada proses sorting dijalankan.");
  setText("sortCmp", res.comparisons);
  setText("sortSwap", res.swaps);
  setText("sortPass", res.passes);
  setText("sortDir", direction === "asc" ? "Menaik" : "Menurun");
}

function resetCatalog(){
  displayedShowtimes = copyArray(showtimes);
  $("qTitle").value = "";
  $("qFranchise").value = "";
  $("qDate").value = "";
  renderCatalog();
  renderLogBox("searchLogBox", [], "Belum ada proses pencarian dijalankan.");
  renderLogBox("sortLogBox", [], "Belum ada proses sorting dijalankan.");
  setText("srcChecked", 0); setText("srcFound", 0); setText("srcCriteria", 0); setText("srcStatus", "—");
  setText("sortCmp", 0); setText("sortSwap", 0); setText("sortPass", 0); setText("sortDir", "—");
}

/* Mengisi opsi tanggal secara manual dari array master, lalu diurutkan dengan
   Bubble Sort sederhana (bukan Array.sort) */
function fillDateOptions(selectId){
  var el = $(selectId);
  if (!el) return;

  var unique = [];
  for (var i = 0; i < showtimes.length; i++){
    var d = showtimes[i].date, exists = false;
    for (var j = 0; j < unique.length; j++) if (unique[j] === d) { exists = true; break; }
    if (!exists) unique[unique.length] = d;
  }
  for (var p = 0; p < unique.length - 1; p++){
    for (var q = 0; q < unique.length - 1 - p; q++){
      if (unique[q] > unique[q + 1]){
        var t = unique[q]; unique[q] = unique[q + 1]; unique[q + 1] = t;
      }
    }
  }

  var html = '<option value="">Semua tanggal</option>';
  for (var k = 0; k < unique.length; k++){
    html += '<option value="' + unique[k] + '">' + formatDate(unique[k]) + '</option>';
  }
  el.innerHTML = html;
}

/* =========================================================================================
   HALAMAN 3 — PEMESANAN (booking.html)
   -----------------------------------------------------------------------------------------
   KONSEP POINTER / REFERENSI OBJEK
   selectedShowtimeIndex menyimpan INDEKS pada array master (peran seperti pointer
   aritmetika), sedangkan selectedShowtime menyimpan REFERENSI ke objek yang sama dengan
   showtimes[selectedShowtimeIndex] (peran seperti pointer ke struct).
   ========================================================================================= */
var selectedShowtimeIndex = -1;
var selectedShowtime = null;
var selectedSeats = [];
var lastTransaction = null;

function initBooking(){
  /* Daftar sesi pada dropdown dibangun manual dari array master */
  var html = '<option value="">— pilih sesi penayangan —</option>';
  for (var i = 0; i < showtimes.length; i++){
    var s = showtimes[i];
    html += '<option value="' + s.id + '">[' + i + '] ' + s.id + " · " + escapeHtml(s.movieTitle) +
            " · " + formatDate(s.date) + " " + s.time + " · " + formatRupiah(s.price) + '</option>';
  }
  $("sessionSelect").innerHTML = html;

  $("sessionSelect").addEventListener("change", function(){
    if (this.value === "") clearSelection();
    else selectShowtimeById(this.value);
  });

  /* Klik kursi (event delegation) */
  $("seatArea").addEventListener("click", function(e){
    var el = e.target;
    if (el && el.getAttribute && el.getAttribute("data-seat") !== null){
      toggleSeat(el.getAttribute("data-seat"));
    }
  });

  /* ID sesi dibaca dari parameter URL, lalu objeknya DICARI MANUAL di array master */
  var id = getQueryParam("id");
  if (id !== "" && findMasterIndexById(id) !== -1){
    $("sessionSelect").value = id;
    selectShowtimeById(id);
  } else {
    clearSelection();
  }
}

function selectShowtimeById(id){
  var masterIndex = findMasterIndexById(id);    // selalu dicari ulang pada ARRAY MASTER
  if (masterIndex === -1) { clearSelection(); return; }

  selectedShowtimeIndex = masterIndex;          // seperti pointer aritmetika: menyimpan posisi
  selectedShowtime = showtimes[masterIndex];    // referensi ke objek yang sama persis
  selectedSeats = [];
  lastTransaction = null;

  renderSessionDetail();
  renderSeatMap();
  renderSummary();
}

function clearSelection(){
  selectedShowtimeIndex = -1;
  selectedShowtime = null;
  selectedSeats = [];
  lastTransaction = null;
  renderSessionDetail();
  renderSeatMap();
  renderSummary();
}

function renderSessionDetail(){
  var box = $("sessionDetail");
  if (!box) return;

  if (selectedShowtime === null){
    box.innerHTML = '<div class="empty">Belum ada sesi dipilih. Nilai saat ini: ' +
      '<code>selectedShowtimeIndex = -1</code> dan <code>selectedShowtime = null</code> ' +
      '(setara pointer NULL pada C/C++).</div>';
    return;
  }

  var s = selectedShowtime;
  var html = '<div class="kv">';
  html += kvItem("showtimes[ ]", "indeks [" + selectedShowtimeIndex + "]");
  html += kvItem("id", s.id);
  html += kvItem("movieTitle", s.movieTitle);
  html += kvItem("franchise / genre", s.franchise + " · " + s.genre);
  html += kvItem("cinemaName", s.cinemaName);
  html += kvItem("studio", s.studio);
  html += kvItem("date / time", formatDate(s.date) + " · " + s.time);
  html += kvItem("price", formatRupiah(s.price));
  html += '</div>';
  box.innerHTML = html;
}

function kvItem(k, v){
  return '<div class="kv-item"><div class="k">' + k + '</div><div class="v">' + escapeHtml(String(v)) + '</div></div>';
}

function renderSeatMap(){
  var area = $("seatArea");
  var hint = $("seatHint");

  if (selectedShowtime === null){
    hint.textContent = "Belum ada sesi yang dipilih.";
    area.innerHTML = '<div class="empty">Pilih sesi penayangan terlebih dahulu melalui daftar di atas, ' +
                     'atau kembali ke katalog dan tekan tombol Pesan pada salah satu kartu film.</div>';
    return;
  }

  var s = selectedShowtime;
  hint.innerHTML = "<b>" + escapeHtml(s.movieTitle) + "</b> · " + escapeHtml(s.studio) + " · " +
                   formatDate(s.date) + " " + s.time + " · " + formatRupiah(s.price) + " / kursi";

  var html = '<div class="screen">Layar</div><div class="seat-map">';
  for (var r = 0; r < SEAT_ROWS.length; r++){
    html += '<div class="seat-row"><span class="rowlabel">' + SEAT_ROWS[r] + '</span>';
    for (var c = 1; c <= SEATS_PER_ROW; c++){
      var code = SEAT_ROWS[r] + c;
      var taken  = seatInList(s.occupiedSeats, code);
      var picked = seatInList(selectedSeats, code);
      var cls = "seat" + (taken ? " taken" : "") + (picked ? " picked" : "");
      html += '<button class="' + cls + '" data-seat="' + code + '"' + (taken ? " disabled" : "") +
              ' title="' + code + (taken ? " — sudah terisi" : "") + '">' + c + '</button>';
    }
    html += '</div>';
  }
  html += '</div>';
  html += '<div class="legend">' +
          '<span><i class="l-free"></i>Tersedia</span>' +
          '<span><i class="l-pick"></i>Dipilih</span>' +
          '<span><i class="l-take"></i>Tidak tersedia</span></div>';
  area.innerHTML = html;
}

function toggleSeat(code){
  if (selectedShowtime === null) return;
  if (seatInList(selectedShowtime.occupiedSeats, code)) return;   // kursi terisi tidak bisa dipilih

  var newList = [], removed = false;
  for (var i = 0; i < selectedSeats.length; i++){
    if (selectedSeats[i] === code) removed = true;
    else newList[newList.length] = selectedSeats[i];
  }
  if (!removed) newList[newList.length] = code;
  selectedSeats = newList;

  lastTransaction = null;
  renderSeatMap();
  renderSummary();
}

function renderSummary(){
  var area = $("summaryArea");

  if (selectedShowtime === null){
    area.innerHTML = '<div class="empty">Ringkasan akan muncul setelah sesi dan kursi dipilih.</div>';
    return;
  }

  var s = selectedShowtime;
  var qty = selectedSeats.length;
  var total = qty * s.price;                       // total = jumlah kursi x harga tiket
  var seatText = (qty === 0) ? "— belum dipilih —" : joinSeats(selectedSeats);

  var html = '<div class="summary-list">';
  html += rowKV("Judul Film", s.movieTitle);
  html += rowKV("Franchise", s.franchise + " · " + s.genre);
  html += rowKV("Bioskop", s.cinemaName);
  html += rowKV("Studio", s.studio);
  html += rowKV("Jadwal", formatDate(s.date) + " · " + s.time);
  html += rowKV("Durasi / Usia", s.duration + " menit · " + s.ageRating);
  html += rowKV("Harga Tiket", formatRupiah(s.price));
  html += rowKV("Kursi Dipilih", seatText);
  html += rowKV("Jumlah Tiket", qty + " tiket");
  html += '</div>';

  html += '<div class="total-box"><span>Total Pembayaran</span><b>' + formatRupiah(total) + '</b></div>';
  html += '<button class="btn btn-primary" id="btnConfirm" style="width:100%"' + (qty === 0 ? " disabled" : "") + '>' +
          (qty === 0 ? "Pilih kursi terlebih dahulu" : "Konfirmasi Pemesanan Simulasi") + '</button>';

  if (lastTransaction !== null){
    html += '<div class="ticket">';
    html += '<h4>✓ Pemesanan Simulasi Berhasil</h4>';
    html += '<div class="trx">' + escapeHtml(lastTransaction.trxId) + '</div>';
    html += '<div class="summary-list">';
    html += rowKV("Judul Film", lastTransaction.movieTitle);
    html += rowKV("Jadwal", formatDate(lastTransaction.date) + " · " + lastTransaction.time);
    html += rowKV("Studio", lastTransaction.studio);
    html += rowKV("Nomor Kursi", joinSeats(lastTransaction.seats));
    html += rowKV("Jumlah Tiket", lastTransaction.qty + " tiket");
    html += rowKV("Total Harga", formatRupiah(lastTransaction.total));
    html += '</div>';
    html += '<p style="font-size:.76rem;color:var(--muted-2)">Transaksi ini hanya simulasi tampilan. Tidak ada ' +
            'pembayaran dan tidak ada penyimpanan permanen: data kembali ke kondisi awal begitu halaman ' +
            'dimuat ulang atau Anda berpindah halaman.</p>';
    html += '</div>';
  }

  area.innerHTML = html;
  var btn = $("btnConfirm");
  if (btn) btn.addEventListener("click", confirmBooking);
}

function rowKV(k, v){
  return '<div><span>' + escapeHtml(k) + '</span><span>' + escapeHtml(v) + '</span></div>';
}

function confirmBooking(){
  if (selectedShowtime === null || selectedSeats.length === 0) return;

  var s = selectedShowtime;
  var qty = selectedSeats.length;
  var total = qty * s.price;

  /* ID transaksi simulasi — hanya untuk tampilan selama halaman terbuka */
  var stamp = String(Date.now());
  var rand = String(Math.floor(Math.random() * 9000) + 1000);
  var trxId = "MTT-" + s.id + "-" + stamp.substring(stamp.length - 5) + "-" + rand;

  /* Kursi ditandai terisi DI MEMORI saja (tidak disimpan permanen) */
  for (var i = 0; i < selectedSeats.length; i++){
    s.occupiedSeats[s.occupiedSeats.length] = selectedSeats[i];
  }
  s.availableSeats = TOTAL_SEATS - s.occupiedSeats.length;

  lastTransaction = {
    trxId: trxId, movieTitle: s.movieTitle, date: s.date, time: s.time,
    studio: s.studio, seats: copyArray(selectedSeats), qty: qty, total: total
  };
  selectedSeats = [];

  renderSeatMap();
  renderSummary();
  renderSessionDetail();
}

/* =========================================================================================
   HALAMAN 4 — DATA STRUCTURE LAB (structure-lab.html)
   ========================================================================================= */
var labDisplayed = [];       // kumpulan data yang sedang "dikerjakan" di laboratorium
var labSelectedIndex = 0;    // indeks master untuk Struct & Pointer Viewer

function initLab(){
  labDisplayed = copyArray(showtimes);
  fillDateOptions("labQDate");

  /* dropdown pemilih sesi untuk Struct / Pointer Viewer */
  var html = "";
  for (var i = 0; i < showtimes.length; i++){
    html += '<option value="' + showtimes[i].id + '">[' + i + '] ' + showtimes[i].id + " · " +
            escapeHtml(showtimes[i].movieTitle) + '</option>';
  }
  $("labSelect").innerHTML = html;
  $("labSelect").addEventListener("change", function(){
    labSelectedIndex = findMasterIndexById(this.value);   // dicari manual pada array master
    renderArrayViewer();
    renderStructViewer();
    renderPointerViewer();
  });

  /* tab */
  var tabs = document.getElementsByClassName("tab");
  for (var t = 0; t < tabs.length; t++){
    tabs[t].addEventListener("click", function(){ activateLabTab(this.getAttribute("data-tab")); });
  }

  /* Sorting Lab */
  $("labSortAsc").addEventListener("click",  function(){ runLabSort("asc"); });
  $("labSortDesc").addEventListener("click", function(){ runLabSort("desc"); });
  $("labResetSortLog").addEventListener("click", function(){
    renderLogBox("labSortLogBox", [], "Belum ada proses sorting dijalankan.");
    setText("labSortCmp", 0); setText("labSortSwap", 0); setText("labSortPass", 0); setText("labSortDir", "—");
  });

  /* Searching Lab */
  $("labBtnSearch").addEventListener("click", runLabSearch);
  $("labResetSearchLog").addEventListener("click", function(){
    renderLogBox("labSearchLogBox", [], "Belum ada proses pencarian dijalankan.");
    setText("labSrcChecked", 0); setText("labSrcFound", 0); setText("labSrcCriteria", 0); setText("labSrcStatus", "—");
  });
  $("labResetData").addEventListener("click", function(){
    labDisplayed = copyArray(showtimes);
    $("labQTitle").value = ""; $("labQFranchise").value = ""; $("labQDate").value = "";
    setText("labDataNote", "data kerja: " + labDisplayed.length + " sesi (seluruh isi array master)");
    renderLogBox("labSortLogBox", [], "Belum ada proses sorting dijalankan.");
    renderLogBox("labSearchLogBox", [], "Belum ada proses pencarian dijalankan.");
    setText("labSortCmp", 0); setText("labSortSwap", 0); setText("labSortPass", 0); setText("labSortDir", "—");
    setText("labSrcChecked", 0); setText("labSrcFound", 0); setText("labSrcCriteria", 0); setText("labSrcStatus", "—");
  });

  renderArrayViewer();
  renderStructViewer();
  renderPointerViewer();
  renderLogBox("labSortLogBox", [], "Belum ada proses sorting dijalankan.");
  renderLogBox("labSearchLogBox", [], "Belum ada proses pencarian dijalankan.");
  setText("labDataNote", "data kerja: " + labDisplayed.length + " sesi (seluruh isi array master)");
}

/* Dipanggil juga oleh guided tour agar panel yang disorot benar-benar terlihat */
function activateLabTab(name){
  var tabs = document.getElementsByClassName("tab");
  for (var a = 0; a < tabs.length; a++){
    tabs[a].className = (tabs[a].getAttribute("data-tab") === name) ? "tab active" : "tab";
  }
  var panels = document.getElementsByClassName("tab-panel");
  for (var p = 0; p < panels.length; p++){
    panels[p].className = (panels[p].getAttribute("data-panel") === name) ? "tab-panel active" : "tab-panel";
  }
}

function renderArrayViewer(){
  var table = $("arrayTable");
  if (!table) return;
  var tbody = table.getElementsByTagName("tbody")[0];

  var html = "";
  for (var i = 0; i < showtimes.length; i++){
    var s = showtimes[i];
    var cls = (i === labSelectedIndex) ? ' class="row-selected"' : "";
    html += "<tr" + cls + ">";
    html += '<td class="idx">[' + i + "]</td>";
    html += "<td>" + s.id + "</td>";
    html += "<td>" + escapeHtml(s.movieTitle) + "</td>";
    html += "<td>" + s.date + "</td>";
    html += "<td>" + s.time + "</td>";
    html += "<td>" + escapeHtml(s.studio) + "</td>";
    html += '<td class="num">' + formatRupiah(s.price) + "</td>";
    html += "<td>" + s.availableSeats + " / " + TOTAL_SEATS + "</td>";
    html += "</tr>";
  }
  tbody.innerHTML = html;

  setText("arrLen", showtimes.length);
  setText("arrFirst", showtimes[0].id);
  setText("arrLast", "[" + (showtimes.length - 1) + "]");
  setText("arrSelected", "[" + labSelectedIndex + "]");
}

function renderStructViewer(){
  var s = showtimes[labSelectedIndex];
  var fields = [
    ["id", s.id], ["movieTitle", s.movieTitle], ["franchise", s.franchise], ["genre", s.genre],
    ["duration", s.duration], ["ageRating", s.ageRating], ["cinemaName", s.cinemaName],
    ["studio", s.studio], ["date", s.date], ["time", s.time], ["price", s.price],
    ["availableSeats", s.availableSeats], ["isBestSeller", s.isBestSeller],
    ["posterPath", s.posterPath], ["occupiedSeats", "[" + joinSeats(s.occupiedSeats) + "]"]
  ];

  var html = "";
  for (var i = 0; i < fields.length; i++){
    var key = fields[i][0], val = fields[i][1];
    var tp = (key === "occupiedSeats") ? "array of string" : typeof val;
    html += '<div class="kv-item"><div class="k">' + key + '</div>';
    html += '<div class="v">' + escapeHtml(String(val)) + '</div>';
    html += '<div class="t">tipe data: ' + tp + '</div></div>';
  }
  $("structKv").innerHTML = html;

  var code = "";
  code += '<span class="key">// satu objek = satu "struct" sesi penayangan</span>\n{\n';
  code += '  id             : <span class="str">"' + s.id + '"</span>,\n';
  code += '  movieTitle     : <span class="str">"' + escapeHtml(s.movieTitle) + '"</span>,\n';
  code += '  franchise      : <span class="str">"' + escapeHtml(s.franchise) + '"</span>,\n';
  code += '  genre          : <span class="str">"' + escapeHtml(s.genre) + '"</span>,\n';
  code += '  duration       : <span class="num">' + s.duration + '</span>,\n';
  code += '  ageRating      : <span class="str">"' + s.ageRating + '"</span>,\n';
  code += '  cinemaName     : <span class="str">"' + escapeHtml(s.cinemaName) + '"</span>,\n';
  code += '  studio         : <span class="str">"' + escapeHtml(s.studio) + '"</span>,\n';
  code += '  date           : <span class="str">"' + s.date + '"</span>,\n';
  code += '  time           : <span class="str">"' + s.time + '"</span>,\n';
  code += '  price          : <span class="num">' + s.price + '</span>,\n';
  code += '  availableSeats : <span class="num">' + s.availableSeats + '</span>,\n';
  code += '  isBestSeller   : <span class="bool">' + s.isBestSeller + '</span>,\n';
  code += '  posterPath     : <span class="str">"' + escapeHtml(s.posterPath) + '"</span>,\n';
  code += '  occupiedSeats  : <span class="str">[' + s.occupiedSeats.length + ' kursi terisi]</span>\n}';
  $("structCode").innerHTML = code;
}

function renderPointerViewer(){
  var s = showtimes[labSelectedIndex];

  /* Pembuktian nyata: cari objek ber-ID sama di dalam DATA KERJA (yang mungkin sudah
     diurutkan Bubble Sort), lalu bandingkan identitasnya dengan objek di array master.
     Hasil true membuktikan sorting hanya memindahkan REFERENSI, bukan menggandakan objek. */
  var inWorking = null, posInWorking = -1;
  for (var w = 0; w < labDisplayed.length; w++){
    if (labDisplayed[w].id === s.id){ inWorking = labDisplayed[w]; posInWorking = w; break; }
  }
  var sameObject = (inWorking === showtimes[labSelectedIndex]);

  var html = '<pre class="code">';
  html += 'labSelectedIndex = <span class="num">' + labSelectedIndex + '</span>;   <span class="key">// indeks pada ARRAY MASTER</span>\n';
  html += 'sesiTerpilih     = showtimes[<span class="num">' + labSelectedIndex + '</span>];\n';
  html += 'posisiDiDataKerja = <span class="num">' + posInWorking + '</span>;  <span class="key">// indeks setelah sorting/searching — bisa berbeda</span>\n\n';
  html += '<span class="key">// pengecekan identitas referensi, bukan sekadar kesamaan nilai</span>\n';
  html += 'dataKerja[' + posInWorking + '] === showtimes[' + labSelectedIndex + ']  →  <span class="bool">' + sameObject + '</span>\n\n';
  html += 'sesiTerpilih.id         = <span class="str">"' + s.id + '"</span>\n';
  html += 'sesiTerpilih.movieTitle = <span class="str">"' + escapeHtml(s.movieTitle) + '"</span>\n';
  html += 'sesiTerpilih.price      = <span class="num">' + s.price + '</span>\n';
  html += '</pre>';

  html += '<div class="kv" style="margin-top:16px">';
  html += kvItem("Indeks array master", "[" + labSelectedIndex + "]");
  html += kvItem("ID sesi", s.id);
  html += kvItem("Judul film", s.movieTitle);
  html += kvItem("Tanggal & waktu", formatDate(s.date) + " · " + s.time);
  html += kvItem("Studio", s.studio);
  html += kvItem("Harga tiket", formatRupiah(s.price));
  html += kvItem("Ekspresi referensi", "showtimes[labSelectedIndex]");
  html += kvItem("Posisi di data kerja", posInWorking === -1 ? "tidak ada di hasil pencarian" : "[" + posInWorking + "]");
  html += kvItem("Status identitas", posInWorking === -1
          ? "Sesi ini sedang tidak termasuk data kerja"
          : (sameObject ? "Objek yang sama persis (referensi, bukan salinan)" : "TIDAK SINKRON"));
  html += '</div>';

  $("pointerArea").innerHTML = html;
}

function runLabSort(direction){
  if (labDisplayed.length === 0){
    renderLogBox("labSortLogBox", [{ type:"final", text:"Tidak ada data kerja, sorting tidak dijalankan." }], "");
    return;
  }
  var res = bubbleSortWithLog(labDisplayed, direction);
  labDisplayed = res.sorted;

  renderLogBox("labSortLogBox", res.log, "Belum ada proses sorting dijalankan.");
  setText("labSortCmp", res.comparisons);
  setText("labSortSwap", res.swaps);
  setText("labSortPass", res.passes);
  setText("labSortDir", direction === "asc" ? "Menaik" : "Menurun");
  setText("labDataNote", "data kerja: " + labDisplayed.length + " sesi · urutan terakhir " +
          (direction === "asc" ? "termurah → termahal" : "termahal → termurah"));

  renderArrayViewer();   // membuktikan array master tetap pada urutan semula
}

function runLabSearch(){
  var res = linearSearchWithLog(showtimes, {
    title: $("labQTitle").value,
    franchise: $("labQFranchise").value,
    date: $("labQDate").value
  });
  labDisplayed = res.results;

  renderLogBox("labSearchLogBox", res.log, "Belum ada proses pencarian dijalankan.");
  setText("labSrcChecked", res.checked);
  setText("labSrcFound", res.found);
  setText("labSrcCriteria", res.activeCount);
  setText("labSrcStatus", res.found > 0 ? "Ditemukan" : "Kosong");
  setText("labDataNote", "data kerja: " + labDisplayed.length + " sesi (hasil Linear Search)");
}

/* =========================================================================================
   INISIALISASI
   ========================================================================================= */
(function init(){
  syncAvailableSeats();
  markActiveNav();
  initStatusBanner();

  var page = document.body.getAttribute("data-page");
  if (page === "home")      initHome();
  else if (page === "catalog")  initCatalog();
  else if (page === "booking")  initBooking();
  else if (page === "lab")      initLab();
})();
