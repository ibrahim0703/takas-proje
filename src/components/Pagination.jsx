// Sayfa gezinme çubuğu:  ‹  Sayfa 1 / N  ›
// - Numara 1-tabanlı gösterilir (içeride page 0 -> ekranda 1).
// - İlk sayfada (page 0) geri oku KAPALI  -> page -1'e gidip bug olmaz.
// - Son sayfada (hasMore false) ileri oku KAPALI.
// - Geçiş sırasında (gecis) ikisi de kapalı.
export default function Pagination({ page, size, toplam, hasMore, gecis, onPrev, onNext }) {
  const toplamSayfa = Math.max(1, Math.ceil(toplam / size));
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
      <button className="filter-btn" onClick={onPrev} disabled={page === 0 || gecis} title="Önceki">‹</button>
      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Sayfa <strong style={{ color: "var(--text)" }}>{page + 1}</strong> / {toplamSayfa}
      </span>
      <button className="filter-btn" onClick={onNext} disabled={!hasMore || gecis} title="Sonraki">›</button>
    </div>
  );
}
