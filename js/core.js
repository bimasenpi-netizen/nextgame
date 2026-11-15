/* =====================================================================
   CORE  (js/core.js)
   Fungsi dasar, pembaca file data (kategori-*.js, beli-*.js), gambar kategori, banner, geser otomatis, header/footer, kartu kategori.
   (Biasanya tidak perlu diedit.)
   ===================================================================== */

/* ---------- util ---------- */
const $ = s => document.querySelector(s);
const app = $("#app");
const rp = n => "Rp" + Number(n).toLocaleString("id-ID");
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const wa = m => "https://wa.me/" + CONFIG.waNumber + "?text=" + encodeURIComponent(m);
/* ---------- baca file data: kategori-joki.js, kategori-akun.js, beli-joki.js, beli-akun.js ---------- */
// Format: baris "Label : isi", antar item dipisah garis ---. "Deskripsi :" taruh paling bawah (boleh banyak baris).
const normLabel = s => String(s).toLowerCase().replace(/[^a-z]/g, "");
const FOTO = { foto: "foto", fotoicon: "foto", icon: "foto", gambar: "foto" };
const KATEGORI_ALIAS = { ...FOTO, nama: "nama", namakategori: "nama", namakatagori: "nama", kategori: "nama", katagori: "nama", game: "nama", warna: "warna", keterangan: "info", info: "info", ilustrasi: "ilustrasi", cari: "cari", pencarian: "cari", urutkan: "urutkan", urutan: "urutkan", filter: "filter" };
const PRODUK_ALIAS = { ...FOTO, kategori: "kategori", katagori: "kategori", game: "kategori", namaproduk: "nama", nama: "nama", harga: "harga", hargacoret: "coret", coret: "coret", label: "label", tanggal: "tanggal", tgl: "tanggal", satuan: "satuan", jumlah: "jumlah", status: "status", kode: "kode", ext: "ext", stok: "stok", deskripsi: "deskripsi" };
function bacaBlok(teks, alias, awal, file) {
  const hasil = []; let cur = null, d = false;
  const tutup = () => {
    if (cur) {
      if (cur.deskripsi != null) cur.deskripsi = cur.deskripsi.trim();
      if (!cur.nama) console.warn(file + ": ada item tanpa nama, dibuang (cek: label ditulis dua kali, atau lupa garis ---). Isinya: " + JSON.stringify(cur).slice(0, 80));
      hasil.push(cur);
    }
    cur = null; d = false;
  };
  String(teks || "").split("\n").forEach((raw, n) => {
    const ln = raw.replace(/\s+$/, ""), t = ln.trim(), m = t.match(/^([^:]{1,30}?)\s*:\s*(.*)$/), lab = m ? alias[normLabel(m[1])] : null;
    if (t[0] === "#") return;                                            // catatan
    if (/^-{3,}$/.test(t)) return tutup();                               // pemisah antar item
    if (d) {                                                             // sedang membaca deskripsi
      if (!(lab && lab === awal)) { cur.deskripsi += "\n" + ln; return; } // baris biasa = isi deskripsi
      tutup();                                                           // label awal muncul lagi = item baru (lupa ---)
    }
    if (!t) return;
    if (!lab) return console.warn(file + " (baris " + (n + 1) + "): label tidak dikenal -> \"" + t.slice(0, 40) + "\"");
    if (cur && cur[lab] !== undefined && lab !== "deskripsi") {
      if (lab === awal) tutup();                                         // label awal muncul lagi = item baru (lupa ---)
      else if (cur[lab] === "" || lab === "foto") {                      // baris kosong diisi ulang / Foto ditulis dua kali: pakai yang terakhir
        if (cur[lab] !== "") console.warn(file + " (baris " + (n + 1) + "): \"" + m[1].trim() + "\" ditulis dua kali, dipakai yang terakhir");
      } else tutup();                                                    // label lain dobel = item baru (lupa ---)
    }
    cur = cur || {};
    if (lab === "deskripsi") { d = true; cur.deskripsi = m[2]; } else cur[lab] = m[2].trim();
  });
  tutup();
  return hasil;
}
(function bacaData() {
  const PAL = ["#ff9a62", "#ffd23f", "#7aa2ff", "#7ed957", "#ff9fbf", "#5eead4", "#c4b5fd", "#fdba74", "#f87171", "#a3e635"];
  const DESK = { joki: "Dikerjakan manual oleh pemain berpengalaman. Detail dan estimasi disepakati lewat WhatsApp.", akun: "Detail dan bukti akun dikirim lewat chat sebelum pembayaran.", item: "Stok dan cara pengiriman item dikonfirmasi admin lewat WhatsApp sebelum pembayaran." };
  const INFO = { joki: "Joki level, farming, dan item.", akun: "Akun siap pakai, stok terbatas.", item: "Item game, stok terbatas." };
  const slugOf = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const duit = v => parseInt(String(v || "").replace(/\D/g, "")) || 0;
  const yn = v => v == null || String(v).trim() === "" ? null : !/^(tidak|no|off|mati|sembunyi|0|false)/i.test(String(v).trim());   // "Cari : tidak" -> false
  // Tanggal : 2026-11-14 (atau 14-11-2026). Dipakai untuk stiker "Baru" otomatis dan urutan "Terbaru".
  const tgl = (v, file, nama) => {
    const s = String(v || "").trim(); if (!s) return 0;
    const m = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/) || s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/);
    const t = m ? (m[1].length === 4 ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(+m[3], +m[2] - 1, +m[1])).getTime() : NaN;
    if (isNaN(t)) { if (file) console.warn(file + ": Tanggal \"" + s + "\" tidak dikenal untuk \"" + nama + "\". Tulis seperti 2026-11-14 atau 14-11-2026."); return 0; }
    return t;
  };
  const labelOf = (p, t) => (p.label || "").trim() || (t && t <= Date.now() && Date.now() - t <= (CONFIG.baruHari || 14) * 864e5 ? "Baru" : "");
  const kategori = (teks, type, file) => {
    const pakai = {};
    return bacaBlok(teks, KATEGORI_ALIAS, "nama", file).filter(k => k.nama).map((k, i) => {
      let s = slugOf(k.nama) || "game", u = s, j = 2; while (pakai[u]) u = s + "-" + j++; pakai[u] = 1;
      return { slug: u, name: k.nama, art: k.foto ? "" : (k.ilustrasi || ["fruit", "egg"][i % 2]), color: k.warna || PAL[i % PAL.length], img: k.foto || "", desc: k.info || INFO[type],
        fCari: yn(k.cari), fUrut: yn(k.urutkan), fTersedia: yn(k.filter) };   // null = ikut pengaturan umum
    });
  };
  CONFIG.kategoriJoki = kategori(typeof KATEGORI_JOKI === "string" ? KATEGORI_JOKI : "", "joki", "kategori-joki.js");
  CONFIG.kategoriAkun = kategori(typeof KATEGORI_AKUN === "string" ? KATEGORI_AKUN : "", "akun", "kategori-akun.js");
  CONFIG.kategoriItem = kategori(typeof KATEGORI_ITEM === "string" ? KATEGORI_ITEM : "", "item", "kategori-item.js");
  const cekKategori = (p, list, file) => {
    const s = slugOf(p.kategori);
    if (!list.some(k => k.slug === s)) console.warn(file + ": kategori \"" + p.kategori + "\" tidak ada di daftar kategori, produk \"" + p.nama + "\" tidak akan tampil");
    return s;
  };
  CONFIG.joki = bacaBlok(typeof BELI_JOKI === "string" ? BELI_JOKI : "", PRODUK_ALIAS, "kategori", "beli-joki.js").filter(p => p.nama).map(p => {
    const unit = p.satuan || "order";
    return { kategori: cekKategori(p, CONFIG.kategoriJoki, "beli-joki.js"), name: p.nama, price: duit(p.harga), unit,
      jumlah: (p.jumlah || "1 = " + unit).replace(/^\(|\)$/g, ""), img: p.foto || "", desc: p.deskripsi || DESK.joki,
      old: duit(p.coret), tgl: tgl(p.tanggal, "beli-joki.js", p.nama), label: labelOf(p, tgl(p.tanggal)) };
  });
  CONFIG.akun = bacaBlok(typeof BELI_AKUN === "string" ? BELI_AKUN : "", PRODUK_ALIAS, "kategori", "beli-akun.js").filter(p => p.nama).map(p => {
    const x = { kategori: cekKategori(p, CONFIG.kategoriAkun, "beli-akun.js"), title: p.nama, price: duit(p.harga),
      status: /terjual|sold/i.test(p.status || "") ? "sold" : "ready", desc: p.deskripsi || DESK.akun,
      old: duit(p.coret), tgl: tgl(p.tanggal, "beli-akun.js", p.nama), label: labelOf(p, tgl(p.tanggal)) };
    if (p.kode) x.kode = p.kode;
    if (p.ext) x.ext = p.ext.replace(/^\./, "");
    if (/^\d+$/.test(p.foto || "")) x.foto = +p.foto;                              // Foto : 3  -> akun1-1.jpg, akun1-2.jpg, ...
    else if (p.foto) x.imgs = p.foto.split(",").map(s => s.trim()).filter(Boolean);  // Foto : a.jpg, b.jpg
    return x;
  });
  CONFIG.item = bacaBlok(typeof BELI_ITEM === "string" ? BELI_ITEM : "", PRODUK_ALIAS, "kategori", "beli-item.js").filter(p => p.nama).map(p => {
    const unit = p.satuan || "pcs";
    return { kategori: cekKategori(p, CONFIG.kategoriItem, "beli-item.js"), name: p.nama, price: duit(p.harga), unit,
      jumlah: (p.jumlah || "1 = " + unit).replace(/^\(|\)$/g, ""), img: p.foto || "", desc: p.deskripsi || DESK.item,
      old: duit(p.coret), tgl: tgl(p.tanggal, "beli-item.js", p.nama), label: labelOf(p, tgl(p.tanggal)),
      stok: /habis|terjual|sold/i.test(p.status || "") ? 0 : (String(p.stok || "").trim() === "" ? null : duit(p.stok)) };   // null = stok tidak dibatasi, 0 = habis
  });
})();
const itemName = (x, type) => type === "akun" ? x.title : x.name;
// deskripsi yang bisa dibuka / ditutup (dipakai halaman pembelian joki dan akun)
const descBlock = (teks, type) => `<details class="dtoggle"><summary><span><span class="s-show">Lihat deskripsi ${type}</span><span class="s-hide">Sembunyikan deskripsi</span></span></summary>
  <p class="ddesc long">${esc(teks)}</p></details>`;

