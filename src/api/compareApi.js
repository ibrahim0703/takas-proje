// ============================================================
//  BACKEND İLE TÜM HABERLEŞME BURADA — "istek olayları" tek yerde.
// ============================================================

async function getJson(path, params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(path + "?" + qs);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

// OWNER LİSTESİ: dropdown'ı doldurmak için -> List<String>
export function fetchOwners({ db1, db2 }) {
  return getJson("/api/owners", { db1, db2 });
}

// LİSTE: nesne düzeyi karşılaştırma (SAYFALI).
//   objectName OPSİYONEL -> boşsa gönderme (owner'ın tüm nesneleri).
//   type       OPSİYONEL -> boşsa gönderme.
//   page                 -> kaçıncı sayfa (0,1,2,...); "daha fazla"da artar.
// Dönen: { results:[...], page, size, total, hasMore }
export function fetchCompareList({ owner, objectName, db1, db2, type, page }) {
  const params = { owner, db1, db2 };
  if (objectName) params.objectName = objectName;   // opsiyonel: doluysa ekle
  if (type) params.type = type;                     // opsiyonel: doluysa ekle
  if (page != null) params.page = page;             // sayfa numarası
  return getJson("/api/compare", params);
}

// DETAY: tek nesnenin satır satır diff'i -> List<DiffLine>
// kind: "EQUAL" | "ONLY_IN_DB1" | "ONLY_IN_DB2"
export function fetchCompareDetail({ owner, objectName, db1, db2, type, ignoreWhitespace, ignoreCase }) {
  return getJson("/api/detail", {
    owner, objectName, db1, db2, type,
    ignoreWhitespace: ignoreWhitespace ? 1 : 0,
    ignoreCase:       ignoreCase ? 1 : 0,
  });
}