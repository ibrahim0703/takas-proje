// Durum rozeti: backend'den gelen status'e göre renkli etiket.
export default function StatusBadge({ status }) {
  if (status === "EQUAL") return <span className="status-badge status-equal">EŞİT</span>;
  if (status === "DIFFERENT") return <span className="status-badge status-diff">FARKLI</span>;
  if (status === "ONLY_IN_DB1") return <span className="status-badge status-only">SADECE DB1</span>;
  if (status === "ONLY_IN_DB2") return <span className="status-badge status-only">SADECE DB2</span>;
  return <span className="status-badge">{status}</span>;
}
