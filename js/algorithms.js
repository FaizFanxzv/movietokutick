/* =========================================================================================
   js/algorithms.js — ALGORITMA & UTILITAS MANUAL
   -----------------------------------------------------------------------------------------
   Dimuat oleh semua halaman supaya setiap halaman memakai implementasi yang sama persis.

   CATATAN PENTING UNTUK PENILAIAN:
   Array.sort(), Array.filter(), Array.find(), dan Array.findIndex() sengaja TIDAK dipakai
   di seluruh proyek ini. Semua pencarian, penyaringan, dan pengurutan ditulis manual
   dengan perulangan.
   ========================================================================================= */

/* ---------------------------------------------------------------- utilitas array & teks */

/* Menyalin array referensi secara manual (shallow copy).
   Dipakai agar Bubble Sort tidak pernah mengubah urutan array master. */
function copyArray(source){
  var out = [];
  for (var i = 0; i < source.length; i++) out[out.length] = source[i];
  return out;
}

function trimText(t){ return String(t).replace(/^\s+|\s+$/g, ""); }

/* Pencocokan substring tanpa membedakan huruf besar/kecil — ditulis manual
   karakter per karakter, tanpa includes() maupun indexOf(). */
function containsText(source, keyword){
  var s = String(source).toLowerCase();
  var k = trimText(String(keyword).toLowerCase());
  if (k === "") return true;
  if (k.length > s.length) return false;
  for (var i = 0; i <= s.length - k.length; i++){
    var ok = true;
    for (var j = 0; j < k.length; j++){
      if (s.charAt(i + j) !== k.charAt(j)) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

/* Mencari INDEKS pada ARRAY MASTER berdasarkan ID — Linear Search sederhana.
   Selalu dipanggil ulang setiap kali pengguna memilih sesi, sehingga indeks hasil
   sorting tidak pernah tertukar dengan indeks array master. */
function findMasterIndexById(id){
  for (var i = 0; i < showtimes.length; i++){
    if (showtimes[i].id === id) return i;
  }
  return -1;
}

/* Cek keanggotaan kode kursi dalam sebuah array (manual, tanpa indexOf). */
function seatInList(list, seatCode){
  for (var i = 0; i < list.length; i++){
    if (list[i] === seatCode) return true;
  }
  return false;
}

/* Ringkasan isi array untuk keperluan log: [ID:harga, ID:harga, ...] */
function describeArray(arr){
  var s = "[";
  for (var i = 0; i < arr.length; i++){
    s += arr[i].id + ":" + arr[i].price;
    if (i < arr.length - 1) s += ", ";
  }
  return s + "]";
}

/* =========================================================================================
   SORTING — BUBBLE SORT (manual, lengkap dengan log proses nyata)
   -----------------------------------------------------------------------------------------
   Cara kerja: bandingkan dua elemen yang BERDEKATAN, tukar bila urutannya salah,
   ulangi sampai satu putaran berjalan tanpa pertukaran (early termination).
   Perbandingan dilakukan pada atribut `price`.
   ========================================================================================= */
function bubbleSortWithLog(sourceArray, direction){
  var arr = copyArray(sourceArray);   // SALINAN — array master tidak pernah disentuh
  var log = [];
  var comparisons = 0, swaps = 0, passes = 0;
  var dirLabel = (direction === "asc") ? "Termurah → Termahal (menaik)" : "Termahal → Termurah (menurun)";

  log[log.length] = { type:"head", text:"BUBBLE SORT berdasarkan atribut price" };
  log[log.length] = { type:"info", text:"Arah pengurutan : " + dirLabel };
  log[log.length] = { type:"info", text:"Jumlah elemen   : " + arr.length };
  log[log.length] = { type:"info", text:"Data awal       : " + describeArray(arr) };

  if (arr.length < 2){
    log[log.length] = { type:"final", text:"Data kurang dari 2 elemen, tidak ada proses pengurutan." };
    return { sorted:arr, log:log, comparisons:0, swaps:0, passes:0, direction:dirLabel };
  }

  var n = arr.length;
  for (var pass = 0; pass < n - 1; pass++){
    passes++;
    var swappedInThisPass = false;
    log[log.length] = { type:"pass", text:"── PASS " + (pass + 1) + " ──" };

    for (var j = 0; j < n - 1 - pass; j++){
      comparisons++;
      var a = arr[j];
      var b = arr[j + 1];

      var needSwap;
      if (direction === "asc") needSwap = a.price > b.price;   // menaik : kiri lebih mahal → tukar
      else                     needSwap = a.price < b.price;   // menurun: kiri lebih murah → tukar

      var line = "  [" + j + "] " + a.id + " (" + formatRupiah(a.price) + ")  vs  [" + (j + 1) + "] " +
                 b.id + " (" + formatRupiah(b.price) + ")  →  ";

      if (needSwap){
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swappedInThisPass = true;
        log[log.length] = { type:"swap", text:line + "TUKAR" };
      } else {
        var alasan = (a.price === b.price) ? "harga sama, urutan dipertahankan" : "urutan sudah benar";
        log[log.length] = { type:"keep", text:line + "TIDAK ditukar (" + alasan + ")" };
      }
    }

    log[log.length] = { type:"detail", text:"  Keadaan array setelah pass " + (pass + 1) + " : " + describeArray(arr) };
    if (!swappedInThisPass){
      log[log.length] = { type:"info", text:"  Tidak ada pertukaran pada pass ini → data sudah terurut, perulangan dihentikan lebih awal (early termination)." };
      break;
    }
  }

  log[log.length] = { type:"final", text:"HASIL AKHIR : " + describeArray(arr) };
  log[log.length] = { type:"final", text:"Total perbandingan = " + comparisons + " · Total pertukaran = " + swaps + " · Jumlah pass = " + passes };

  return { sorted:arr, log:log, comparisons:comparisons, swaps:swaps, passes:passes, direction:dirLabel };
}

/* =========================================================================================
   SEARCHING — LINEAR SEARCH (manual, lengkap dengan log proses nyata)
   -----------------------------------------------------------------------------------------
   Memeriksa elemen satu per satu dari indeks 0 sampai elemen terakhir.
   Kriteria: judul film, franchise/genre, dan tanggal tayang.
   Kriteria yang dikosongkan tidak menjadi pembatas pencarian.
   ========================================================================================= */
function linearSearchWithLog(sourceArray, criteria){
  var results = [];
  var log = [];
  var checked = 0;

  var activeCount = 0;
  if (trimText(criteria.title) !== "")     activeCount++;
  if (trimText(criteria.franchise) !== "") activeCount++;
  if (trimText(criteria.date) !== "")      activeCount++;

  log[log.length] = { type:"head", text:"LINEAR SEARCH pada array master showtimes" };
  log[log.length] = { type:"info", text:"Kriteria judul      : " + (trimText(criteria.title) === "" ? "(kosong — tidak membatasi)" : criteria.title) };
  log[log.length] = { type:"info", text:"Kriteria franchise  : " + (trimText(criteria.franchise) === "" ? "(kosong — tidak membatasi)" : criteria.franchise) };
  log[log.length] = { type:"info", text:"Kriteria tanggal    : " + (trimText(criteria.date) === "" ? "(kosong — tidak membatasi)" : criteria.date) };
  log[log.length] = { type:"info", text:"Kriteria aktif      : " + activeCount + " · Jumlah elemen diperiksa maksimal " + sourceArray.length };
  if (activeCount === 0){
    log[log.length] = { type:"info", text:"Seluruh kriteria kosong → semua elemen tetap diperiksa manual lalu ditampilkan." };
  }

  for (var i = 0; i < sourceArray.length; i++){
    checked++;
    var s = sourceArray[i];
    var isMatch = true;
    var details = [];

    /* Kriteria 1 — judul film */
    if (trimText(criteria.title) !== ""){
      var okTitle = containsText(s.movieTitle, criteria.title);
      details[details.length] = 'judul "' + s.movieTitle + '" mengandung "' + trimText(criteria.title) + '" ? ' + (okTitle ? "YA" : "TIDAK");
      if (!okTitle) isMatch = false;
    }
    /* Kriteria 2 — franchise ATAU genre */
    if (trimText(criteria.franchise) !== ""){
      var okFr = containsText(s.franchise, criteria.franchise) || containsText(s.genre, criteria.franchise);
      details[details.length] = 'franchise/genre "' + s.franchise + " / " + s.genre + '" cocok "' + trimText(criteria.franchise) + '" ? ' + (okFr ? "YA" : "TIDAK");
      if (!okFr) isMatch = false;
    }
    /* Kriteria 3 — tanggal tayang (harus sama persis) */
    if (trimText(criteria.date) !== ""){
      var okDate = (s.date === trimText(criteria.date));
      details[details.length] = "tanggal " + s.date + " == " + trimText(criteria.date) + " ? " + (okDate ? "YA" : "TIDAK");
      if (!okDate) isMatch = false;
    }

    log[log.length] = {
      type: isMatch ? "match" : "nomatch",
      text: "Pemeriksaan #" + checked + " · indeks [" + i + "] · " + s.id + " · " + s.movieTitle +
            " (" + s.franchise + ") · " + s.date + " " + s.time + "  →  " + (isMatch ? "COCOK ✓" : "TIDAK COCOK ✗")
    };
    for (var d = 0; d < details.length; d++){
      log[log.length] = { type:"detail", text:"      • " + details[d] };
    }

    if (isMatch) results[results.length] = s;   // menyimpan REFERENSI objek master, bukan salinannya
  }

  log[log.length] = { type:"final", text:"Jumlah elemen diperiksa : " + checked };
  log[log.length] = { type:"final", text:"Jumlah sesi ditemukan   : " + results.length };
  if (results.length === 0){
    log[log.length] = { type:"final", text:"Tidak ada sesi penayangan yang memenuhi seluruh kriteria aktif." };
  }

  return { results:results, log:log, checked:checked, found:results.length, activeCount:activeCount };
}
