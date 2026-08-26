// İki veritabanı seçici (db1 / db2).
// "Kontrollü bileşen": değer ve değişim üstteki App'ten prop olarak gelir.
const DB_OPTIONS = ["TVSALPHA", "TVSPATARA"];

export default function DbSelector({ db1, db2, setDb1, setDb2 }) {
  return (
    <div className="db-selector">
      <div className="db-selector-item">
        <label>Veritabanı 1:</label>
        <select value={db1} onChange={(e) => setDb1(e.target.value)}>
          {DB_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className="db-selector-item">
        <label>Veritabanı 2:</label>
        <select value={db2} onChange={(e) => setDb2(e.target.value)}>
          {DB_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}
