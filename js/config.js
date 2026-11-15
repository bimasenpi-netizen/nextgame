/* =====================================================================
   PENGATURAN UMUM  (js/config.js)
   Isi: nama toko, nomor WhatsApp, banner, keunggulan, pembayaran, FAQ.
   Data produk ada di js/beli-joki.js, js/beli-akun.js, js/beli-item.js (dan kategori-*.js)
   ===================================================================== */
const CONFIG = {
  brand: "NextGame",
  brandAccent: "Game",         // bagian nama yang diwarnai hijau (kosongin kalau tidak mau)
  logo: LOGO,   // logo ada di js/logo.js. Mau pakai file sendiri: logo: "logo.png"
  tagline: "Joki Blox Fruits dan Steal An Egg, plus akun siap pakai. Amanah dan no hack back.",
  waNumber: "6283177714787",   // format 62..., tanpa + dan tanpa 0 di depan
  instagram: "",               // contoh: "https://instagram.com/akunlo"
  facebook: "",                // contoh: "https://facebook.com/akunlo"
  // Saluran WhatsApp (tombol "Gabung Saluran" di halaman Testimoni). Kosongkan "" kalau tombol tidak mau tampil.
  saluran: "",                 // contoh: "https://whatsapp.com/channel/xxxxxxxxxxxx"
  saluranTeks: "Gabung Saluran",
  jamOperasional: "Setiap hari, 09.00 - 22.00 WIB",

  // Jumlah game yang tampil di BERANDA (sisanya lewat tombol "Lihat lainnya")
  berandaJumlah: 6,

  // Stiker "Baru" otomatis muncul di produk yang punya "Tanggal :" kurang dari sekian hari (lihat beli-joki.js / beli-akun.js / beli-item.js)
  baruHari: 14,

  // CARA ORDER: tampil di beranda ("langkah, selesai") dan di halaman Bantuan. Boleh tambah / kurangi / ganti tulisannya.
  caraOrder: [
    { t: "Pilih produk", d: "Buka Joki, Akun, atau Item. Pilih game, lalu produk yang kamu mau." },
    { t: "Chat admin", d: "Klik tombol pesan. WhatsApp terbuka dengan pesanan yang sudah terisi, tinggal kirim." },
    { t: "Bayar & kirim bukti", d: "Bayar sesuai arahan admin (QRIS, transfer, atau e-wallet), lalu kirim foto / screenshot bukti pembayaran di chat yang sama." },
    { t: "Selesai", d: "Admin memproses pesananmu. Joki dikerjakan, akun dan item dikirim lewat chat." }
  ],

  ticker: ["Joki Cepat", "Amanah", "No Hack Back", "Harga Jelas", "Admin Ramah"],

  // =====================================================================
  // BANNER BERANDA (3 gambar, ganti otomatis tiap 5 detik)
  //  - GANTI FOTO : isi img: "" pada banner yang mau diganti, contoh img: "banner1.jpg"
  //                 (file fotonya taruh sejajar dengan index.html)
  //  - UKURAN IDEAL: 1600 x 900 px (16:9), JPG/WEBP, usahakan di bawah 300 KB
  //  - Foto tampil 16:9 penuh di laptop; kalau rasio beda, sisi foto sedikit terpotong ke tengah.
  //    Taruh objek penting di TENGAH foto.
  //  - Foto akan digelapkan tipis supaya tulisan putih tetap terbaca,
  //    jadi hindari foto yang sudah ada banyak tulisannya.
  //  - img kosong = pakai ilustrasi bawaan (warna dari c1 dan c2)
  // =====================================================================
  banner: [
    { title: "Joki Blox Fruits & Steal An Egg", desc: "Dikerjakan manual oleh pemain berpengalaman. Pilih game, pilih layanan, pesan lewat WhatsApp.", img: "Banner 2.png", c1: "#ff7a3d", c2: "#7a2cff",
      b1: { t: "Pesan Joki", href: "#/joki" } },
    { title: "Akun siap pakai, bukti jelas", desc: "Stok terbatas. Minta detail dan bukti akun sebelum membayar.", img: "Banner 1.png", c1: "#3b82f6", c2: "#0f766e",
      b1: { t: "Lihat Akun", href: "#/akun" } },
    { title: "Amanah. No hack back.", desc: "Pesanan dikerjakan sesuai kesepakatan dan akun tidak akan diambil balik.", img: "Banner 3.png", c1: "#ec4899", c2: "#4c1d95" }
  ],

  perks: [
    { t: "Amanah", d: "Pesanan dikerjakan sesuai kesepakatan dan akun dijaga seperti milik sendiri." },
    { t: "No hack back", d: "Akun yang sudah dikerjakan atau diserahkan tidak akan diambil balik atau dibobol." },
    { t: "Harga di awal", d: "Harga jelas sebelum bayar, tanpa biaya tersembunyi." },
    { t: "Respon cepat", d: "Admin membalas pesan di jam operasional." }
  ],

  // GANTI detail di bawah dengan rekening asli lo, contoh: "BCA 1234567890 a.n. Nama Lo"
  // Selama belum diganti, pembeli diarahkan tanya admin supaya tidak transfer ke nomor yang salah.
  payment: [
    { name: "QRIS", detail: "QR dikirim admin lewat WhatsApp setelah pesanan dikonfirmasi." },
    { name: "Transfer Bank", detail: "Nomor rekening diberikan admin lewat WhatsApp setelah pesanan dikonfirmasi." },
    { name: "E-Wallet", detail: "Nomor DANA / OVO / GoPay diberikan admin lewat WhatsApp setelah pesanan dikonfirmasi." }
  ],

  faq: [
    { q: "Apa itu no hack back?", a: "Komitmen kami: akun yang sudah dikerjakan atau diserahkan tidak akan diambil balik atau dibobol setelah pesanan selesai." },
    { q: "Apakah joki ini aman?", a: "Dikerjakan manual oleh pemain asli, tanpa cheat. Tapi sebagian game melarang joki di aturannya, jadi selalu ada risiko tindakan dari pihak game. Dengan memesan, kamu menyetujui risiko ini." },
    { q: "Berapa lama pengerjaan?", a: "Tergantung target dan antrean. Estimasi disebutkan admin sebelum pembayaran." },
    { q: "Data login saya aman?", a: "Jangan pernah mengirim password lewat website ini. Data login hanya diberikan lewat chat setelah pesanan dikonfirmasi, dan sebaiknya ganti password setelah selesai." },
    { q: "Bagaimana kalau target tidak tercapai?", a: "Sisa pekerjaan dilanjutkan atau dihitung ulang sesuai kesepakatan di awal. Lihat Kebijakan Refund." },
    { q: "Pembelian akun, apa ada garansi?", a: "Detail garansi dijelaskan admin sebelum pembayaran. Minta bukti kepemilikan dan cek akun sebelum membayar." }
  ]
};