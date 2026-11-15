/* =====================================================================
   PEMBELIAN AKUN  (js/pembelian-akun.js)
   Kartu akun di dalam kategori + halaman pembelian akun (foto 1080x1350 slide, harga, deskripsi).
   Slide otomatis geser ke kiri tiap 5 detik; kalau user geser / klik panah, diam 10 detik dulu.
   Isi / harga / foto / deskripsi diubah di js/beli-akun.js, bukan di sini.
   ===================================================================== */

// daftar foto akun: "Foto : a.jpg, b.jpg" (imgs) > "Foto : 3" (otomatis akun1-1.jpg ...) > foto kategori
function akunImgs(x) {
  const k = kat(x.kategori, "akun") || {};
  if (x.imgs && x.imgs.length) return x.imgs;
  if (+x.foto > 0) {
    const kode = x.kode || "akun" + (+x.id.slice(1) + 1), ext = x.ext || "jpg";
    return Array.from({ length: Math.min(+x.foto, 20) }, (_, i) => `${kode}-${i + 1}.${ext}`);
  }
  return k.img ? [k.img] : [];
}
function akunArt(x) {
  const k = kat(x.kategori, "akun") || {};
  return artBox({ img: akunImgs(x)[0], name: x.title, color: k.color, art: k.art }, tagHtml(x), true);   // 1080x1350 (4:5) + label
}
// kartu di dalam kategori: foto 4:5, nama produk, harga, ready / terjual
function akunCard(x, qs) {
  const sold = x.status === "sold", from = qs && qs.from ? "?from=" + encodeURIComponent(qs.from) : "";
  return `<a class="cat item ${sold ? "sold" : ""}" href="#/akun/${esc(x.kategori)}/${x.id}${from}">${akunArt(x)}
    <div class="cb"><h3>${esc(x.title)}</h3><div class="pr">${hargaHtml(x)}</div><span class="badge ${sold ? "sold" : ""}">${sold ? "Terjual" : "Ready"}</span></div></a>`;
}
// galeri slide di halaman pembelian
function galHtml(x) {
  const k = kat(x.kategori, "akun") || {}, imgs = akunImgs(x);
  const slides = imgs.length
    ? imgs.map((src, i) => artBox({ img: src, name: x.title + " " + (i + 1), color: k.color }, i === 0 ? tagHtml(x) : "", true))
    : [artBox({ color: k.color, art: k.art, name: x.title }, tagHtml(x), true)];
  const n = slides.length;
  return `<div class="gal"><div class="gal-track">${slides.join("")}</div>
    ${n > 1 ? `<button type="button" class="gn l" data-a="gal" data-d="-1" aria-label="Sebelumnya">‹</button><button type="button" class="gn r" data-a="gal" data-d="1" aria-label="Berikutnya">›</button>
    <div class="gal-dots">${slides.map((_, i) => `<button type="button" class="${i === 0 ? "on" : ""}" data-a="gdot" data-i="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}</div>` : ""}</div>`;
}
/* auto-slide: geser tiap 5 detik, kalau user geser/klik panah diam 10 detik dulu */
let galTimer = null, galResume = null;
const GAL_JEDA = 5000, GAL_DIAM = 10000;
function stopGal() { clearInterval(galTimer); clearTimeout(galResume); galTimer = galResume = null; }
function galNext() {
  const tr = $(".gal-track"); if (!tr) return stopGal();
  const n = tr.children.length, w = tr.clientWidth, cur = Math.round(tr.scrollLeft / w);
  tr.scrollTo({ left: ((cur + 1) % n) * w, behavior: "smooth" });
}
function startGal() {
  stopGal();
  const tr = $(".gal-track"); if (!tr || tr.children.length < 2) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  galTimer = setInterval(galNext, GAL_JEDA);
}
function pauseGal() {
  const tr = $(".gal-track"); if (!tr || tr.children.length < 2) return;
  stopGal();
  galResume = setTimeout(() => { galNext(); startGal(); }, GAL_DIAM);
}
// halaman pembelian akun: foto slide, nama, harga, deskripsi
function pItemAkun(id, slug, qs) {
  const x = find(id), k = katList("akun").find(c => c.slug === slug);
  if (!x || !k || x.kategori !== slug || id[0] !== "a") return notFound();
  const from = qs && qs.from ? "?from=" + encodeURIComponent(qs.from) : "", sold = x.status === "sold";
  const lain = CONFIG.akun.filter(a => a.kategori === slug && a.id !== x.id && a.status !== "sold").slice(0, 4);   // akun lain yang masih ready, game yang sama
  app.innerHTML = `<div class="wrap sec">
    <a class="back" href="#/akun/${esc(slug)}${from}">← Kembali ke ${esc(k.name)}</a>
    <div class="detail">${galHtml(x)}
      <div class="dinfo">
        <div class="row" style="justify-content:flex-start"><span class="mono">${esc(k.name)}</span><span class="badge ${sold ? "sold" : ""}">${sold ? "Terjual" : "Ready"}</span></div>
        <h2>${esc(x.title)}</h2>
        <div class="price">${hargaHtml(x)}</div>
        ${descBlock(x.desc, "akun")}
        ${sold ? `<span class="btn alt" style="cursor:default;box-shadow:none">Sudah terjual</span>` :
          `<a class="btn wa" target="_blank" rel="noopener" href="${wa("Halo " + CONFIG.brand + ", saya mau beli akun:\n" + k.name + " - " + x.title + "\nHarga: " + rp(x.price) + "\n\nMasih ready?")}">Beli via WhatsApp</a>
           <div class="trust"><span>✓ Amanah</span><span>✓ No hack back</span></div>`}
        ${shareBar(x.title + " (" + rp(x.price) + ")")}
      </div></div>
    ${lain.length ? `<div class="others"><h2>Akun lainnya</h2><div class="catgrid">${lain.map(a => akunCard(a, qs)).join("")}</div></div>` : ""}
  </div>`;
  startGal();
}