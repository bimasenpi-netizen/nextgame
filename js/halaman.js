/* =====================================================================
   HALAMAN  (js/halaman.js)
   Beranda, daftar kategori, bantuan/FAQ, syarat, refund, privasi.
   (Biasanya tidak perlu diedit.)
   ===================================================================== */

/* ---------- halaman ---------- */
// Cara order: isi lewat CONFIG.caraOrder di config.js. Kalau kosong, pakai bawaan ini.
const CARA_ORDER = [
  { t: "Pilih produk", d: "Buka Joki, Akun, atau Item. Pilih game, lalu produk yang kamu mau." },
  { t: "Chat admin", d: "Klik tombol pesan. WhatsApp terbuka dengan pesanan yang sudah terisi, tinggal kirim." },
  { t: "Bayar & kirim bukti", d: "Bayar sesuai arahan admin, lalu kirim foto / screenshot bukti pembayaran di chat yang sama." },
  { t: "Selesai", d: "Admin memproses pesananmu. Joki dikerjakan, akun dan item dikirim lewat chat." }
];
const caraOrder = () => CONFIG.caraOrder && CONFIG.caraOrder.length ? CONFIG.caraOrder : CARA_ORDER;
function pHome() {
  // tulisan berjalan: isi sendiri lewat CONFIG.ticker di config.js. Kalau kosong / tidak ada, pakai nama game di Kategori Joki.
  const names = CONFIG.ticker && CONFIG.ticker.length ? CONFIG.ticker : CONFIG.kategoriJoki.map(k => k.name);
  const half = Array.from({ length: Math.max(1, Math.ceil(16 / names.length)) }, () => names).flat().map(x => `<span>✦ ${esc(x.toUpperCase())}</span>`).join("");
  const tick = half + half;
  app.innerHTML = `
  ${bannerHtml()}
  <div class="ticker" style="margin-top:26px"><div>${tick}</div></div>

  <section class="sec"><div class="wrap">
    <div class="sechead"><h2>Kenapa pesan di sini</h2></div>
    <div class="perks" id="pk">${CONFIG.perks.map(p => `<div class="perk"><b>${esc(p.t)}</b><p>${esc(p.d)}</p></div>`).join("")}</div>
    <div class="pdots" id="pd">${CONFIG.perks.map((_, i) => `<button class="${i === 0 ? "on" : ""}" data-a="perk" data-i="${i}" aria-label="Keunggulan ${i + 1}"></button>`).join("")}</div>
  </div></section>

  <section class="sec homesec" id="sec-akun" style="padding-top:10px"><div class="wrap">
    <div class="sechead"><div><h2>Kategori Akun</h2><p>Stok terbatas. Akun yang terjual langsung ditandai.</p></div>${moreLink("akun", CONFIG.kategoriAkun.length)}</div>
    <div class="homegrid">${CONFIG.kategoriAkun.slice(0, CONFIG.berandaJumlah).map(k => homeCard(k, "akun", "home")).join("")}</div>
  </div></section>

  <section class="sec homesec" id="sec-joki" style="padding-top:10px"><div class="wrap">
    <div class="sechead"><div><h2>Kategori Joki</h2><p>Pilih game, lalu pilih layanan yang kamu butuhkan.</p></div>${moreLink("joki", CONFIG.kategoriJoki.length)}</div>
    <div class="homegrid">${CONFIG.kategoriJoki.slice(0, CONFIG.berandaJumlah).map(k => homeCard(k, "joki", "home")).join("")}</div>
  </div></section>

  ${CONFIG.kategoriItem.length ? `<section class="sec homesec" id="sec-item" style="padding-top:10px"><div class="wrap">
    <div class="sechead"><div><h2>Kategori Item</h2><p>Pilih game, lalu pilih item yang kamu butuhkan.</p></div>${moreLink("item", CONFIG.kategoriItem.length)}</div>
    <div class="homegrid">${CONFIG.kategoriItem.slice(0, CONFIG.berandaJumlah).map(k => homeCard(k, "item", "home")).join("")}</div>
  </div></section>` : ""}

  ${CONFIG.testimoni && CONFIG.testimoni.length ? `<section class="sec" id="sec-testi" style="padding-top:10px"><div class="wrap">
    <div class="sechead"><div><h2>Testimoni pelanggan</h2><p>Bukti pesanan yang sudah selesai.</p></div><a class="more" href="#/testimoni">Lihat semua →</a></div>
    <div class="tthumbs">${CONFIG.testimoni.slice(0, 4).map((src, i) => `<a class="tthumb" href="#/testimoni" aria-label="Lihat testimoni"><img src="${esc(src)}" alt="Testimoni ${i + 1}" loading="lazy"></a>`).join("")}</div>
  </div></section>` : ""}

  <section class="sec" style="padding-top:10px"><div class="wrap">
    <div class="sechead"><h2>${caraOrder().length} langkah, selesai</h2><a class="more" href="#/bantuan">Cara order lengkap →</a></div>
    <div class="steps" id="st">${caraOrder().map(c => `<div class="step"><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p></div>`).join("")}</div>
    <div class="pdots" id="sd">${caraOrder().map((_, i) => `<button class="${i === 0 ? "on" : ""}" data-a="step" data-i="${i}" aria-label="Langkah ${i + 1}"></button>`).join("")}</div>
  </div></section>`;
}

