/* =====================================================================
   HALAMAN TESTIMONI  (js/testimoni.js)
   Halaman sendiri (menu "Testimoni") berisi screenshot / foto testimoni pelanggan.
   Gambar bergeser ke kiri otomatis tiap 3 detik. Kalau user menyentuh / geser / klik panah,
   diam 6 detik dulu. Ketuk gambar = diperbesar.

   CARA ISI  (pilih satu, boleh dicampur, satu baris = satu "Foto :")
       Foto : 12                         OTOMATIS: testi-1.jpg sampai testi-12.jpg
       Foto : 12 png                     sama, tapi fotonya PNG  (testi-1.png ... testi-12.png)
       Foto : bukti1.jpg, bukti2.jpg     tulis nama file satu-satu (pisah koma)

   UKURAN   bebas (screenshot HP biasa juga bisa). Ideal rasio 4:5 (1080x1350), tidak terpotong.
            Taruh file fotonya di folder yang sama dengan index.html.
   URUTAN   urutan di file ini = urutan geser.
   TAMBAH   tambah angka / nama file.   HAPUS   hapus nama file / kecilkan angka.
   Kalau ada file yang tidak ketemu, otomatis dilewati (aman kalau angkanya kebanyakan).
   Baris yang diawali tanda #  = catatan, tidak tampil di website.
   ===================================================================== */

const TESTIMONI = String.raw`
Foto : Gambar/image.png, Gambar/image copy.png, Gambar/image copy 2.png
`;

/* ---------- baca daftar foto ---------- */
CONFIG.testimoni = (function () {
  const hasil = [];
  String(typeof TESTIMONI === "string" ? TESTIMONI : "").split("\n").forEach(raw => {
    const t = raw.trim(); if (!t || t[0] === "#") return;
    const m = t.match(/^[^:]{1,20}:\s*(.*)$/); if (!m) return;
    const v = m[1].trim(), n = v.match(/^(\d+)(?:\s+(\w+))?$/);
    if (n) { const ext = (n[2] || "jpg").replace(/^\./, ""); for (let i = 1; i <= Math.min(+n[1], 60); i++) hasil.push("testi-" + i + "." + ext); }
    else v.split(",").map(s => s.trim()).filter(Boolean).forEach(s => hasil.push(s));
  });
  return hasil;
})();

/* ---------- halaman testimoni ---------- */
function pTesti() {
  const list = CONFIG.testimoni;
  app.innerHTML = `<div class="wrap sec">
    <div class="sechead"><div><h2>Testimoni</h2><p>Bukti pesanan dari pelanggan ${esc(CONFIG.brand)}.</p></div></div>
    ${list.length ? `<div class="testi">
      <div class="testi-track" id="tt">${list.map((src, i) => `<button type="button" class="ti" data-a="zoom" aria-label="Perbesar testimoni ${i + 1}"><img src="${esc(src)}" alt="Testimoni ${i + 1}" loading="${i < 4 ? "eager" : "lazy"}" draggable="false"></button>`).join("")}</div>
      <button type="button" class="gn l" data-a="tnav" data-d="-1" aria-label="Sebelumnya">‹</button><button type="button" class="gn r" data-a="tnav" data-d="1" aria-label="Berikutnya">›</button>
      <div class="tcount" id="tc">1 / ${list.length}</div>
      <p class="thint">Geser atau ketuk gambar untuk memperbesar.</p></div>` :
      empty("Testimoni segera hadir.", `<a class="btn wa" target="_blank" rel="noopener" href="${wa("Halo " + CONFIG.brand + ", saya mau lihat testimoni pelanggan.")}">Tanya admin</a>`)}
    ${/^https?:\/\//i.test(CONFIG.saluran || "") ? `<div class="saluran"><a class="btn wa" target="_blank" rel="noopener" href="${esc(CONFIG.saluran)}">${esc(CONFIG.saluranTeks || "Gabung Saluran")}</a></div>` : ""}
    <div class="note" style="text-align:center">Mau pesan juga? <a href="#/joki"><b>Joki</b></a> · <a href="#/akun"><b>Akun</b></a> · <a href="#/item"><b>Item</b></a></div>
  </div>`;
  const tr = $("#tt"); if (!tr) return;
  tr.onscroll = testiCount;
  startTesti();
}