CONFIG.joki.forEach((x, i) => x.id = "j" + i);
CONFIG.akun.forEach((x, i) => x.id = "a" + i);
CONFIG.item.forEach((x, i) => x.id = "i" + i);
const find = id => ({ j: CONFIG.joki, a: CONFIG.akun, i: CONFIG.item }[id[0]] || [])[+id.slice(1)];
const katList = type => type === "joki" ? CONFIG.kategoriJoki : type === "item" ? CONFIG.kategoriItem : CONFIG.kategoriAkun;
const kat = (slug, type) => katList(type || "joki").find(k => k.slug === slug) || ["joki", "akun", "item"].map(katList).flat().find(k => k.slug === slug);
const katName = (slug, type) => (kat(slug, type) || {}).name || slug;

/* ---------- harga coret, label promo, tombol bagikan ---------- */
const diskonPersen = x => x.old > x.price && x.price > 0 ? Math.round((1 - x.price / x.old) * 100) : 0;
// Rp10.000/jam  Rp15.000 (coret)  -33%
const hargaHtml = (x, unit) => rp(x.price) + (unit ? `<small>/${esc(unit)}</small>` : "") + (x.old > x.price ? ` <s class="old">${rp(x.old)}</s> <span class="off">-${diskonPersen(x)}%</span>` : "");
const tagKind = s => /terlaris|hot|best/i.test(s) ? "hot" : /promo|diskon|sale/i.test(s) ? "promo" : /baru|new/i.test(s) ? "new" : "def";
const tagHtml = x => x.label ? `<span class="badge tag t-${tagKind(x.label)}">${esc(x.label)}</span>` : "";
const shareUrl = () => { const u = new URL(location.href); u.hash = u.hash.split("?")[0]; return u.toString(); };   // tanpa ?from=home
const shareBar = judul => `<div class="share"><button type="button" class="btn alt sm" data-a="share" data-t="${esc(judul)}">Bagikan</button><button type="button" class="btn alt sm" data-a="copy">Salin link</button></div>`;
function toast(msg) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 2200);
}