function pKat(type, slug, qs, itemId) {
  const T = {
    joki: { judul: "Layanan Joki", sub: "Pilih game untuk melihat layanan joki yang tersedia.", awal: "Joki ", data: CONFIG.joki, card: jokiCard, page: pItemJoki,
      kosong: "Belum ada layanan di kategori ini.", cari: "joki ", note: "Pilih layanan untuk melihat detail dan memesan. Jangan kirim password lewat website." },
    akun: { judul: "Katalog Akun", sub: "Pilih game untuk melihat akun yang tersedia.", awal: "Akun ", data: CONFIG.akun, card: akunCard, page: pItemAkun,
      kosong: "Belum ada akun di kategori ini.", cari: "akun ", note: "Pilih akun untuk melihat detail. Minta detail dan bukti akun sebelum membayar." },
    item: { judul: "Katalog Item", sub: "Pilih game untuk melihat item yang tersedia.", awal: "Item ", data: CONFIG.item, card: itemCard, page: pProdukItem,
      kosong: "Belum ada item di kategori ini.", cari: "item ", note: "Pilih item untuk melihat detail dan membeli." }
  }[type];
  if (!T) return notFound();
  if (!slug) {
    const semua = katList(type);
    app.innerHTML = `<div class="wrap sec"><div class="sechead"><div><h2>${T.judul}</h2><p>${T.sub}</p></div></div>
      ${semua.length > 4 && (CONFIG.filter || {}).cariGame !== false ? `<div class="filters"><input type="search" id="fq" class="finput" placeholder="Cari game..." autocomplete="off" aria-label="Cari game"></div>` : ""}
      <div class="homegrid" id="cg">${semua.map(k => homeCard(k, type)).join("")}</div><div id="cempty"></div></div>`;
    const fq = $("#fq");
    if (fq) fq.addEventListener("input", () => {
      const q = fq.value.trim().toLowerCase(); let n = 0;
      [...$("#cg").children].forEach(c => { const ok = c.querySelector("b").textContent.toLowerCase().includes(q); c.hidden = !ok; if (ok) n++; });
      $("#cempty").innerHTML = n ? "" : empty("Game tidak ditemukan. Coba kata lain, atau tanya admin.");
    });
    return;
  }
  if (itemId) return T.page(itemId, slug, qs);
  const k = katList(type).find(x => x.slug === slug);
  if (!k) return notFound();
  const list = T.data.filter(x => x.kategori === slug);
  // pengaturan cari / urutkan / filter: per game di kategori-*.js (Cari : tidak), kalau kosong ikut CONFIG.filter, kalau kosong semua aktif
  const F = CONFIG.filter || {}, pilih = (g, u) => g != null ? g : u !== false;
  let bar = list.length >= (F.minProduk || 3) ? { cari: pilih(k.fCari, F.cari), urut: pilih(k.fUrut, F.urutkan), tersedia: type !== "joki" && pilih(k.fTersedia, F.tersedia) } : null;
  /* tidak ada kontrol aktif = bar tidak tampil */
  if (bar && !bar.cari && !bar.urut && !bar.tersedia) bar = null;
  app.innerHTML = `<div class="wrap sec">
    ${qs && qs.from === "home" ? `<a class="back" href="#/?sec=${type}">← Kembali ke beranda</a>` : `<a class="back" href="#/${type}">← Semua kategori</a>`}
    <div class="khead">${artBox(k)}<h2>${T.awal}${esc(k.name)}</h2><p>${esc(k.desc)}</p></div>
    ${bar ? `<div class="filters" id="pb">
      ${bar.cari ? `<input type="search" id="pq" class="finput" placeholder="Cari di ${esc(k.name)}..." autocomplete="off" aria-label="Cari">` : ""}
      ${bar.urut ? `<select id="ps" class="fsel" aria-label="Urutkan"><option value="">Urutan awal</option><option value="new">Terbaru</option><option value="hot">Terlaris dulu</option><option value="asc">Harga termurah</option><option value="desc">Harga termahal</option></select>` : ""}
      ${bar.tersedia ? `<label class="fcheck"><input type="checkbox" id="po"> ${type === "akun" ? "Ready saja" : "Stok ada saja"}</label>` : ""}
    </div>${bar.cari || bar.tersedia ? `<div class="fcount" id="pc"></div>` : ""}` : ""}
    ${list.length ? `<div class="catgrid" id="pg">${list.map(x => T.card(x, qs)).join("")}</div><div id="pempty"></div>` :
      empty(T.kosong, `<a class="btn wa" target="_blank" rel="noopener" href="${wa("Halo " + CONFIG.brand + ", saya cari " + T.cari + k.name)}">Tanya admin</a>`)}
    <div class="note">${T.note}</div>
  </div>`;
  if ($("#pb")) {
    const nm = x => String(type === "akun" ? x.title : x.name).toLowerCase();
    const tersedia = x => type === "akun" ? x.status !== "sold" : type === "item" ? x.stok !== 0 : true;
    // Terbaru = berdasarkan "Tanggal :"; kalau tanggal kosong, yang ditulis paling bawah di file dianggap paling baru.
    const nomor = x => +x.id.slice(1), hot = x => tagKind(x.label) === "hot" ? 1 : 0;
    const SORT = { asc: (a, b) => a.price - b.price, desc: (a, b) => b.price - a.price,
      new: (a, b) => (b.tgl || 0) - (a.tgl || 0) || nomor(b) - nomor(a), hot: (a, b) => hot(b) - hot(a) || nomor(a) - nomor(b) };
    const render = () => {
      const q = $("#pq") ? $("#pq").value.trim().toLowerCase() : "", s = $("#ps") ? $("#ps").value : "", only = $("#po") && $("#po").checked;
      let l = list.filter(x => nm(x).includes(q) && (!only || tersedia(x)));
      if (s) l = [...l].sort(SORT[s]);
      $("#pg").innerHTML = l.map(x => T.card(x, qs)).join("");
      $("#pempty").innerHTML = l.length ? "" : empty("Tidak ada yang cocok. Coba ubah pencarian atau filter.");
      if ($("#pc")) $("#pc").textContent = l.length + " dari " + list.length + " tampil";
    };
    ["input", "change"].forEach(ev => ["#pq", "#ps", "#po"].forEach(id => { const el = $(id); if (el) el.addEventListener(ev, render); }));
    render();
  }
}

