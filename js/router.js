/* =====================================================================
   ROUTER & EVENT  (js/router.js)
   Perpindahan halaman, klik tombol, dan start aplikasi.
   (Biasanya tidak perlu diedit.)
   ===================================================================== */

/* ---------- router ---------- */
function route() {
  const parts = location.hash.replace(/^#\/?/, "").split("?")[0].split("/").filter(Boolean);
  const p = parts[0] || "", sub = parts[1];
  const qs = Object.fromEntries(new URLSearchParams(location.hash.split("?")[1] || ""));
  const R = { "": pHome, joki: () => pKat("joki", sub, qs, parts[2]), akun: () => pKat("akun", sub, qs, parts[2]), item: () => pKat("item", sub, qs, parts[2]), testimoni: pTesti, cari: () => pCari(qs), bantuan: pBantuan,
    syarat: () => pPolicy("syarat"), refund: () => pPolicy("refund"), privasi: () => pPolicy("privasi") };
  if (typeof closeSearch === "function") closeSearch();
  stopSlider(); stopPerks(); stopGal(); stopTesti();
  (R[p] || notFound)();
  const T = { joki: "Layanan Joki", akun: "Katalog Akun", item: "Katalog Item", testimoni: "Testimoni", cari: "Cari", bantuan: "Bantuan & FAQ", syarat: "Syarat & Ketentuan", refund: "Kebijakan Refund", privasi: "Kebijakan Privasi" };
  const kk = ["joki", "akun", "item"].includes(p) && sub ? kat(sub, p) : null;
  const it = ["joki", "akun", "item"].includes(p) && parts[2] ? find(parts[2]) : null;
  document.title = p === "" || !T[p] ? CONFIG.brand + " - Joki & Akun Roblox" : (it ? itemName(it, p) + " - " + (kk ? kk.name : "") : kk ? ({ joki: "Joki ", akun: "Akun ", item: "Item " }[p]) + kk.name : T[p]) + " | " + CONFIG.brand;
  setMenu(false);
  if (p === "" && $("#sl")) startSlider();
  if (p === "") startPerks();
  document.querySelectorAll("#links a").forEach(a => a.classList.toggle("on", a.dataset.r === p));
  document.querySelectorAll("#bnav a").forEach(a => a.classList.toggle("on", a.dataset.r === p));
  const target = p === "" && qs.sec ? document.getElementById("sec-" + qs.sec) : null;
  if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
}

/* ---------- events ---------- */
function setMenu(open) {
  const hd = $("#hd"); hd.classList.toggle("open", open);
  const b = hd.querySelector(".burger"); if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
}
document.addEventListener("click", e => { if (e.target.closest("#links a")) setMenu(false); });
let tx = null;
document.addEventListener("touchstart", e => { tx = e.target.closest("#sl") ? e.touches[0].clientX : null; }, { passive: true });
document.addEventListener("touchend", e => {
  if (tx == null) return;
  const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 45) { showSlide(sliderIdx + (dx < 0 ? 1 : -1)); startSliderKeep(); }
}, { passive: true });
document.addEventListener("click", e => { if (e.target.id === "lb") closeZoom(); });
document.addEventListener("click", e => {
  const t = e.target.closest("[data-a]"); if (!t) return;
  if (t.dataset.a === "menu") setMenu(!$("#hd").classList.contains("open"));
  else if (t.dataset.a === "perk" || t.dataset.a === "step") { carousels[t.dataset.a].go(+t.dataset.i); carousels[t.dataset.a].start(); }
  else if (t.dataset.a === "slide") { showSlide(+t.dataset.i); startSliderKeep(); }
  else if (t.dataset.a === "gal" || t.dataset.a === "gdot") {
    const tr = $(".gal-track"); if (!tr) return;
    pauseGal();
    const w = tr.clientWidth, n = tr.children.length, cur = Math.round(tr.scrollLeft / w);
    const i = t.dataset.a === "gdot" ? +t.dataset.i : (cur + (+t.dataset.d) + n) % n;
    tr.scrollTo({ left: i * w, behavior: "smooth" });
  }
  else if (t.dataset.a === "share") {
    const url = shareUrl(), text = t.dataset.t + " - " + CONFIG.brand;
    if (navigator.share) navigator.share({ title: text, text: text, url: url }).catch(() => {});
    else window.open("https://wa.me/?text=" + encodeURIComponent(text + "\n" + url), "_blank", "noopener");
  }
  else if (t.dataset.a === "copy") {
    const url = shareUrl(), ok = () => toast("Link disalin");
    const fallback = () => { const ta = document.createElement("textarea"); ta.value = url; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { toast("Gagal menyalin, salin dari alamat browser"); } ta.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, fallback); else fallback();
  }
  else if (t.dataset.a === "tnav") {
    const tr = $("#tt"); if (!tr) return;
    pauseTesti();
    const n = tr.children.length, d = +t.dataset.d;
    testiGo(d > 0 ? (testiEnd(tr) ? 0 : testiIdx(tr) + 1) : (tr.scrollLeft < 4 ? n - 1 : testiIdx(tr) - 1));
  }
  else if (t.dataset.a === "zoom") { pauseTesti(); openZoom([...t.parentNode.children].indexOf(t)); }
  else if (t.dataset.a === "zoomx") closeZoom();
  else if (t.dataset.a === "zoomn") moveZoom(+t.dataset.d);
  else if (t.dataset.a === "qty") {
    const i = $("#q-" + t.dataset.id); if (!i) return;
    const mx = +i.max || 999; i.value = clampQ(clampQ(i.value, mx) + (+t.dataset.d), mx); updTotal(i);
  }
  else if (t.dataset.a === "orderj") {
    const j = find(t.dataset.id); if (!j) return;
    const q = clampQ(($("#q-" + j.id) || {}).value);
    const msg = "Halo " + CONFIG.brand + ", saya mau order joki:\n" + katName(j.kategori, "joki") + " - " + j.name +
      "\nJumlah: " + q + "x (" + j.unit + ")\nEstimasi harga: " + rp(j.price * q) +
      "\n\nTarget / detail pesanan:\n(Data login akan saya kirim lewat chat setelah dikonfirmasi)";
    window.open(wa(msg), "_blank", "noopener");
  }
  else if (t.dataset.a === "orderi") {
    const j = find(t.dataset.id); if (!j || j.stok === 0) return;
    const q = clampQ(($("#q-" + j.id) || {}).value, j.stok > 0 ? j.stok : 999);
    const msg = "Halo " + CONFIG.brand + ", saya mau beli item:\n" + katName(j.kategori, "item") + " - " + j.name +
      "\nJumlah: " + q + "x (" + j.unit + ")\nEstimasi harga: " + rp(j.price * q) +
      "\n\nMohon konfirmasi stok dan cara pengiriman item.";
    window.open(wa(msg), "_blank", "noopener");
  }
});
document.addEventListener("input", e => { if (e.target.dataset && e.target.dataset.p) updTotal(e.target); });
document.addEventListener("scroll", e => {
  const tr = e.target; if (!tr.classList || !tr.classList.contains("gal-track")) return;
  const i = Math.round(tr.scrollLeft / tr.clientWidth);
  document.querySelectorAll(".gal-dots button").forEach((d, k) => d.classList.toggle("on", k === i));
}, true);
// foto tidak ketemu: slide itu dibuang dari galeri (di kartu: gambar disembunyikan, warna latar tetap tampil)
document.addEventListener("error", e => {
  const im = e.target; if (!im || im.tagName !== "IMG") return;
  const ti = im.closest(".ti"); if (ti) { ti.remove(); testiRefresh(); return; }
  const th = im.closest(".tthumb"); if (th) { th.remove(); if (!document.querySelector(".tthumb")) { const s = $("#sec-testi"); if (s) s.remove(); } return; }
  const sl = im.closest(".gal-track > .art");
  if (!sl) { if (im.closest(".cat .art, .gcard .art, .khead .art")) im.style.display = "none"; return; }
  const tr = sl.parentNode, gal = sl.closest(".gal");
  if (tr.children.length < 2) { im.style.display = "none"; return; }   // satu-satunya foto: sembunyikan, warna latar tetap tampil
  sl.remove();
  gal.querySelectorAll(".gal-dots button").forEach((d, i) => { if (i >= tr.children.length) d.remove(); });
  if (tr.children.length < 2) { gal.querySelectorAll(".gn, .gal-dots").forEach(n => n.remove()); stopGal(); }
}, true);
["touchstart", "touchend", "wheel"].forEach(ev => document.addEventListener(ev, e => {
  if (e.target.closest && e.target.closest(".gal-track")) pauseGal();
  if (e.target.closest && e.target.closest(".testi-track")) pauseTesti();
}, { passive: true }));
window.addEventListener("hashchange", route);

shell();
route();