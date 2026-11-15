/* =====================================================================
   KATEGORI AKUN  (js/kategori-akun.js)
   Daftar game yang tampil di bagian "Kategori Akun" (beranda dan halaman Akun).
   Jumlah akun ready dan tombol "Lihat ..." muncul otomatis, tidak perlu ditulis.

   SATU GAME = 2 BARIS + garis ---
       Foto icon : bloxfruits.jpg        foto kotak 1:1 (ideal 600x600). Kosong = ilustrasi bawaan
       Nama Kategori : Blox Fruits       nama game. Harus sama dengan "Kategori :" di beli-akun.js
       ---

   TAMBAH   copy 3 baris di atas (sampai ---), tempel di bawahnya, ganti isinya
   HAPUS    hapus 3 barisnya
   URUTAN   urutan di file ini = urutan tampil di website

   OPSIONAL (taruh di bawah Nama Kategori):
       Warna : #ff9a62                   warna latar kalau tidak ada foto
       Keterangan : Joki level, raid     tulisan kecil di bawah nama game

   Baris yang diawali tanda #  = catatan, tidak tampil di website.
   Foto ditaruh di folder yang sama dengan index.html.
   ===================================================================== */

const KATEGORI_AKUN = String.raw`
Foto icon : Gambar/bloxfruits.jpg
Nama Kategori : Blox Fruits
---
Foto icon : Gambar/Steal An Egg.jpg
Nama Kategori : Steal An Egg
---
Foto icon : Gambar/Night 99.jpg
Nama Kategori : 99 Nights in the Forest
---
Foto icon : Gambar/Volleyball.jpg
Nama Kategori : Volleyball Legends
---
Foto icon : Gambar/evade.webp
Nama Kategori : Evade
---
Foto icon : Gambar/driving empire.webp
Nama Kategori : Driving Empire
---
Foto icon : Gambar/pet simulator 99.webp
Nama Kategori : Pet Simulator 99
---
Foto icon : Gambar/dead-rails.webp
Nama Kategori : Dead Rails
---
Foto icon : Gambar/murder-mystery-2.webp
Nama Kategori : Murder Mystery 2
---
Foto icon : Gambar/Fisch.jpg
Nama Kategori : Fisch
---
`;
