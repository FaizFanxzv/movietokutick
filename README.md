# MovieTokuTick — Website Pemesanan Tiket Bioskop Tokusatsu

**Tugas Mata Kuliah Struktur Data**
Materi yang diterapkan: Array · Struct · Pointer/Referensi · Sorting · Searching

| | |
|---|---|
| **Nama** | Faiz |
| **NIM** | *(isi NIM Anda)* |
| **Kelas** | PTI 2025D |
| **Program Studi** | Pendidikan Teknologi Informasi — Universitas Negeri Surabaya |
| **Repository** | https://github.com/FaizFanxzv/*(nama-repo)* |
| **Status** | 🟡 **PROGRESS — Pengumpulan Tahap Awal** |
| **Tanggal** | 14 Oktober 2026 |
| **Website** | https://faizfanxzv.github.io/movietokutick/ |

---

## Halo, Bapak/Ibu Dosen 👋

Terima kasih sudah menyempatkan membuka repository ini. Saya ingin menyampaikan lebih dulu
bahwa **pengumpulan kali ini masih berstatus progress**, bukan versi final.

Yang saya kumpulkan pada tahap ini:

- ✅ **Program lengkap** — seluruh file sumber website, sudah bisa langsung dijalankan
- ✅ **Link GitHub** — repository ini

Yang **belum** saya kumpulkan pada tahap ini:

- ⏳ **Video demonstrasi** — masih dalam proses perekaman, akan menyusul pada pengumpulan berikutnya
- ⏳ **Aset poster film** — folder `assets/` sengaja saya biarkan kosong dulu, tetapi
  program tetap berjalan normal karena sudah ada sistem placeholder (penjelasannya di bawah)

Jadi untuk sementara, penilaian bisa dilakukan langsung dari kode dan dari website yang
dijalankan di browser. Semua fitur inti sudah berfungsi, tidak ada bagian yang masih berupa
mockup atau tombol kosong.

---

## Cara Menjalankan (tanpa install apa pun)

1. Download repository ini (tombol **Code → Download ZIP**), lalu ekstrak.
2. Klik dua kali file **`index.html`**.
3. Selesai — website langsung terbuka di browser.

Tidak perlu internet, tidak perlu web server, tidak perlu Node.js, XAMPP, atau database.
Websitenya murni HTML5, CSS3, dan JavaScript vanilla.

> Saat pertama dibuka, akan muncul **tur panduan** (spotlight tutorial) yang menjelaskan
> tiap bagian halaman. Tur bisa ditutup kapan saja dengan tombol **Lewati**, tombol
> **Escape**, atau klik area gelap, dan bisa dibuka lagi lewat tombol **🧭 Tur Panduan**
> di pojok kanan atas.

---

## Isi Website

Website ini terdiri atas **empat halaman HTML terpisah** yang saling terhubung:

| Halaman | Isi |
|---|---|
| `index.html` | Beranda: tagline, pencarian cepat, daftar film Best Seller |
| `catalog.html` | Katalog sesi penayangan + pencarian (Linear Search) + pengurutan harga (Bubble Sort) + panel log algoritma |
| `booking.html` | Detail sesi, peta kursi studio, ringkasan harga, konfirmasi pemesanan simulasi |
| `structure-lab.html` | **Data Structure Lab** — panel khusus untuk memeriksa Array, Struct, Pointer, Sorting, dan Searching |

Halaman `structure-lab.html` adalah bagian yang paling relevan untuk penilaian materi
kuliah. Di sana isi array, atribut objek, dan log algoritma bisa dilihat langsung dari
data program yang sedang berjalan.

---

## Letak Penerapan Materi

Supaya tidak perlu mencari satu per satu, berikut peta kodenya:

| Materi | File | Bagian |
|---|---|---|
| **Array** | `js/data.js` | Array master `showtimes` berisi 12 objek sesi penayangan |
| **Struct** | `js/data.js` | Objek sesi dengan 15 atribut sebagai representasi struct |
| **Pointer / Referensi** | `js/app.js` | `selectedShowtimeIndex`, `selectedShowtime`, `findMasterIndexById()` |
| **Sorting** | `js/algorithms.js` | `bubbleSortWithLog()` — Bubble Sort manual dua arah |
| **Searching** | `js/algorithms.js` | `linearSearchWithLog()` — Linear Search manual tiga kriteria |

