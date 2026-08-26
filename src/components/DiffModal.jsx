import { useState, useEffect } from "react";
import { fetchCompareDetail } from "../api/compareApi";
import DiffTable from "./DiffTable";
import DiffOptions from "./DiffOptions";

// Detay (diff) penceresi.
// - Açılınca ve kutucuklar değişince /api/detail'i çağırır (useEffect).
// - Renkli yan yana diff'i DiffTable'a çizdirir.
export default function DiffModal({ sorgu, type, onClose }) {
  const [diff, setDiff] = useState([]);
  const [durum, setDurum] = useState("loading");   // loading | error | ready
  const [hata, setHata] = useState("");
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  // İstek: pencere açılınca + type/kutucuklar değişince diff'i (yeniden) çek.
  useEffect(() => {
    let iptal = false;                 // pencere kapanırsa eski cevabı yut
    setDurum("loading");
    fetchCompareDetail({ ...sorgu, type, ignoreWhitespace: ignoreWs, ignoreCase })
      .then((data) => { if (!iptal) { setDiff(data); setDurum("ready"); } })
      .catch((err) => { if (!iptal) { setHata(err.message); setDurum("error"); } });
    return () => { iptal = true; };
  }, [sorgu, type, ignoreWs, ignoreCase]);

  // Esc ile kapat.
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Boş/boşluk satır farklarını saymadan "N satır farklı".
  const fark = diff.filter((d) => d.kind !== "EQUAL" && d.text.trim() !== "").length;

  // Bir tarafın tam metnini .sql olarak indir.
  // db1 metni = EQUAL + ONLY_IN_DB1 ; db2 metni = EQUAL + ONLY_IN_DB2
  function indir(taraf) {
    const kabul = taraf === "db1" ? ["EQUAL", "ONLY_IN_DB1"] : ["EQUAL", "ONLY_IN_DB2"];
    const metin = diff.filter((d) => kabul.includes(d.kind)).map((d) => d.text).join("\n");
    const dbAd = taraf === "db1" ? sorgu.db1 : sorgu.db2;
    const dosyaAd = (sorgu.owner + "." + sorgu.objectName + "." + type + "." + dbAd + ".sql")
      .replace(/[^\w.\-]+/g, "_");
    const blob = new Blob([metin], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = dosyaAd;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target.classList.contains("modal-overlay")) onClose(); }}
    >
      <div className="modal-box">
        <div className="modal-header">
          <h2>{sorgu.owner}.{sorgu.objectName} &nbsp;·&nbsp; {type}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-legend">
          <span className="lg">
            <span className="lg-box" style={{ background: "#e8f0fe", border: "1px solid #4a72b8" }}></span>
            {sorgu.db1} — yalnızca bu tarafta
          </span>
          <span className="lg">
            <span className="lg-box" style={{ background: "#fbefd6", border: "1px solid #c79328" }}></span>
            {sorgu.db2} — yalnızca bu tarafta
          </span>

          <DiffOptions
            ignoreWs={ignoreWs} setIgnoreWs={setIgnoreWs}
            ignoreCase={ignoreCase} setIgnoreCase={setIgnoreCase}
          />

          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
            {durum === "ready" && (
              <span style={{ fontWeight: 600, color: "var(--navy)" }}>{fark} satır farklı</span>
            )}
            {durum === "ready" && diff.length > 0 && (
              <button className="indir-btn" onClick={() => indir("db1")}>⬇ {sorgu.db1}</button>
            )}
            {durum === "ready" && diff.length > 0 && (
              <button className="indir-btn" onClick={() => indir("db2")}>⬇ {sorgu.db2}</button>
            )}
          </span>
        </div>

        <div className="modal-body">
          {durum === "loading" && (
            <div className="loading-box" style={{ padding: 24 }}>
              <span className="spinner"></span><span>Fark yükleniyor...</span>
            </div>
          )}
          {durum === "error" && (
            <div className="empty-box" style={{ margin: 20 }}>Detay alınamadı: {hata}</div>
          )}
          {durum === "ready" && <DiffTable diff={diff} />}
        </div>
      </div>
    </div>
  );
}
