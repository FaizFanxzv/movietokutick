/* =========================================================================================
   js/data.js — SUMBER DATA TUNGGAL
   -----------------------------------------------------------------------------------------
   File ini dimuat oleh SEMUA halaman (index, catalog, booking, structure-lab) sehingga
   definisi data tidak pernah digandakan. Tidak ada database, backend, maupun API.
   Seluruh isi file ini adalah DATA SIMULASI untuk keperluan tugas akademik.

   KONSEP STRUCT
   JavaScript tidak memiliki kata kunci `struct` seperti C/C++. Objek di bawah ini berperan
   sebagai representasi struct: satu objek menggabungkan beberapa atribut dengan tipe berbeda
   (string, number, boolean, array) menjadi satu kesatuan data sesi penayangan.

        // Padanan di C/C++ — hanya ilustrasi, bukan kode yang dijalankan:
        // struct Showtime {
        //     char id[10]; char movieTitle[80]; int duration;
        //     float price; int availableSeats; bool isBestSeller;
        // };

   KONSEP ARRAY
   `showtimes` adalah ARRAY MASTER. Indeks 0..n-1 menunjuk posisi tiap objek sesi.
   Urutan array ini TIDAK PERNAH diubah oleh proses sorting (lihat js/algorithms.js).
   ========================================================================================= */

/* Tata letak kursi studio — ditulis manual (6 baris x 8 kursi = 48 kursi per studio). */
var SEAT_ROWS = ["A", "B", "C", "D", "E", "F"];
var SEATS_PER_ROW = 8;
var TOTAL_SEATS = SEAT_ROWS.length * SEATS_PER_ROW;

/* -----------------------------------------------------------------------------------------
   GANTI POSTER DI SINI
   Ubah nilai properti `posterPath` menjadi nama file poster milik Anda, lalu letakkan
   gambarnya di folder `assets/`. Rasio yang disarankan 2:3 potret (misalnya 600 x 900 px).
   Jika file belum ada, kartu otomatis menampilkan placeholder "Masukkan Poster Film di Sini"
   tanpa mengubah ukuran kartu dan tanpa menyentuh logika Sorting maupun Searching.
   ----------------------------------------------------------------------------------------- */
