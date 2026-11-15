/* =====================================================================
   CARI  (js/cari.js)
   Kolom cari di header (tombol kaca pembesar): hasil langsung muncul saat mengetik.
   Tekan Enter = buka halaman hasil lengkap (#/cari?q=...).
   Mencari di nama produk, nama game, dan jenis (joki / akun / item) sekaligus.
   (Biasanya tidak perlu diedit.)
   ===================================================================== */

const JENIS = { akun: "Akun", joki: "Joki", item: "Item" };
const cariTersedia = (t, x) => t === "akun" ? x.status !== "sold" : t === "item" ? x.stok !== 0 : true;
function cariData() {
  const out = [];
  Object.keys(JENIS).forEach(t => CONFIG[t].forEach(x => {
    if (!katList(t).some(c => c.slug === x.kategori)) return;   // kategorinya belum terdaftar = produk tidak tampil di website, jangan ikut dicari
    const k = kat(x.kategori, t) || {}, nama = itemName(x, t);
    out.push({ t, x, nama, game: k.name || x.kategori, key: (nama + " " + (k.name || "") + " " + JENIS[t] + " " + (x.label || "")).toLowerCase() });
  }));
  return out;
}
// semua kata harus ketemu (urutan bebas). Yang masih tersedia ditaruh di atas, yang nama-nya cocok di depan.
function cari(q) {
  const kata = String(q || "").toLowerCase().split(/\s+/).filter(Boolean), full = kata.join(" ");
  if (!kata.length) return [];
  return cariData().filter(r => kata.every(s => r.key.includes(s)))
    .map(r => ({ ...r, skor: (r.nama.toLowerCase().startsWith(full) ? 3 : r.nama.toLowerCase().includes(full) ? 2 : 0) + (cariTersedia(r.t, r.x) ? 1 : -5) }))
    .sort((a, b) => b.skor - a.skor);
}
function cariThumb(r) {
  const k = kat(r.x.kategori, r.t) || {}, src = r.t === "akun" ? akunImgs(r.x)[0] : (r.x.img || k.img);
  return `<span class="gth" style="background:${esc(k.color || "#c6f432")}">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : ""}</span>`;
}
function cariRow(r) {
  const habis = !cariTersedia(r.t, r.x), harga = rp(r.x.price) + (r.t !== "akun" ? "/" + esc(r.x.unit) : "");
  return `<a class="gr ${habis ? "sold" : ""}" href="#/${r.t}/${esc(r.x.kategori)}/${r.x.id}">${cariThumb(r)}
    <span class="gtx"><b>${esc(r.nama)}</b><small>${JENIS[r.t]} · ${esc(r.game)}${habis ? " · " + (r.t === "akun" ? "Terjual" : "Habis") : ""}</small></span><span class="gpr">${harga}</span></a>`;
}
// tombol nama game (isi cepat kolom cari)
function cariChips(target) {
  const n = [];
  [...CONFIG.kategoriAkun, ...CONFIG.kategoriJoki, ...CONFIG.kategoriItem].forEach(k => { if (!n.includes(k.name)) n.push(k.name); });
  return n.slice(0, 8).map(x => `<button type="button" class="gchip" data-a="chip" data-in="${target}" data-q="${esc(x)}">${esc(x)}</button>`).join("");
}
const cariKosong = q => `Tidak ada hasil untuk “${esc(q)}”. Coba kata lain, atau <a href="${wa("Halo " + CONFIG.brand + ", saya cari: " + q)}" target="_blank" rel="noopener"><b>tanya admin</b></a>.`;

