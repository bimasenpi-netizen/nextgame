/* =====================================================================
   HALAMAN PEMBELIAN ITEM  (js/beli-item.js)
   Satu item = satu blok. Ini yang tampil di kartu kategori DAN di halaman pembelian.

   SATU ITEM
       Kategori : Blox Fruits            nama game (sama dengan kategori-item.js)
       Foto :                            foto kotak 1:1 item ini. KOSONG = pakai foto kategori
       Nama Produk : Nama Item
       Harga : 10000                     angka saja (boleh 10.000)
       Satuan : pcs                      tampil di harga: Rp10.000/pcs
       Jumlah : 1 = 1 pcs                tulisan di samping "Jumlah" (opsional)
       Stok : 10                         sisa stok. Tampil "Sisa 10", pembeli tidak bisa pesan lebih dari ini.
                                         Stok : 0 = tampil "Habis", tombol beli dimatikan.
                                         Stok dikosongkan / baris dihapus = stok tidak dibatasi.
       Deskripsi :                       PALING BAWAH. Boleh panjang dan banyak baris.
       Tulis isi deskripsi di sini,
       turun baris bebas, baris kosong boleh.
       ---                               garis penutup item

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
   GANTI    harga / jumlah / deskripsi: ubah tulisan setelah tanda titik dua
   STOK     tiap ada yang laku, kurangi angka Stok di sini lalu upload ulang file ini
            (stok tidak berkurang sendiri, karena website ini tidak punya database)

   ATURAN
   1. Jangan hapus tanda titik dua ( : ) dan jangan lupa garis --- di akhir item.
   2. Jangan awali baris deskripsi dengan kata  Kategori :  atau  Nama Produk :
   3. Di dalam teks JANGAN pakai tanda ` (backtick) dan ${ }.
   4. Baris yang diawali tanda #  = catatan, tidak tampil di website.
   5. Kalau Deskripsi tidak ditulis, tampil kalimat bawaan.
   ===================================================================== */

const BELI_ITEM = String.raw`
Kategori : Blox Fruits
Foto :
Nama Produk : Item Blox Fruits (contoh)
Harga : 10000
Satuan : pcs
Jumlah : 1 = 1 pcs
Stok : 10
Deskripsi :
Ini item contoh. Ganti nama, harga, dan deskripsi dengan item yang kamu jual.

Isi deskripsi:
- Jenis / nama item: (isi di sini)

Cara pengiriman dan stok dikonfirmasi admin lewat chat sebelum pembayaran.
---
Kategori : Steal An Egg
Foto :
Nama Produk : Item Steal An Egg (contoh)
Harga : 10000
Satuan : pcs
Jumlah : 1 = 1 pcs
Stok : 5
Deskripsi : Ini item contoh. Ganti dengan item yang kamu jual.
---
`;