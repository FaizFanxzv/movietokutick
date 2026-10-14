/* =========================================================================================
   js/guided-tour.js — GUIDED TOUR DENGAN SPOTLIGHT OVERLAY
   -----------------------------------------------------------------------------------------
   Cara kerja spotlight:
   1. Sebuah elemen "lubang" (.tour-hole) diposisikan tepat di atas elemen sasaran memakai
      getBoundingClientRect().
   2. Lubang itu diberi box-shadow berukuran sangat besar (0 0 0 9999px hitam transparan),
      sehingga seluruh layar menjadi gelap KECUALI area di dalam lubang.
   3. Coachmark (.tour-card) diposisikan di bawah atau di atas lubang, selalu dijaga agar
      tidak keluar dari viewport.
   4. Posisi dihitung ulang setiap kali halaman di-scroll atau ukuran layar berubah.

   Tur muncul otomatis saat halaman dibuka dan dapat diulang lewat tombol "Tur Panduan".
   Status tur TIDAK disimpan (tanpa localStorage), sesuai batasan tugas.
   ========================================================================================= */

var GuidedTour = (function(){

  /* ------------------------------------------------------------------ definisi langkah */
  var TOUR_STEPS = {

    home: [
      { selector:"#tourLogo",
        title:"Selamat datang di MovieTokuTick",
        text:"Website pemesanan tiket bioskop khusus film Tokusatsu Jepang. Proyek ini dibuat dengan HTML, CSS, dan JavaScript murni untuk tugas mata kuliah Struktur Data — tanpa database dan tanpa backend." },
      { selector:"#tourNav",
        title:"Navigasi empat halaman",
        text:"Setiap bagian punya halaman HTML sendiri: <code>index.html</code> (beranda), <code>catalog.html</code> (katalog), <code>booking.html</code> (pemesanan), dan <code>structure-lab.html</code> (laboratorium struktur data)." },
      { selector:"#tourHeroSearch",
        title:"Pencarian cepat",
        text:"Ketik judul film di sini. Kata kunci dikirim ke halaman katalog lewat parameter URL, lalu diproses dengan algoritma <b>Linear Search</b> yang ditulis manual." },
      { selector:"#tourBest",
        title:"Bagian Best Seller",
        text:"Kartu di sini diambil dari sesi yang punya atribut <code>isBestSeller: true</code> pada array master. Label ini data simulasi yang ditetapkan manual di <code>js/data.js</code>, bukan angka penjualan sungguhan." },
      { selector:"#tourFeatures",
        title:"Mulai dari sini",
        text:"Tiga pintu masuk utama: menjelajah katalog, memesan tiket, atau langsung membedah Array, Struct, Pointer, Sorting, dan Searching di Data Structure Lab." }
    ],

    catalog: [
      { selector:"#tourSearchFields",
        title:"Linear Search tiga kriteria",
        text:"Judul, franchise/genre, dan tanggal bisa dipakai bersamaan. Program memeriksa elemen array <b>satu per satu dari indeks 0</b> sampai elemen terakhir. Kriteria yang dikosongkan tidak membatasi pencarian." },
      { selector:"#tourSortButtons",
        title:"Bubble Sort harga tiket",
        text:"Dua tombol ini menjalankan <b>Bubble Sort</b> manual: membandingkan dua kartu yang berdekatan lalu menukarnya bila urutan harganya salah. Yang diurutkan adalah <b>salinan</b> data, jadi array master tidak berubah." },
      { selector:"#tourGrid",
        title:"Katalog sesi penayangan",
        text:"Setiap kartu mewakili satu objek sesi di dalam array <code>showtimes</code>. Badge <code>idx</code> menampilkan posisi aslinya pada array master. Tekan <b>Pesan</b> untuk membuka halaman pemesanan dengan ID sesi tersebut." },
      { selector:"#searchLogBox",
        title:"Log proses yang sebenarnya",
        text:"Panel ini mencatat proses nyata: tiap pemeriksaan Linear Search di sini, dan tiap perbandingan serta pertukaran Bubble Sort pada panel di sebelahnya. Isinya dihasilkan saat algoritma berjalan, bukan teks contoh." }
    ],

    booking: [
      { selector:"#tourSession",
        title:"Memilih sesi penayangan",
        text:"ID sesi dikirim dari katalog lewat URL, misalnya <code>booking.html?id=ST-004</code>. Halaman ini mencari objeknya secara manual di array master dengan perulangan, bukan dengan <code>find()</code>." },
      { selector:"#tourDetail",
        title:"Pointer dan indeks master",
        text:"<code>selectedShowtimeIndex</code> menyimpan indeks pada array master, dan <code>selectedShowtime</code> menyimpan referensi ke objeknya. JavaScript memakai referensi objek, bukan alamat memori mentah seperti pointer C/C++." },
      { selector:"#tourSeats",
        title:"Peta kursi studio",
        text:"Enam baris kali delapan kursi, datanya ditulis manual di <code>js/data.js</code>. Kursi merah gelap sudah terisi dan tidak bisa diklik, kursi merah terang berarti sedang Anda pilih." },
      { selector:"#tourSummary",
        title:"Ringkasan dan total harga",
        text:"Total dihitung dari jumlah kursi dikali harga tiket sesi terpilih. Tombol konfirmasi hanya aktif jika minimal satu kursi dipilih." },
      { selector:"#tourDisclaimer",
        title:"Semuanya simulasi",
        text:"Tidak ada database, pembayaran, maupun penyimpanan permanen. Kursi yang dipesan hanya ditandai di memori dan kembali ke kondisi awal begitu halaman dimuat ulang atau Anda berpindah halaman." }
    ],

    lab: [
      { selector:"#tourTabs", tab:"array",
        title:"Lima panel pembelajaran",
        text:"Setiap tab membedah satu materi: Array, Struct, Pointer/Reference, Sorting, dan Searching. Semua isinya diambil langsung dari data program yang sedang berjalan." },
      { selector:"#tourArray", tab:"array",
        title:"1. Array",
        text:"<code>showtimes</code> adalah array master berisi 12 objek sesi. Kolom paling kiri adalah <b>indeks</b>, dimulai dari 0. Indeks inilah alamat logis untuk mengakses tiap elemen." },
      { selector:"#tourStruct", tab:"struct",
        title:"2. Struct",
        text:"Satu objek menggabungkan 15 atribut berbeda tipe menjadi satu kesatuan data. JavaScript tidak punya kata kunci <code>struct</code> seperti C/C++, jadi objek dipakai sebagai <b>representasi</b> struct — bukan struct yang sesungguhnya." },
      { selector:"#tourPointer", tab:"pointer",
        title:"3. Pointer / Reference",
        text:"Panel ini membuktikan objek di data kerja dan di array master adalah <b>objek yang sama</b>, bukan salinan. Bedanya dengan C/C++: pointer di sana menyimpan alamat memori dan bisa diaritmetikakan, sedangkan JavaScript hanya memberi referensi tanpa akses ke alamat mentah." },
      { selector:"#tourLabSearch", tab:"searching",
        title:"4. Searching — Linear Search",
        text:"Jalankan pencarian, lalu baca lognya: nomor pemeriksaan, indeks yang sedang diperiksa, hasil tiap kriteria, dan keputusan cocok atau tidak. Kompleksitas waktunya O(n) karena seluruh elemen berpotensi diperiksa." },
      { selector:"#tourLabSort", tab:"sorting",
        title:"5. Sorting — Bubble Sort",
        text:"Tekan tombol pengurutan, lalu perhatikan log per PASS: pasangan yang dibandingkan, keputusan TUKAR atau tidak, dan keadaan array di akhir tiap putaran. Bila satu putaran berjalan tanpa pertukaran, perulangan berhenti lebih awal." }
    ]
  };

  /* ------------------------------------------------------------------ state internal */
  var steps = [];
  var current = 0;
  var overlay = null, hole = null, card = null;
  var active = false;
  var targetEl = null;

  /* ------------------------------------------------------------------ membangun elemen */
  function buildElements(){
    overlay = document.createElement("div");
    overlay.className = "tour-overlay";
    overlay.title = "Klik area gelap untuk menutup tur";
    /* Mengklik area gelap juga menutup tur, sehingga pengguna tidak pernah terkunci
       di dalam tutorial. Alternatif lain: tombol Lewati/Selesai atau tombol Escape. */
    overlay.addEventListener("click", stop);

    hole = document.createElement("div");
    hole.className = "tour-hole";

    card = document.createElement("div");
    card.className = "tour-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-live", "polite");

    document.body.appendChild(overlay);
    document.body.appendChild(hole);
    document.body.appendChild(card);
  }

  function removeElements(){
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (hole && hole.parentNode) hole.parentNode.removeChild(hole);
    if (card && card.parentNode) card.parentNode.removeChild(card);
    overlay = null; hole = null; card = null;
  }

  /* ------------------------------------------------------------------ isi coachmark */
  function renderCard(){
    var step = steps[current];
    var isLast = (current === steps.length - 1);

    var dots = "";
    for (var i = 0; i < steps.length; i++){
      dots += '<i class="' + (i === current ? "on" : "") + '"></i>';
    }

    var html = "";
    html += '<div class="tour-step">Langkah ' + (current + 1) + ' dari ' + steps.length + '</div>';
    html += '<div class="tour-dots">' + dots + '</div>';
    html += '<h4>' + step.title + '</h4>';
    html += '<p>' + step.text + '</p>';
    html += '<div class="tour-foot">';
    html += '<button class="tour-skip" data-tour-act="skip">Lewati</button>';
    html += '<span class="spacer"></span>';
    if (current > 0) html += '<button class="btn btn-sm" data-tour-act="prev">Sebelumnya</button>';
    html += '<button class="btn btn-primary btn-sm" data-tour-act="' + (isLast ? "finish" : "next") + '">' +
            (isLast ? "Selesai" : "Lanjut") + '</button>';
    html += '</div>';
    card.innerHTML = html;

    /* tombol dipasang ulang setiap langkah */
    var btns = card.querySelectorAll("[data-tour-act]");
    for (var b = 0; b < btns.length; b++){
      btns[b].addEventListener("click", function(){
        var act = this.getAttribute("data-tour-act");
        if (act === "next") next();
        else if (act === "prev") prev();
        else stop();          // skip & finish sama-sama menutup tur
      });
    }
  }

  /* ------------------------------------------------------------------ hitung posisi */
  function position(){
    if (!active || !targetEl) return;

    var r = targetEl.getBoundingClientRect();
    var pad = 10;
    var vw = window.innerWidth, vh = window.innerHeight;

    var hx = r.left - pad, hy = r.top - pad;
    var hw = r.width + pad * 2, hh = r.height + pad * 2;

    /* jaga agar lubang tidak melebar keluar layar */
    if (hx < 6) { hw += hx - 6; hx = 6; }
    if (hy < 6) { hh += hy - 6; hy = 6; }
    if (hx + hw > vw - 6) hw = vw - 6 - hx;
    if (hy + hh > vh - 6) hh = vh - 6 - hy;

    hole.style.left   = hx + "px";
    hole.style.top    = hy + "px";
    hole.style.width  = Math.max(hw, 20) + "px";
    hole.style.height = Math.max(hh, 20) + "px";

    /* Penempatan coachmark, dicoba berurutan sampai ada yang muat di viewport:
       bawah lubang → atas lubang → sisi kanan → sisi kiri → tengah layar.
       Penempatan di sisi dipakai saat elemen sasaran terlalu tinggi, supaya coachmark
       tidak menutupi isi elemen yang sedang dijelaskan. */
    var cw = card.offsetWidth, ch = card.offsetHeight;
    var gap = 14, m = 10;
    var top, left;

    var centerLeft = r.left + r.width / 2 - cw / 2;
    if (centerLeft < m) centerLeft = m;
    if (centerLeft + cw > vw - m) centerLeft = vw - m - cw;

    var verticalCenter = hy + hh / 2 - ch / 2;
    if (verticalCenter < m) verticalCenter = m;
    if (verticalCenter + ch > vh - m) verticalCenter = vh - m - ch;

    if (hy + hh + gap + ch <= vh - m){            // 1. di bawah lubang
      top = hy + hh + gap; left = centerLeft;
    } else if (hy - gap - ch >= m){               // 2. di atas lubang
      top = hy - gap - ch; left = centerLeft;
    } else if (hx + hw + gap + cw <= vw - m){     // 3. di sisi kanan lubang
      top = verticalCenter; left = hx + hw + gap;
    } else if (hx - gap - cw >= m){               // 4. di sisi kiri lubang
      top = verticalCenter; left = hx - gap - cw;
    } else {                                      // 5. terpaksa di tengah layar
      top = Math.max(m, (vh - ch) / 2); left = centerLeft;
    }

    card.style.top  = top + "px";
    card.style.left = left + "px";
  }

  /* ------------------------------------------------------------------ pindah langkah */
  function show(){
    var step = steps[current];

    /* beberapa langkah perlu membuka tab tertentu lebih dulu */
    if (step.tab && typeof activateLabTab === "function") activateLabTab(step.tab);

    targetEl = document.querySelector(step.selector);
    if (!targetEl){            // selector tidak ada di halaman ini → lewati dengan aman
      if (current < steps.length - 1){ current++; show(); }
      else stop();
      return;
    }

    renderCard();

    /* pastikan elemen sasaran terlihat sebelum posisinya dihitung */
    var r = targetEl.getBoundingClientRect();
    var needScroll = (r.top < 80) || (r.bottom > window.innerHeight - 80);
    if (needScroll){
      targetEl.scrollIntoView({ behavior:"smooth", block:"center" });
      setTimeout(position, 320);
      setTimeout(position, 650);
    }
    position();
  }

  function next(){ if (current < steps.length - 1){ current++; show(); } else stop(); }
  function prev(){ if (current > 0){ current--; show(); } }

  /* ------------------------------------------------------------------ mulai & berhenti */
  function start(pageKey){
    if (active) return;
    var list = TOUR_STEPS[pageKey];
    if (!list || list.length === 0) return;

    steps = list;
    current = 0;
    active = true;

    buildElements();
    window.addEventListener("scroll", position, true);
    window.addEventListener("resize", position);
    document.addEventListener("keydown", onKey);
    show();
  }

  /* Menutup tur: seluruh elemen overlay dihapus sehingga website kembali normal
     dan tidak ada lapisan gelap maupun penghalang klik yang tertinggal. */
  function stop(){
    if (!active) return;
    active = false;
    targetEl = null;
    window.removeEventListener("scroll", position, true);
    window.removeEventListener("resize", position);
    document.removeEventListener("keydown", onKey);
    removeElements();
  }

  function onKey(e){
    if (e.key === "Escape") stop();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  }

  return { start:start, stop:stop, isActive:function(){ return active; } };
})();

/* ---------------------------------------------------------------- pemasangan otomatis */
(function setupTour(){
  var page = document.body.getAttribute("data-page");

  /* tombol manual di header, berguna saat demonstrasi */
  var btn = document.getElementById("btnTour");
  if (btn){
    btn.addEventListener("click", function(){
      GuidedTour.stop();
      GuidedTour.start(page);
    });
  }

  /* Tur muncul otomatis setiap halaman dibuka. Statusnya tidak diingat setelah
     halaman dimuat ulang karena proyek ini dilarang memakai penyimpanan permanen. */
  window.setTimeout(function(){ GuidedTour.start(page); }, 700);
})();