/* ---------- panel cari di header ---------- */
function initCari() {
  const hd = $("#hd"); if (!hd || $("#sbar")) return;
  const bar = document.createElement("div"); bar.id = "sbar"; bar.className = "sbar"; bar.hidden = true;
  bar.innerHTML = `<div class="wrap"><input type="search" id="gq" class="finput" placeholder="Cari akun, joki, atau item..." autocomplete="off" aria-label="Cari produk"><div id="gres" class="gres"></div></div>`;
  hd.appendChild(bar);
  $("#gq").addEventListener("input", drawCari);
  $("#gq").addEventListener("keydown", e => {
    if (e.key === "Enter") { const q = e.target.value.trim(); if (q) { closeSearch(); location.hash = "#/cari?q=" + encodeURIComponent(q); } }
  });
}
function drawCari() {
  const q = $("#gq").value.trim(), box = $("#gres");
  if (!q) { box.innerHTML = `<p class="ghint">Ketik nama game atau produk, contoh: <b>blox</b>, <b>akun</b>, <b>raid</b>.</p><div class="gchips">${cariChips("gq")}</div>`; return; }
  const r = cari(q);
  box.innerHTML = !r.length ? `<p class="ghint">${cariKosong(q)}</p>` :
    r.slice(0, 6).map(cariRow).join("") + `<a class="gall" href="#/cari?q=${encodeURIComponent(q)}">${r.length > 6 ? "Lihat semua " + r.length + " hasil →" : "Buka halaman hasil →"}</a>`;
}
function openSearch() {
  const b = $("#sbar"); if (!b) return;
  if (typeof setMenu === "function") setMenu(false);
  b.hidden = false; drawCari();
  document.querySelectorAll('[data-a="search"]').forEach(x => x.setAttribute("aria-expanded", "true"));
  $("#gq").focus();
}
function closeSearch() {
  const b = $("#sbar"); if (!b || b.hidden) return;
  b.hidden = true;
  document.querySelectorAll('[data-a="search"]').forEach(x => x.setAttribute("aria-expanded", "false"));
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-a]");
  if (t && t.dataset.a === "search") { const b = $("#sbar"); if (b && !b.hidden) closeSearch(); else openSearch(); return; }
  if (t && t.dataset.a === "chip") { const i = $("#" + t.dataset.in); if (i) { i.value = t.dataset.q; i.dispatchEvent(new Event("input", { bubbles: true })); i.focus(); } return; }
  if (e.target.closest("#sbar a")) { closeSearch(); return; }                       // buka hasil: tutup panel
  if (!e.target.closest("#sbar")) closeSearch();                                    // klik di luar panel
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSearch(); });
document.addEventListener("error", e => { const im = e.target; if (im && im.tagName === "IMG" && im.closest(".gth")) im.style.display = "none"; }, true);

/* ---------- halaman hasil: #/cari?q=... ---------- */
function pCari(qs) {
  const q0 = ((qs && qs.q) || "").trim();
  app.innerHTML = `<div class="wrap sec"><div class="sechead"><div><h2>Cari</h2><p id="cinfo"></p></div></div>
    <div class="filters"><input type="search" id="cq" class="finput" value="${esc(q0)}" placeholder="Cari akun, joki, atau item..." autocomplete="off" aria-label="Cari produk"></div>
    <div id="cres"></div></div>`;
  const inp = $("#cq");
  const gambar = () => {
    const q = inp.value.trim();
    history.replaceState(null, "", q ? "#/cari?q=" + encodeURIComponent(q) : "#/cari");   // alamat ikut berubah tanpa memuat ulang halaman
    if (!q) {
      $("#cinfo").textContent = "Cari di semua joki, akun, dan item.";
      $("#cres").innerHTML = `<p class="ghint">Ketik nama game atau produk, atau pilih salah satu:</p><div class="gchips">${cariChips("cq")}</div>`;
      return;
    }
    const r = cari(q);
    $("#cinfo").textContent = r.length + " hasil untuk “" + q + "”";
    if (!r.length) { $("#cres").innerHTML = empty(cariKosong(q)); return; }
    const kartu = { akun: akunCard, joki: jokiCard, item: itemCard };
    $("#cres").innerHTML = Object.keys(JENIS).map(t => {
      const l = r.filter(x => x.t === t); if (!l.length) return "";
      return `<div class="cgrup"><h3>${JENIS[t]} (${l.length})</h3><div class="catgrid">${l.map(x => kartu[t](x.x)).join("")}</div></div>`;
    }).join("");
  };
  inp.addEventListener("input", gambar);
  gambar();
  if (!q0) inp.focus();
}
initCari();
