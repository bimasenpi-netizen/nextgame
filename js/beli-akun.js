/* =====================================================================
   HALAMAN PEMBELIAN AKUN  (js/beli-akun.js)
   Satu akun = satu blok. Ini yang tampil di kartu kategori DAN di halaman pembelian.

   SATU AKUN
       Kategori : Blox Fruits            nama game (sama dengan kategori-akun.js)
       Foto : 3                          foto 1080x1350, bisa di-slide (lihat cara foto di bawah)
       Nama Produk : Akun Level Tinggi
       Harga : 350000                    angka saja (boleh 350.000)
       Status : ready                    ready  atau  terjual
       Deskripsi :                       PALING BAWAH. Boleh panjang dan banyak baris.
       Tulis isi deskripsi di sini.
       ---                               garis penutup akun

   CARA ISI "Foto :"  (pilih satu)
       Foto : 3                          OTOMATIS: akun1-1.jpg, akun1-2.jpg, akun1-3.jpg
                                         (angka 1 = urutan akun ini dari atas di file ini)
                                         tambah / kurangi slide = ganti angkanya
       Foto : a.jpg, b.jpg, c.jpg        tulis nama file satu-satu (pisah koma)
       Foto :                            kosong = pakai foto kategori
       Foto pertama = foto di kartu daftar akun.
       Slide geser sendiri ke kiri tiap 5 detik. Kalau user geser / klik panah, diam 10 detik dulu.
       Kalau ada file yang tidak ketemu, slide itu otomatis dilewati.
   OPSIONAL:   Kode : egg1               nama file sendiri (egg1-1.jpg ...) supaya tidak ikut bergeser
                                         kalau urutan akun berubah.      Ext : png   kalau fotonya PNG

   OPSIONAL (taruh di bawah Harga, sebelum Deskripsi):
       Harga Coret : 25000               harga lama yang dicoret. Diskon (-40%) dihitung otomatis
       Label : Terlaris                  stiker di foto: Terlaris / Promo / Baru / teks bebas
       Tanggal : 2026-11-14              tanggal produk masuk (boleh juga 14-11-2026).
                                         Kurang dari 14 hari = stiker "Baru" muncul otomatis
                                         (ubah lamanya di config.js: baruHari).
                                         Tanggal juga dipakai untuk urutan "Terbaru". Produk tanpa tanggal
                                         ditaruh setelah yang bertanggal; sesama tanpa tanggal, yang ditulis
                                         paling bawah di file ini dianggap lebih baru.
       "Terlaris" tidak bisa otomatis (website ini tidak menyimpan data penjualan),
       jadi tulis sendiri di Label :  untuk produk yang paling laku.

   TAMBAH   copy satu blok (sampai ---), tempel di bawahnya, ganti isinya
   HAPUS    hapus satu blok
   LAKU     ganti  ready  menjadi  terjual

   ATURAN
   1. Jangan hapus tanda titik dua ( : ) dan jangan lupa garis --- di akhir akun.
   2. Jangan awali baris deskripsi dengan kata  Kategori :  atau  Nama Produk :
   3. Di dalam teks JANGAN pakai tanda ` (backtick) dan ${ }.
   4. Baris yang diawali tanda #  = catatan, tidak tampil di website.
   5. Kalau Deskripsi tidak ditulis, tampil kalimat bawaan.
   ===================================================================== */

const BELI_AKUN = String.raw`
Kategori : Blox Fruits
Foto : 
Foto : akun1-1.jpg, akun1-2.jpg, akun1-3.jpg
Nama Produk : Akun Blox Fruits Level Tinggi
Harga : 15000
Harga Coret : 25000
Label : Terlaris
Status : ready
Deskripsi :
Akun Blox Fruits level tinggi, fruit bagus dan item lengkap.

Isi akun:
- Level: (isi di sini)
- Fruit: (isi di sini)
- Item / sword / gun: (isi di sini)

Bukti dan detail lengkap dikirim lewat chat sebelum pembayaran.
---
Kategori : Blox Fruits
Foto : 
Nama Produk : Akun Blox Fruits Starter
Harga : 20000
Status : ready
Deskripsi : 
Cocok untuk mulai, level max
Level : 2800
---
Kategori : Blox Fruits
Foto : 
Nama Produk : Akun Blox Fruits Fruit Langka
Harga : 500000
Status : terjual
Deskripsi : Fruit langka, sudah laku.
---
Kategori : Steal An Egg
Foto : 
Nama Produk : Akun Steal An Egg Item Banyak
Harga : 250000
Status : ready
Deskripsi : Koleksi item banyak. Detail dan bukti via chat.
---
Kategori : Steal An Egg
Foto : 
Nama Produk : Akun Steal An Egg Starter
Harga : 80000
Status : ready
Deskripsi : Cocok untuk mulai, item dasar sudah ada.
---
Kategori : 99 Nights in the Forest
Foto : 
Nama Produk : Akun Ghost Ranger Class + 600 Diamonds
Harga : 55000
Status : ready
Deskripsi : Cocok untuk mulai, item dasar sudah ada.
---
Kategori : 99 Nights in the Forest
Foto : 
Nama Produk : Akun Ghost Ranger Class + 600 Diamonds
Harga : 55000
Status : ready
Deskripsi : Cocok untuk mulai, item dasar sudah ada.
---
`;