/* ---------- gambar kategori (ilustrasi asli, bukan aset game) ---------- */
const INK = "#121212";
const spark = (x, y, s) => `<path d="M${x} ${y - s}l${s * .3} ${s * .7} ${s * .7} ${s * .3}-${s * .7} ${s * .3}-${s * .3} ${s * .7}-${s * .3}-${s * .7}-${s * .7}-${s * .3} ${s * .7}-${s * .3}z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
const ART = {
  fruit: `<circle cx="100" cy="76" r="54" fill="#fff" opacity=".35"/><circle cx="100" cy="76" r="40" fill="#fff" opacity=".25"/>
    <path d="M100 40c-26-14-54 6-50 38 4 32 28 44 50 34 22 10 46-2 50-34 4-32-24-52-50-38z" fill="#ff5d73" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M100 40c0-12 4-20 12-26" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M112 20c14-8 28-4 32 6-12 8-26 6-32-6z" fill="#7ed957" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M70 68c4-10 12-15 21-15" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M122 92c-6 8-14 12-22 12" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".35"/>
    ${spark(32, 34, 12)}${spark(168, 98, 10)}${spark(160, 30, 7)}`,
  egg: `<ellipse cx="100" cy="128" rx="46" ry="7" fill="${INK}" opacity=".18"/>
    <path d="M100 14c-30 0-50 40-50 68 0 28 22 44 50 44s50-16 50-44c0-28-20-68-50-68z" fill="#fff6d6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M58 76l16-10 13 14 13-14 13 14 13-14 16 10" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="78" cy="102" r="6" fill="#ff9a62" stroke="${INK}" stroke-width="2.5"/><circle cx="116" cy="108" r="8" fill="#7aa2ff" stroke="${INK}" stroke-width="2.5"/><circle cx="96" cy="42" r="5" fill="#ff9fbf" stroke="${INK}" stroke-width="2.5"/>
    <path d="M72 40c-6 8-9 16-10 24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    ${spark(28, 40, 12)}${spark(172, 30, 10)}${spark(164, 108, 8)}`
};
function artSvg(type) { return `<svg viewBox="0 -30 200 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">${ART[type] || ART.fruit}</svg>`; }
function artBox(k, extra, portrait) {
  return `<div class="art${portrait ? " p" : ""}" style="background:${esc(k.color || "#c6f432")}">${extra || ""}${k.img ? `<img src="${esc(k.img)}" alt="${esc(k.name)}" loading="lazy">` : artSvg(k.art)}</div>`;
}

