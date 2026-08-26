// ============================================================
//  Diff GÖRÜNTÜLEME mantığı (renklendirme burada hazırlanır).
//  Backend'den gelen düz DiffLine listesini, YAN YANA tablo satırlarına çevirir.
//  React tarafı (DiffTable) sadece bu satırları map'leyip basar.
// ============================================================

// Bir satırı kelime + boşluk parçalarına bölüp, iki satırın ORTAK baş/son'unu
// dışarıda bırakır, ORTADAKİ farklı kısmı mark:true ile işaretler (satır içi diff).
// Dönen: [{text}, {text, mark:true}, {text}] gibi parça listesi.
function inlineDiff(mine, other) {
  const A = mine.match(/\s+|\S+/g) || [];
  const B = other.match(/\s+|\S+/g) || [];

  let p = 0; // baştan kaç parça ortak
  while (p < A.length && p < B.length && A[p] === B[p]) p++;

  let s = 0; // sondan kaç parça ortak
  while (s < A.length - p && s < B.length - p &&
         A[A.length - 1 - s] === B[B.length - 1 - s]) s++;

  const bas  = A.slice(0, p).join("");
  const orta = A.slice(p, A.length - s).join("");
  const son  = A.slice(A.length - s).join("");

  const segs = [];
  if (bas)  segs.push({ text: bas });
  if (orta) segs.push({ text: orta, mark: true });   // vurgulanacak farklı kısım
  if (son)  segs.push({ text: son });
  if (segs.length === 0) segs.push({ text: "" });
  return segs;
}

// Tek bir hücre (sol ya da sağ) için görüntü nesnesi üretir.
function cell(line, other, changed, side) {
  if (!line) return { no: "", cls: "cell-blank", segs: [{ text: "" }] };
  const bos = line.text.trim() === "";
  const cls = bos ? "cell-blank" : (side === "sol" ? "cell-db1" : "cell-db2");
  const segs = changed && !bos ? inlineDiff(line.text, other.text) : [{ text: line.text }];
  return { no: side === "sol" ? line.db1No : line.db2No, cls, segs };
}

// Ana fonksiyon: DiffLine listesi -> yan yana satır listesi.
// Ardışık ONLY_IN_DB1 (sol) ve ONLY_IN_DB2 (sağ) satırlarını tamponlayıp,
// EQUAL geldiğinde ya da sonda eşleştirerek "değişmiş satır" görünümü üretir.
export function buildRows(diff) {
  const rows = [];
  let solT = [];  // yalnızca db1'de (sol)
  let sagT = [];  // yalnızca db2'de (sağ)

  function bosalt() {
    const k = Math.max(solT.length, sagT.length);
    for (let i = 0; i < k; i++) {
      const r = solT[i];   // sol satır (varsa)
      const a = sagT[i];   // sağ satır (varsa)
      const changed = !!(r && a && r.text.trim() !== "" && a.text.trim() !== "");
      rows.push({
        left: cell(r, a, changed, "sol"),
        right: cell(a, r, changed, "sag"),
      });
    }
    solT = [];
    sagT = [];
  }

  diff.forEach((d) => {
    if (d.kind === "ONLY_IN_DB1") solT.push(d);
    else if (d.kind === "ONLY_IN_DB2") sagT.push(d);
    else {
      bosalt(); // EQUAL: önce biriken farkları bas
      rows.push({
        left:  { no: d.db1No, cls: "cell-equal", segs: [{ text: d.text }] },
        right: { no: d.db2No, cls: "cell-equal", segs: [{ text: d.text }] },
      });
    }
  });
  bosalt(); // sonda kalanları bas

  return rows;
}
