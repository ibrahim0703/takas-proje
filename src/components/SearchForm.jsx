// Arama formu: owner / objectName / type girdileri + Ara butonu.
// Girdi değerleri App'te tutuluyor; buraya prop olarak geliyor (tek yönlü veri akışı).
export default function SearchForm({
  owner, objectName, type,
  setOwner, setObjectName, setType,
  onSubmit,
}) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <input placeholder="Owner (şema)" value={owner} onChange={(e) => setOwner(e.target.value)} />
      <input placeholder="Object Name" value={objectName} onChange={(e) => setObjectName(e.target.value)} />
      <input placeholder="Type (opsiyonel)" value={type} onChange={(e) => setType(e.target.value)} />
      <button type="submit">Ara</button>
    </form>
  );
}
