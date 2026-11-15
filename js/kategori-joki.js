/* =====================================================================
   KATEGORI JOKI  (js/kategori-joki.js)
   Daftar game yang tampil di bagian "Kategori Joki" (beranda dan halaman Joki).
   Jumlah akun ready dan tombol "Lihat ..." muncul otomatis, tidak perlu ditulis.

   SATU GAME = 2 BARIS + garis ---
       Foto icon : bloxfruits.jpg        foto kotak 1:1 (ideal 600x600). Kosong = ilustrasi bawaan
       Nama Kategori : Blox Fruits       nama game. Harus sama dengan "Kategori :" di beli-joki.js
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

const KATEGORI_JOKI = String.raw`
Foto icon : Gambar/bloxfruits.jpg
Nama Kategori : Blox Fruits
Cari :
Filter : tidak
Urutkan : 
---
`;
