/* =====================================================================
   HALAMAN PEMBELIAN JOKI  (js/beli-joki.js)
   Satu produk joki = satu blok. Ini yang tampil di kartu kategori DAN di halaman pembelian.

   SATU PRODUK
       Kategori : Blox Fruits            nama game (sama dengan kategori-joki.js)
       Foto :                            foto kotak 1:1 produk ini. KOSONG = pakai foto kategori
       Nama Produk : Joki Level
       Harga : 10000                     angka saja (boleh 10.000)
       Satuan : 100 level                tampil di harga: Rp10.000/100 level
       Jumlah : 1 = 100 level            tulisan di samping "Jumlah" (opsional)
       Deskripsi :                       PALING BAWAH. Boleh panjang dan banyak baris.
       Tulis isi deskripsi di sini,
       turun baris bebas, baris kosong boleh.
       ---                               garis penutup produk

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

   ATURAN
   1. Jangan hapus tanda titik dua ( : ) dan jangan lupa garis --- di akhir produk.
   2. Jangan awali baris deskripsi dengan kata  Kategori :  atau  Nama Produk :
   3. Di dalam teks JANGAN pakai tanda ` (backtick) dan ${ }.
   4. Baris yang diawali tanda #  = catatan, tidak tampil di website.
   5. Kalau Deskripsi tidak ditulis, tampil kalimat bawaan.
   ===================================================================== */

const BELI_JOKI = String.raw`
Kategori : Blox Fruits
Foto : Gambar/joki-raid.png
Nama Produk : Joki Raid
Harga : 1000
Label : Terlaris
Satuan : Raid
Jumlah : 1 = 1 Raid
Deskripsi :
Naik level sesuai target yang kamu minta, dikerjakan manual tanpa cheat.

Yang kamu dapat:
- Pengerjaan oleh pemain berpengalaman
- Update progres lewat WhatsApp
- Harga jelas di awal, tanpa biaya tersembunyi

Cara pesan:
1. Atur jumlah di atas (1 = 100 level)
2. Klik Pesan via WhatsApp
3. Kirim target level dan sea kamu ke admin

Estimasi pengerjaan disebutkan admin sebelum pembayaran.
---
Kategori : Blox Fruits
Foto : Gambar/joki-TTK.png
Nama Produk : Joki TTK (Fully)
Harga : 15000
Satuan : 
Jumlah : 1 = 1 Sword
Deskripsi : Bantu selesaikan raid sampai hasil sesuai kesepakatan.
---
Kategori : Blox Fruits
Foto : Gambar/Bones.png
Nama Produk : Get Bones 1000x
Harga : 2000
Satuan : Bones
Jumlah : 1 = 1000x
Deskripsi : Farming material dan item yang kamu butuhkan.
---
Kategori : Blox Fruits
Foto : Gambar/ghoul.png
Nama Produk : Get Ghoul
Harga : 20000
Satuan : 
Jumlah : 1 = 1
Deskripsi : Farming material dan item yang kamu butuhkan.
---
Kategori : Steal An Egg
Foto : 
Nama Produk : Joki Farming
Harga : 20000
Satuan : jam
Jumlah : 1 = 1 jam
Deskripsi : Farming sesuai target. Detail disepakati via chat.
---
Kategori : Steal An Egg
Foto : 
Nama Produk : Joki Item Langka
Harga : 25000
Satuan : item
Jumlah : 1 = 1 item
Deskripsi : Kejar item yang kamu incar. Estimasi disebutkan admin.
---
`;