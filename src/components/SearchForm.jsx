// Arama formu: owner (dropdown, zorunlu) / objectName (opsiyonel) / type (opsiyonel) + Ara.
// owner listesi backend'den (/api/owners) gelir, prop olarak buraya iner.
export default function SearchForm({
  owner, objectName, type, owners,
  setOwner, setObjectName, setType,
  onSubmit,
}) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <select value={owner} onChange={(e) => setOwner(e.target.value)}>
        {owners.length === 0 && <option value="">Owner yükleniyor...</option>}
        {owners.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <input placeholder="Object Name (opsiyonel)" value={objectName} onChange={(e) => setObjectName(e.target.value)} />
      <input placeholder="Type (opsiyonel)" value={type} onChange={(e) => setType(e.target.value)} />
      <button type="submit">Ara</button>
    </form>
  );
}