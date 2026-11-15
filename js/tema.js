/* =====================================================================
   TEMA TERANG / GELAP  (js/tema.js)
   Tombol bulan / matahari di header. Pilihan pengunjung disimpan di browsernya.
   Pertama kali buka: mengikuti pengaturan HP / laptop pengunjung.
   Warna mode gelap ada di bagian paling bawah css/style.css (MODE GELAP).
   (Biasanya tidak perlu diedit.)
   ===================================================================== */
(function () {
  const root = document.documentElement, WARNA = { terang: "#f6f1e7", gelap: "#1a1812" };
  function terapkan(gelap) {
    if (gelap) root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", gelap ? WARNA.gelap : WARNA.terang);
    document.querySelectorAll('[data-a="theme"]').forEach(b => {
      b.setAttribute("aria-pressed", gelap ? "true" : "false");
      b.setAttribute("aria-label", gelap ? "Ganti ke mode terang" : "Ganti ke mode gelap");
      b.title = gelap ? "Mode terang" : "Mode gelap";
    });
  }
  terapkan(root.getAttribute("data-theme") === "dark");   // atribut sudah diatur lebih awal oleh script kecil di <head> index.html
  document.addEventListener("click", e => {
    if (!e.target.closest('[data-a="theme"]')) return;
    const gelap = root.getAttribute("data-theme") !== "dark";
    terapkan(gelap);
    try { localStorage.setItem("ng-tema", gelap ? "dark" : "light"); } catch (err) { /* penyimpanan dimatikan: tema tetap berganti, hanya tidak diingat */ }
  });
})();
