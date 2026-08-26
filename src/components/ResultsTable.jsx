import StatusBadge from "./StatusBadge";

// Liste ekranı: özet + filtre butonları + sonuç tablosu.
// Bir satıra tıklanınca (EQUAL olmayanlar) onRowClick(r) çağrılır -> App detay penceresini açar.
export default function ResultsTable({ sonuclar, filtre, setFiltre, onRowClick }) {
  if (!sonuclar.length) return <div className="empty-box">Sonuç bulunamadı.</div>;

  const esit = sonuclar.filter((r) => r.status === "EQUAL").length;
  const farkli = sonuclar.filter((r) => r.status === "DIFFERENT").length;

  // Filtre: ALL hepsi, EQUAL sadece eşit, DIFFERENT eşit olmayan her şey
  const gorunen = sonuclar.filter((r) =>
    filtre === "ALL" ? true : filtre === "EQUAL" ? r.status === "EQUAL" : r.status !== "EQUAL"
  );

  const filtreler = [["ALL", "Hepsi"], ["EQUAL", "Sadece Eşit"], ["DIFFERENT", "Sadece Farklı"]];

  return (
    <>
      <div className="results-summary">
        <span className="summary-total">{sonuclar.length} nesne bulundu</span>
        <span className="summary-equal">{esit} eşit</span>
        <span className="summary-diff">{farkli} farklı</span>
      </div>

      <div className="filter-bar">
        {filtreler.map(([v, t]) => (
          <button
            key={v}
            className={"filter-btn" + (filtre === v ? " active" : "")}
            onClick={() => setFiltre(v)}
          >
            {t}
          </button>
        ))}
      </div>

      <table className="results-table">
        <thead>
          <tr><th>Owner</th><th>Object Name</th><th>Type</th><th>Durum</th><th>Açıklama</th></tr>
        </thead>
        <tbody>
          {gorunen.map((r, i) => {
            const tiklanabilir = r.status !== "EQUAL";
            return (
              <tr
                key={i}
                className={tiklanabilir ? "row-clickable" : ""}
                onClick={tiklanabilir ? () => onRowClick(r) : undefined}
              >
                <td>{r.owner}</td>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>
                  <StatusBadge status={r.status} />
                  {tiklanabilir && <span className="detay-ipucu">detay için tıkla</span>}
                </td>
                <td>{r.explanation}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