var showtimes = [
  { id:"ST-001", movieTitle:"Shin Godzilla", franchise:"Godzilla", genre:"Kaiju / Tokusatsu",
    duration:120, ageRating:"13+", cinemaName:"MovieTokuTick Hero Plaza", studio:"Studio 1 — IMAX",
    date:"2026-10-16", time:"13:00", price:65000, availableSeats:42, isBestSeller:true,
    posterPath:"assets/poster-film-01.jpg",
    occupiedSeats:["A1","A2","B5","C3","C4","D7"] },

  { id:"ST-002", movieTitle:"Shin Godzilla", franchise:"Godzilla", genre:"Kaiju / Tokusatsu",
    duration:120, ageRating:"13+", cinemaName:"MovieTokuTick Nebula Square", studio:"Studio 3 — Regular",
    date:"2026-10-17", time:"19:30", price:45000, availableSeats:38, isBestSeller:false,
    posterPath:"assets/poster-film-01.jpg",
    occupiedSeats:["A3","A4","A5","B1","B2","B3","C6","D2","E8","F1"] },

  { id:"ST-003", movieTitle:"Shin Ultraman", franchise:"Ultraman", genre:"Sci-Fi / Tokusatsu",
    duration:112, ageRating:"SU", cinemaName:"MovieTokuTick Nebula Square", studio:"Studio 2 — Deluxe",
    date:"2026-10-16", time:"16:15", price:55000, availableSeats:45, isBestSeller:true,
    posterPath:"assets/poster-film-02.jpg",
    occupiedSeats:["C1","C2","D4"] },

  { id:"ST-004", movieTitle:"Shin Kamen Rider", franchise:"Kamen Rider", genre:"Action / Tokusatsu",
    duration:121, ageRating:"13+", cinemaName:"MovieTokuTick Hero Plaza", studio:"Studio 4 — Premiere",
    date:"2026-10-18", time:"20:00", price:75000, availableSeats:34, isBestSeller:true,
    posterPath:"assets/poster-film-03.jpg",
    occupiedSeats:["A1","A2","A3","A4","B1","B2","B3","C5","C6","D1","D8","E3","E4","F6"] },

  { id:"ST-005", movieTitle:"Shin Kamen Rider", franchise:"Kamen Rider", genre:"Action / Tokusatsu",
    duration:121, ageRating:"13+", cinemaName:"MovieTokuTick Henshin Center", studio:"Studio 3 — Regular",
    date:"2026-10-16", time:"11:45", price:40000, availableSeats:40, isBestSeller:false,
    posterPath:"assets/poster-film-03.jpg",
    occupiedSeats:["A6","A7","B4","B5","C7","D3","E1","F8"] },

  { id:"ST-006", movieTitle:"Godzilla Minus One", franchise:"Godzilla", genre:"Drama / Kaiju",
    duration:125, ageRating:"13+", cinemaName:"MovieTokuTick Nebula Square", studio:"Studio 1 — IMAX",
    date:"2026-10-19", time:"18:45", price:70000, availableSeats:28, isBestSeller:true,
    posterPath:"assets/poster-film-04.jpg",
    occupiedSeats:["A1","A2","A3","A4","A5","A6","B1","B2","B3","B4","C1","C2","C3","D1","D2","D3","E1","E2","F1","F2"] },

  { id:"ST-007", movieTitle:"Kamen Rider Heisei Generations FOREVER", franchise:"Kamen Rider", genre:"Action / Fantasi",
    duration:97, ageRating:"SU", cinemaName:"MovieTokuTick Henshin Center", studio:"Studio 2 — Deluxe",
    date:"2026-10-17", time:"10:30", price:38000, availableSeats:43, isBestSeller:false,
    posterPath:"assets/poster-film-05.jpg",
    occupiedSeats:["B6","B7","C8","D5","E6"] },

  { id:"ST-008", movieTitle:"GARO: Divine Flame", franchise:"GARO", genre:"Dark Fantasy",
    duration:70, ageRating:"17+", cinemaName:"MovieTokuTick Hero Plaza", studio:"Studio 3 — Regular",
    date:"2026-10-18", time:"21:30", price:50000, availableSeats:36, isBestSeller:false,
    posterPath:"assets/poster-film-06.jpg",
    occupiedSeats:["A2","A3","B2","B3","C2","C3","D2","D3","E2","E3","F2","F3"] },

  { id:"ST-009", movieTitle:"Kaizoku Sentai Gokaiger: The Movie", franchise:"Super Sentai", genre:"Petualangan",
    duration:65, ageRating:"SU", cinemaName:"MovieTokuTick Henshin Center", studio:"Studio 5 — Family",
    date:"2026-10-16", time:"09:15", price:35000, availableSeats:46, isBestSeller:false,
    posterPath:"assets/poster-film-07.jpg",
    occupiedSeats:["E7","F4"] },

  { id:"ST-010", movieTitle:"Space Sheriff Gavan: The Movie", franchise:"Metal Hero", genre:"Sci-Fi / Action",
    duration:95, ageRating:"13+", cinemaName:"MovieTokuTick Nebula Square", studio:"Studio 4 — Premiere",
    date:"2026-10-19", time:"15:00", price:60000, availableSeats:32, isBestSeller:true,
    posterPath:"assets/poster-film-08.jpg",
    occupiedSeats:["A1","A8","B1","B8","C1","C8","D1","D8","E1","E8","F1","F8","C4","C5","D4","D5"] },

  { id:"ST-011", movieTitle:"Kaizoku Sentai Gokaiger: The Movie", franchise:"Super Sentai", genre:"Petualangan",
    duration:65, ageRating:"SU", cinemaName:"MovieTokuTick Hero Plaza", studio:"Studio 3 — Regular",
    date:"2026-10-18", time:"13:20", price:45000, availableSeats:39, isBestSeller:false,
    posterPath:"assets/poster-film-07.jpg",
    occupiedSeats:["A4","A5","B6","C7","D2","D6","E5","F3","F7"] },

  { id:"ST-012", movieTitle:"Shin Ultraman", franchise:"Ultraman", genre:"Sci-Fi / Tokusatsu",
    duration:112, ageRating:"SU", cinemaName:"MovieTokuTick Henshin Center", studio:"Studio 1 — IMAX",
    date:"2026-10-19", time:"12:10", price:58000, availableSeats:41, isBestSeller:false,
    posterPath:"assets/poster-film-02.jpg",
    occupiedSeats:["A7","B8","C6","D4","E2","E6","F5"] }
];

/* Menyelaraskan availableSeats dengan jumlah kursi yang benar-benar terisi.
   Dipanggil sekali saat halaman dimuat. */
function syncAvailableSeats(){
  for (var i = 0; i < showtimes.length; i++){
    showtimes[i].availableSeats = TOTAL_SEATS - showtimes[i].occupiedSeats.length;
  }
}