function pBantuan() {
  const bukti = wa("Halo " + CONFIG.brand + ", saya sudah bayar dan mau kirim bukti pembayaran.\n\nProduk yang dipesan: \nNama / ID game: \n\n(Foto bukti pembayaran saya lampirkan di chat ini)");
  app.innerHTML = `<div class="wrap sec" style="max-width:780px"><h2>Bantuan & FAQ</h2><p style="color:var(--muted);margin:6px 0 20px">Jam operasional: ${esc(CONFIG.jamOperasional)}</p>
    <h3 style="margin-bottom:10px">Cara order</h3>
    <ol class="alur">${caraOrder().map((c, i) => `<li><span class="no">${i + 1}</span><div><b>${esc(c.t)}</b><p>${esc(c.d)}</p></div></li>`).join("")}</ol>
    <h3>Metode pembayaran</h3>
    <div class="paylist">${CONFIG.payment.map(p => `<div><b>${esc(p.name)}</b><span>${esc(p.detail)}</span></div>`).join("")}</div>
    <p style="color:var(--muted);font-size:13px;margin-bottom:14px">Bayar hanya setelah admin mengonfirmasi pesanan.</p>
    <div class="note proof"><span><b>Sudah bayar?</b> Kirim foto atau screenshot bukti pembayaran ke admin lewat WhatsApp, sertakan nama produk yang kamu pesan. Pesanan diproses setelah admin mengonfirmasi pembayaran.</span>
      <a class="btn wa sm" target="_blank" rel="noopener" href="${bukti}">Kirim bukti pembayaran</a></div>
    <h3 style="margin:22px 0 10px">Pertanyaan umum</h3>
    ${CONFIG.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}
    <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn wa" target="_blank" rel="noopener" href="${wa("Halo " + CONFIG.brand + ", saya butuh bantuan.")}">Chat Admin</a></div></div>`;
}
const POL = {
  syarat: ["Syarat & Ketentuan", [
    ["Layanan", "Kami menyediakan jasa joki, penjualan akun, dan penjualan item game. Dengan memesan, kamu menyetujui syarat di halaman ini."],
    ["Risiko", "Sebagian game melarang joki, jual beli akun, dan jual beli item dalam aturan resminya. Kamu memahami bahwa ada risiko tindakan dari pihak game (peringatan, pembatasan, atau banned), dan menerima risiko tersebut."],
    ["Data login", "Berikan data login hanya lewat chat resmi admin. Ganti password setelah pesanan selesai. Kami tidak meminta password lewat website."],
    ["Pembayaran", "Pesanan diproses setelah pembayaran dikonfirmasi admin. Harga final dikonfirmasi sebelum pembayaran."],
    ["Larangan", "Dilarang memakai layanan ini untuk akun milik orang lain tanpa izin atau untuk kegiatan melanggar hukum."]
  ]],
  refund: ["Kebijakan Refund", [
    ["Joki", "Jika pengerjaan belum dimulai, dana dapat dikembalikan penuh. Jika sudah berjalan, refund dihitung sebanding dengan bagian yang belum dikerjakan."],
    ["Akun", "Refund atau penggantian mengikuti garansi yang disebutkan admin sebelum pembayaran. Mohon cek akun segera setelah diterima."],
    ["Pengecualian", "Tidak ada refund untuk akun yang terkena tindakan game akibat perubahan data atau pelanggaran oleh pembeli setelah serah terima."],
    ["Pengajuan", "Ajukan lewat WhatsApp admin dengan menyertakan Order ID dan bukti pendukung."]
  ]],
  privasi: ["Kebijakan Privasi", [
    ["Data yang dikumpulkan", "Website ini tidak menyimpan data pribadimu. Data yang kamu kirim lewat WhatsApp (nama, kontak, detail pesanan) hanya diterima admin untuk memproses pesanan."],
    ["Penggunaan", "Hanya untuk memproses pesanan dan komunikasi terkait pesanan. Tidak dijual ke pihak lain."],
    ["Kontak", "Pertanyaan soal data pribadi? Hubungi admin lewat WhatsApp."]
  ]]
};
function pPolicy(k) {
  const [title, secs] = POL[k];
  app.innerHTML = `<div class="wrap sec doc" style="max-width:760px"><h2>${esc(title)}</h2>${secs.map(s => `<h3>${esc(s[0])}</h3><p>${esc(s[1])}</p>`).join("")}</div>`;
}
function notFound() { app.innerHTML = `<div class="wrap sec">${empty("Halaman tidak ditemukan.", `<a class="btn" href="#/">Ke beranda</a>`)}</div>`; }