/* ---------- banner (ilustrasi asli: kubus isometrik) ---------- */
function cube(x, y, s, c) {
  const w = s * .87, h = s * .5;
  return `<g stroke="rgba(0,0,0,.35)" stroke-width="2" stroke-linejoin="round">
    <path d="M${x} ${y - s}L${x + w} ${y - h}L${x} ${y}L${x - w} ${y - h}Z" fill="${c[0]}"/>
    <path d="M${x - w} ${y - h}L${x} ${y}L${x} ${y + s}L${x - w} ${y + h}Z" fill="${c[1]}"/>
    <path d="M${x + w} ${y - h}L${x} ${y}L${x} ${y + s}L${x + w} ${y + h}Z" fill="${c[2]}"/></g>`;
}
const CUBES = [
  [["#fff3a0", "#ffd23f", "#e0a800"], ["#ffc0a0", "#ff7a3d", "#c94a12"], ["#d6c7ff", "#8b5cf6", "#5b34c4"]],
  [["#bff0ff", "#5eead4", "#0f9d8a"], ["#cfe0ff", "#60a5fa", "#2563eb"], ["#eaffb0", "#c6f432", "#8fb30c"]],
  [["#ffd0e6", "#ff8fc0", "#d9387f"], ["#e9d5ff", "#a78bfa", "#6d28d9"], ["#fff3a0", "#ffd23f", "#e0a800"]]
];
function bannerArt(i, b) {
  const p = CUBES[i % CUBES.length];
  const pos = [[900, 150, 70, 0], [1040, 300, 95, 1], [800, 330, 55, 2], [1110, 120, 45, 2], [960, 430, 60, 0], [700, 140, 38, 1]];
  const cubes = pos.map(q => cube(q[0], q[1], q[2], p[q[3]])).join("");
  const dots = Array.from({ length: 22 }, (_, n) => `<circle cx="${(n * 173) % 1200}" cy="${(n * 97) % 500}" r="${2 + (n % 3)}" fill="#fff" opacity="${.15 + (n % 4) * .08}"/>`).join("");
  return `<svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="bg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b.c1}"/><stop offset="1" stop-color="${b.c2}"/></linearGradient></defs>
    <rect width="1200" height="500" fill="url(#bg${i})"/>${dots}${cubes}</svg>`;
}
let sliderTimer = null, sliderIdx = 0;
function showSlide(n) {
  const s = document.querySelectorAll(".slide"), d = document.querySelectorAll(".dots button");
  if (!s.length) return;
  sliderIdx = (n + s.length) % s.length;
  s.forEach((el, i) => el.classList.toggle("on", i === sliderIdx));
  d.forEach((el, i) => el.classList.toggle("on", i === sliderIdx));
}
function startSlider() {
  stopSlider();
  sliderIdx = 0; showSlide(0);
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sliderTimer = setInterval(() => showSlide(sliderIdx + 1), 5000);
}
function startSliderKeep() {
  stopSlider();
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sliderTimer = setInterval(() => showSlide(sliderIdx + 1), 5000);
}
function stopSlider() { if (sliderTimer) { clearInterval(sliderTimer); sliderTimer = null; } }
function bannerHtml() {
  const list = CONFIG.banner || [];
  if (!list.length) return "";
  const link = b => b.href === "wa" ? `href="${wa("Halo " + CONFIG.brand + ", saya mau tanya-tanya dulu.")}" target="_blank" rel="noopener"` : `href="${esc(b.href)}"`;
  // banner polos: kalau title dan desc dikosongkan, gambar tampil penuh tanpa tulisan di atasnya (cocok untuk gambar yang sudah berisi tulisan).
  // Kalau b1 diisi, seluruh banner bisa diklik.
  return `<div class="wrap"><div class="slider" id="sl">
    ${list.map((b, i) => { const plain = !b.title && !b.desc; return `<div class="slide ${i === 0 ? "on" : ""} ${plain ? "plain" : ""}">
      <div class="bg">${b.img ? `<img src="${esc(b.img)}" alt="">` : bannerArt(i, b)}</div>
      ${plain ? (b.b1 ? `<a class="slide-link" ${link(b.b1)} aria-label="${esc(b.b1.t || "Buka")}"></a>` : "") :
        `${b.title ? `<h2>${esc(b.title)}</h2>` : ""}${b.desc ? `<p>${esc(b.desc)}</p>` : ""}
      <div class="cta">${b.b1 ? `<a class="btn" ${link(b.b1)}>${esc(b.b1.t)}</a>` : ""}${b.b2 ? `<a class="btn alt" ${link(b.b2)}>${esc(b.b2.t)}</a>` : ""}</div>`}
    </div>`; }).join("")}
    <div class="dots">${list.map((_, i) => `<button class="${i === 0 ? "on" : ""}" data-a="slide" data-i="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}</div>
  </div></div>`;
}

/* ---------- geser samping otomatis di HP: "Kenapa pesan" dan "3 langkah" ---------- */
const isPhone = () => window.matchMedia && matchMedia("(max-width:600px)").matches;
function makeCarousel(sel, dotSel, delay) {
  let timer = null, resumeT = null;
  const el = () => $(sel);
  const step = pk => { const c = pk.children; return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : pk.clientWidth; };
  const idx = pk => {
    const n = pk.children.length;
    if (pk.scrollLeft >= pk.scrollWidth - pk.clientWidth - 4) return n - 1;
    return Math.max(0, Math.min(n - 1, Math.round(pk.scrollLeft / step(pk))));
  };
  const dots = () => { const pk = el(); if (!pk) return; const i = idx(pk); document.querySelectorAll(dotSel + " button").forEach((d, k) => d.classList.toggle("on", k === i)); };
  const go = (i, smooth) => { const pk = el(); if (!pk) return; pk.scrollTo({ left: i * step(pk), behavior: smooth === false ? "auto" : "smooth" }); };
  const stop = () => { clearInterval(timer); clearTimeout(resumeT); timer = resumeT = null; };
  const start = () => {
    stop();
    const pk = el(); if (!pk) return;
    pk.onscroll = dots;
    const pause = () => { clearInterval(timer); timer = null; clearTimeout(resumeT); };
    const resume = () => { clearTimeout(resumeT); resumeT = setTimeout(start, 4000); };
    pk.ontouchstart = pause; pk.ontouchend = resume; pk.ontouchcancel = resume;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(() => {
      if (!isPhone() || !el()) return;
      const n = pk.children.length, i = idx(pk);
      go(i >= n - 1 ? 0 : i + 1);
    }, delay);
  };
  return { start, stop, go };
}
const carousels = { perk: makeCarousel("#pk", "#pd", 3500), step: makeCarousel("#st", "#sd", 4200) };
const startPerks = () => Object.values(carousels).forEach(c => c.start());
const stopPerks = () => Object.values(carousels).forEach(c => c.stop());

/* ---------- shell ---------- */
const NAV = [["", "Beranda"], ["joki", "Joki"], ["akun", "Akun"], ["item", "Item"], ["testimoni", "Testimoni"], ["bantuan", "Bantuan"]];
function shell() {
  document.title = CONFIG.brand + " - Joki & Akun Roblox";
  const ac = CONFIG.brandAccent || "", bn = CONFIG.brand;
  const nameHtml = ac && bn.endsWith(ac) ? esc(bn.slice(0, bn.length - ac.length)) + `<span class="ac">${esc(ac)}</span>` : esc(bn);
  $("#brand").innerHTML = (CONFIG.logo ? `<span class="lg" role="img" aria-label="Logo ${esc(bn)}" style="background-image:url('${esc(CONFIG.logo)}')"></span>` : "") + `<span>${nameHtml}</span>`;
  $("#links").innerHTML = NAV.map(n => `<a href="#/${n[0]}" data-r="${n[0]}">${n[1]}</a>`).join("");
  // menu bawah (HP): Beranda, Akun, Joki, Item, Testi - posisi tetap saat scroll
  const I = {
    "": '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    akun: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    joki: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    item: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    testimoni: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>'
  };
  const BN = [["", "Beranda"], ["akun", "Akun"], ["joki", "Joki"], ["item", "Item"], ["testimoni", "Testi"]];
  const bn0 = document.createElement("nav"); bn0.id = "bnav"; bn0.setAttribute("aria-label", "Menu bawah");
  bn0.innerHTML = BN.map(n => `<a href="#/${n[0]}" data-r="${n[0]}"><svg viewBox="0 0 24 24" aria-hidden="true">${I[n[0]]}</svg><span>${n[1]}</span></a>`).join("");
  document.body.appendChild(bn0);
  // footer: Marketplace (WhatsApp, Saluran) dan Social Media (Instagram, Facebook). Yang link-nya kosong di config.js otomatis tidak tampil.
  const fl = (t, u) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`;
  const mk = [fl("WhatsApp", wa("Halo " + CONFIG.brand + ", saya mau tanya-tanya dulu."))];
  if (/^https?:\/\//i.test(CONFIG.saluran || "")) mk.push(fl("Saluran WhatsApp", CONFIG.saluran));
  $("#fmarket").innerHTML = `<h4>Marketplace</h4><ul>${mk.join("")}</ul>`;
  const sc = [];
  if (CONFIG.instagram) sc.push(fl("Instagram", CONFIG.instagram));
  if (CONFIG.facebook) sc.push(fl("Facebook", CONFIG.facebook));
  $("#fsocw").innerHTML = sc.length ? `<h4>Social Media</h4><ul>${sc.join("")}</ul>` : "";
  $("#fsocw").style.display = sc.length ? "" : "none";
  // favicon dari logo
  if (CONFIG.logo) { const ic = document.createElement("link"); ic.rel = "icon"; ic.href = CONFIG.logo; document.head.appendChild(ic); }
  $("#fab").href = wa("Halo " + CONFIG.brand + ", saya mau tanya-tanya dulu.");
}

/* ---------- komponen ---------- */
const empty = (msg, btn) => `<div class="empty"><p>${msg}</p>${btn || ""}</div>`;
const moreLink = (type, total) => total > CONFIG.berandaJumlah ? `<a class="more" href="#/${type}">Lihat lainnya (${total - CONFIG.berandaJumlah}) →</a>` : "";
// kartu ringkas untuk beranda: foto kotak, nama, jumlah, panah. Di HP 3 kolom.
function homeCard(k, type, from) {
  const n = type === "joki" ? CONFIG.joki.filter(x => x.kategori === k.slug).length : type === "item" ? CONFIG.item.filter(x => x.kategori === k.slug && x.stok !== 0).length : CONFIG.akun.filter(x => x.kategori === k.slug && x.status === "ready").length;
  const label = { joki: n + " layanan", akun: n + " akun", item: n + " item" }[type];
  return `<a class="gcard" href="#/${type}/${esc(k.slug)}${from ? "?from=" + from : ""}" aria-label="${esc(k.name)}">${artBox(k)}
    <div class="grow"><div class="gtxt"><b>${esc(k.name)}</b><small>${label}</small></div><span class="garrow" aria-hidden="true">↗</span></div></a>`;
}
function catCard(k, type, from) {
  const n = type === "joki" ? CONFIG.joki.filter(x => x.kategori === k.slug).length : type === "item" ? CONFIG.item.filter(x => x.kategori === k.slug && x.stok !== 0).length : CONFIG.akun.filter(x => x.kategori === k.slug && x.status === "ready").length;
  const label = { joki: n + " layanan", akun: n + " akun ready", item: n + " item" }[type];
  return `<a class="cat" href="#/${type}/${esc(k.slug)}${from ? "?from=" + from : ""}">${artBox(k)}
    <div class="cb"><span class="badge" style="align-self:flex-start">${label}</span><h3>${esc(k.name)}</h3><p>${esc(k.desc)}</p><span class="go">${{ joki: "Lihat layanan joki →", akun: "Lihat akun →", item: "Lihat item →" }[type]}</span></div></a>`;
}