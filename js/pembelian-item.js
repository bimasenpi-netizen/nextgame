/* =====================================================================
   PEMBELIAN ITEM  (js/pembelian-item.js)
   Kartu item di dalam kategori + halaman pembelian item (foto 1:1, harga, stok, jumlah, deskripsi).
   Isi / harga / stok / deskripsi diubah di js/beli-item.js, bukan di sini.
   ===================================================================== */

function itemArt(x) {
  const k = kat(x.kategori, "item") || {};
  return artBox({ img: x.img || k.img, name: x.name, color: k.color, art: k.art }, tagHtml(x));          // 1:1 + label (Terlaris / Promo)
}
// label stok: "Sisa 10" / "Habis" / kosong (stok tidak dibatasi)
function stokBadge(x) {
  if (x.stok === 0) return `<span class="badge sold">Habis</span>`;
  if (x.stok > 0) return `<span class="badge">Sisa ${x.stok}</span>`;
  return "";
}
// panel sisa stok di halaman pembelian: jumlah sisa, peringatan kalau tinggal sedikit
const STOK_RENDAH = 5;   // sisa <= angka ini = tampil "Segera habis" (ubah sesuai selera)
function stokPanel(x) {
  if (x.stok === 0) return `<div class="stock out"><span>Stok habis</span></div>`;
  if (!(x.stok > 0)) return "";
  const rendah = x.stok <= STOK_RENDAH;
  return `<div class="stock ${rendah ? "low" : ""}"><span>Sisa stok</span><b>${x.stok} ${esc(x.unit)}</b>${rendah ? `<em>Segera habis!</em>` : ""}</div>`;
}
// kartu di dalam kategori: foto 1:1, nama item, Rp10.000/pcs, sisa stok
function itemCard(x, qs) {
  const from = qs && qs.from ? "?from=" + encodeURIComponent(qs.from) : "", habis = x.stok === 0;
  return `<a class="cat item ${habis ? "sold" : ""}" href="#/item/${esc(x.kategori)}/${x.id}${from}">${itemArt(x)}
    <div class="cb"><h3>${esc(x.name)}</h3><div class="pr">${hargaHtml(x, x.unit)}</div>${stokBadge(x)}</div></a>`;
}
// halaman pembelian item: foto, nama, harga, stok, jumlah, deskripsi
function pProdukItem(id, slug, qs) {
  const x = find(id), k = katList("item").find(c => c.slug === slug);
  if (!x || !k || x.kategori !== slug || id[0] !== "i") return notFound();
  const from = qs && qs.from ? "?from=" + encodeURIComponent(qs.from) : "";
  const habis = x.stok === 0, mx = x.stok > 0 ? x.stok : 999;
  const lain = CONFIG.item.filter(a => a.kategori === slug && a.id !== x.id && a.stok !== 0).slice(0, 4);   // item lain yang masih ada, game yang sama
  app.innerHTML = `<div class="wrap sec">
    <a class="back" href="#/item/${esc(slug)}${from}">← Kembali ke ${esc(k.name)}</a>
    <div class="detail"><div class="gal"><div class="gal-track">${itemArt(x)}</div></div>
      <div class="dinfo">
        <div class="row" style="justify-content:flex-start"><span class="mono">${esc(k.name)}</span>${stokBadge(x)}</div>
        <h2>${esc(x.name)}</h2>
        <div class="price">${hargaHtml(x, x.unit)}</div>
        ${stokPanel(x)}
        ${habis ? "" : `<div class="dlabel">Jumlah <small>(${esc(x.jumlah)})</small></div>
        <div class="stepper">
          <button type="button" data-a="qty" data-d="-1" data-id="${x.id}" aria-label="Kurangi">−</button>
          <input type="number" inputmode="numeric" min="1" max="${mx}" value="1" id="q-${x.id}" data-p="${x.price}" aria-label="Jumlah">
          <button type="button" data-a="qty" data-d="1" data-id="${x.id}" aria-label="Tambah">+</button>
        </div>
        ${x.stok > 0 ? `<div class="lim" id="lim">Maks. beli ${x.stok} ${esc(x.unit)} (sesuai sisa stok)</div>` : ""}
        <div class="total"><span>Estimasi total</span><b id="tot">${rp(x.price)}</b></div>`}
        ${descBlock(x.desc, "item")}
        ${habis ? `<span class="btn alt" style="cursor:default;box-shadow:none">Stok habis</span>` :
          `<button class="btn wa" data-a="orderi" data-id="${x.id}">Beli via WhatsApp</button>
        <div class="trust"><span>✓ Amanah</span><span>✓ No hack back</span></div>
        ${shareBar(x.name + " (" + rp(x.price) + "/" + x.unit + ")")}
        <a class="lnk" target="_blank" rel="noopener" href="${wa("Halo " + CONFIG.brand + ", saya mau tanya item: " + k.name + " - " + x.name)}">Tanya dulu</a>`}
        <div class="note" style="margin-top:0">Jangan kirim password lewat website. Cara pengiriman item disepakati lewat chat setelah pesanan dikonfirmasi.</div>
      </div></div>
    ${lain.length ? `<div class="others"><h2>Item lainnya</h2><div class="catgrid">${lain.map(a => itemCard(a, qs)).join("")}</div></div>` : ""}
  </div>`;
  const q = $("#q-" + x.id); if (q) updTotal(q);   // set status tombol + / batas stok sejak awal
}