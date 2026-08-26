// Detay penceresindeki iki kutucuk.
// Durum DiffModal'da tutulur; buraya değer + değiştirici prop olarak gelir.
// Değişince DiffModal diff'i yeni bayraklarla YENİDEN çeker (useEffect ile).
export default function DiffOptions({ ignoreWs, setIgnoreWs, ignoreCase, setIgnoreCase }) {
  return (
    <>
      <label className="lg" style={{ cursor: "pointer" }}>
        <input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} />
        {" "}Boşlukları yok say
      </label>
      <label className="lg" style={{ cursor: "pointer" }}>
        <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} />
        {" "}Büyük/küçük harf duyarsız
      </label>
    </>
  );
}