/* ---------- geser otomatis: tiap 3 detik, kalau user menyentuh diam 6 detik ---------- */
let testiTimer = null, testiResume = null;
const TESTI_JEDA = 3000, TESTI_DIAM = 6000;
function stopTesti() { clearInterval(testiTimer); clearTimeout(testiResume); testiTimer = testiResume = null; }
function testiStep(tr) { const c = tr.children; return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : tr.clientWidth; }
const testiEnd = tr => tr.scrollLeft >= tr.scrollWidth - tr.clientWidth - 4;
function testiIdx(tr) { return testiEnd(tr) ? tr.children.length - 1 : Math.max(0, Math.min(tr.children.length - 1, Math.round(tr.scrollLeft / testiStep(tr)))); }
function testiCount() { const tr = $("#tt"), c = $("#tc"); if (tr && c) c.textContent = (testiIdx(tr) + 1) + " / " + tr.children.length; }
function testiGo(i) { const tr = $("#tt"); if (tr) tr.scrollTo({ left: i * testiStep(tr), behavior: "smooth" }); }
function testiNext() {
  const tr = $("#tt"); if (!tr) return stopTesti();
  testiGo(testiEnd(tr) ? 0 : testiIdx(tr) + 1);
}
function startTesti() {
  stopTesti();
  const tr = $("#tt"); if (!tr || tr.children.length < 2) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  testiTimer = setInterval(testiNext, TESTI_JEDA);
}
function pauseTesti() {
  const tr = $("#tt"); if (!tr || tr.children.length < 2) return;
  stopTesti();
  testiResume = setTimeout(startTesti, TESTI_DIAM);
}
// dipanggil kalau satu foto tidak ketemu (file belum ada): foto itu dibuang
function testiRefresh() {
  const tr = $("#tt"); if (!tr) return;
  if (!tr.children.length) {
    stopTesti();
    const box = tr.closest(".testi"); if (box) box.outerHTML = empty("Testimoni segera hadir.");
    return;
  }
  if (tr.children.length < 2) { stopTesti(); document.querySelectorAll(".testi .gn").forEach(n => n.remove()); }
  testiCount();
}

/* ---------- perbesar gambar (lightbox) ---------- */
let lbList = [], lbIdx = 0;
function lbShow() {
  const box = $("#lb"); if (!box) return;
  box.querySelector("img").src = lbList[lbIdx];
  box.querySelectorAll(".lb-n").forEach(b => b.style.display = lbList.length > 1 ? "" : "none");
}
function openZoom(i) {
  lbList = [...document.querySelectorAll("#tt img")].map(im => im.getAttribute("src"));
  if (!lbList.length) return;
  lbIdx = Math.max(0, Math.min(i, lbList.length - 1));
  let box = $("#lb");
  if (!box) {
    box = document.createElement("div"); box.id = "lb"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Testimoni diperbesar");
    box.innerHTML = `<button type="button" class="lb-x" data-a="zoomx" aria-label="Tutup">×</button><button type="button" class="lb-n l" data-a="zoomn" data-d="-1" aria-label="Sebelumnya">‹</button><img alt="Testimoni"><button type="button" class="lb-n r" data-a="zoomn" data-d="1" aria-label="Berikutnya">›</button>`;
    document.body.appendChild(box);
  }
  box.hidden = false; lbShow();
}
function closeZoom() { const box = $("#lb"); if (box) box.hidden = true; }
function moveZoom(d) { if (lbList.length) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbShow(); } }
document.addEventListener("keydown", e => {
  const box = $("#lb"); if (!box || box.hidden) return;
  if (e.key === "Escape") closeZoom(); else if (e.key === "ArrowLeft") moveZoom(-1); else if (e.key === "ArrowRight") moveZoom(1);
});