Beberapa hal yang sengaja saya jaga saat menulis kode:

- **Algoritma ditulis manual.** `Array.sort()`, `Array.filter()`, `Array.find()`, dan
  `Array.findIndex()` tidak dipakai sama sekali di kode aktif. Semua pencarian,
  penyaringan, dan pengurutan memakai perulangan sendiri.
- **Log berasal dari proses nyata.** Panel log mencatat tiap perbandingan, pertukaran,
  dan pemeriksaan saat algoritma berjalan — bukan teks contoh yang saya ketik manual.
- **Array master tidak pernah berubah urutannya.** Bubble Sort dijalankan pada salinan
  data. Ini bisa dibuktikan dengan mengurutkan katalog lalu membuka tab *Array Viewer*:
  urutan `ST-001` sampai `ST-012` tetap sama.
- **Indeks master selalu benar.** Setelah pencarian atau pengurutan, indeks sesi dicari
  ulang berdasarkan ID, sehingga referensi objek tidak pernah tertukar.
- **Tidak ada klaim akademis yang berlebihan.** Saya menuliskan objek JavaScript sebagai
  *representasi* struct, bukan struct C/C++ yang sesungguhnya; dan referensi objek
  JavaScript dibedakan dengan pointer mentah C/C++ yang menyimpan alamat memori.

---

## Struktur Folder

```
MovieTokuTick/
├── index.html              Beranda
├── catalog.html            Katalog, pencarian, pengurutan, log algoritma
├── booking.html            Pemesanan tiket & pemilihan kursi
├── structure-lab.html      Data Structure Lab
├── css/
│   └── styles.css          Gaya visual untuk keempat halaman
├── js/
│   ├── data.js             Sumber data tunggal (array master + data kursi)
│   ├── algorithms.js       Bubble Sort & Linear Search manual
│   ├── app.js              Logika antarmuka tiap halaman
│   └── guided-tour.js      Tur panduan spotlight
├── assets/                 Tempat poster film (masih kosong)
└── README.md               File ini
```

---

## Catatan Penting

**Tentang poster film.** Folder `assets/` masih kosong karena aset gambarnya belum saya
siapkan. Website tetap aman dijalankan: bila file poster belum ada, kartu film otomatis
menampilkan placeholder rapi bertuliskan *"Masukkan Poster Film di Sini"* dengan ukuran
kartu yang tidak berubah. Jadi tampilannya tidak rusak, hanya belum bergambar.
Konsol browser mungkin menampilkan pesan `ERR_FILE_NOT_FOUND` untuk gambar — itu normal
dan justru merupakan jalur yang memicu placeholder tadi, bukan error program.

**Tentang data.** Seluruh judul film, jadwal, harga, ketersediaan kursi, dan status
Best Seller adalah **data simulasi** yang saya tulis manual di dalam kode untuk keperluan
tugas. Tidak ada satu pun yang mewakili jadwal atau harga bioskop sungguhan.

**Tentang penyimpanan.** Proyek ini tidak memakai database, backend, API, maupun
`localStorage`. Pemilihan sesi dan kursi hanya tersimpan di memori selama halaman terbuka,
sehingga semua data kembali ke kondisi awal setiap kali halaman dimuat ulang. Pemesanan
yang dikonfirmasi pun hanya simulasi tampilan, tanpa pembayaran apa pun.

---

## Rencana Tahap Berikutnya

1. Merekam video demonstrasi (sekitar 2–3 menit) yang menunjukkan alur pemesanan serta
   pembacaan log Sorting dan Searching.
2. Memasukkan aset poster film ke folder `assets/`.
3. Merapikan tampilan berdasarkan masukan dari Bapak/Ibu Dosen bila ada.

Jika ada bagian yang perlu saya perbaiki atau jelaskan lebih lanjut, saya siap
menindaklanjutinya. Terima kasih banyak atas waktu dan bimbingannya 🙏
