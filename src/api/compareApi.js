// ============================================================
//  BACKEND İLE TÜM HABERLEŞME BURADA — "istek olayları" tek yerde.
//  Bileşenler (component) fetch bilmez; sadece bu fonksiyonları çağırır.


// Ortak yardımcı: verilen yola query string ekleyip GET atar,
// hata olursa fırlatır, başarılıysa JSON'u nesneye çevirip döndürür.
async function getJson(path, params) {
  const qs = new URLSearchParams(params).toString();     // {a:1,b:2} -> "a=1&b=2"
  const res = await fetch(path + "?" + qs);              // 1) isteği at, cevabı bekle
  if (!res.ok) throw new Error("HTTP " + res.status);    //    hata kontrolü
  return res.json();                                     // 2) JSON metnini JS nesnesine çevir
}

// LİSTE: nesne düzeyi karşılaştırma  ->  List<CompareResult>
// Dönen her eleman: { owner, name, type, status, explanation }
export function fetchCompareList({ owner, objectName, db1, db2, type }) {
  const params = { owner, objectName, db1, db2 };
  if (type) params.type = type;          // type OPSİYONEL: sadece doluysa ekle
  return getJson("/api/compare", params);
}

// DETAY: tek nesnenin satır satır diff'i  ->  List<DiffLine>
// Dönen her eleman: { kind, db1No, db2No, text }
// kind: "EQUAL" | "ONLY_IN_DB1" | "ONLY_IN_DB2"
export function fetchCompareDetail({ owner, objectName, db1, db2, type, ignoreWhitespace, ignoreCase }) {
  return getJson("/api/detail", {
    owner, objectName, db1, db2, type,
    ignoreWhitespace: ignoreWhitespace ? 1 : 0,   // checkbox durumu -> backend (1/0)
    ignoreCase:       ignoreCase ? 1 : 0,
  });
}
