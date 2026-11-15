/* =====================================================================
   PEMBELIAN JOKI  (js/pembelian-joki.js)
   Kartu joki di dalam kategori + halaman pembelian joki (foto 1:1, harga, jumlah, deskripsi).
   Isi / harga / deskripsi diubah di js/beli-joki.js, bukan di sini.
   ===================================================================== */

const clampQ = (v, max) => Math.max(1, Math.min(max || 999, parseInt(v) || 1));
function updTotal(inp) {
  const mx = +inp.max || 999, over = +inp.value > mx;
  if (over) inp.value = mx;                            // tidak boleh melebihi stok
  const q = clampQ(inp.value, mx);
  const el = $("#tot"); if (el) el.textContent = rp(+inp.dataset.p * q);
  // batas stok (hanya item yang punya stok): matikan tombol +, ubah tulisan batas
  const lim = $("#lim");
  if (lim) {
    const penuh = q >= mx;
    lim.classList.toggle("max", penuh);
    lim.textContent = over ? "Stok hanya tersisa " + mx + ", jumlah disesuaikan." : penuh ? "Batas pembelian tercapai (sisa stok " + mx + ")." : "Maks. beli " + mx + " (sesuai sisa stok)";
    const plus = document.querySelector('.stepper button[data-d="1"]'), min = document.querySelector('.stepper button[data-d="-1"]');
    if (plus) plus.disabled = penuh;
    if (min) min.disabled = q <= 1;
  }
}
function jokiArt(x) {
  const k = kat(x.kategori, "joki") || {};
  return artBox({ img: x.img || k.img, name: x.name, color: k.color, art: k.art }, tagHtml(x));          // 1:1 + label (Terlaris / Promo)
}
// kartu di dalam kategori: foto 1:1, nama produk, Rp10.000/100 Level
function jokiCard(x, qs) {
  const from = qs && qs.from ? "?from=" + encodeURIComponent(qs.from) : "";
  return `<a class="cat item" href="#/joki/${esc(x.kategori)}/${x.id}${from}">${jokiArt(x)}
    <div class="cb"><h3>${esc(x.name)}</h3><div class="pr">${hargaHtml(x, x.unit)}</div></div></a>`;
}
// halaman pembelian joki: foto, nama, harga, jumlah, deskripsi
function pItemJoki(id, slug, qs) {
  const x = find(id), k = katList("joki").find(c => c.slug === slug);
  if (!x || !k || x.kategori !== slug || id[0] !== "j") return notFound();
  const from = qs && qs.from ? "?from=" + encodeURIComponent(qs.from) : "";
  const lain = CONFIG.joki.filter(a => a.kategori === slug && a.id !== x.id).slice(0, 4);   // layanan joki lain, game yang sama
  app.innerHTML = `<div class="wrap sec">
    <a class="back" href="#/joki/${esc(slug)}${from}">← Kembali ke ${esc(k.name)}</a>
    <div class="detail"><div class="gal"><div class="gal-track">${jokiArt(x)}</div></div>
      <div class="dinfo">
        <span class="mono">${esc(k.name)}</span>
        <h2>${esc(x.name)}</h2>
        <div class="price">${hargaHtml(x, x.unit)}</div>
        <div class="dlabel">Jumlah <small>(${esc(x.jumlah)})</small></div>
        <div class="stepper">
          <button type="button" data-a="qty" data-d="-1" data-id="${x.id}" aria-label="Kurangi">−</button>
          <input type="number" inputmode="numeric" min="1" max="999" value="1" id="q-${x.id}" data-p="${x.price}" aria-label="Jumlah">
          <button type="button" data-a="qty" data-d="1" data-id="${x.id}" aria-label="Tambah">+</button>
        </div>
        <div class="total"><span>Estimasi total</span><b id="tot">${rp(x.price)}</b></div>
        ${descBlock(x.desc, "joki")}
        <button class="btn wa" data-a="orderj" data-id="${x.id}">Pesan via WhatsApp</button>
        <div class="trust"><span>✓ Amanah</span><span>✓ No hack back</span></div>
        ${shareBar(x.name + " (" + rp(x.price) + "/" + x.unit + ")")}
        <a class="lnk" target="_blank" rel="noopener" href="${wa("Halo " + CONFIG.brand + ", saya mau tanya joki: " + k.name + " - " + x.name)}">Tanya dulu</a>
        <div class="note" style="margin-top:0">Jangan kirim password lewat website. Data login hanya diberikan lewat chat setelah pesanan dikonfirmasi.</div>
      </div></div>
    ${lain.length ? `<div class="others"><h2>Joki lainnya</h2><div class="catgrid">${lain.map(a => jokiCard(a, qs)).join("")}</div></div>` : ""}
  </div>`;
}