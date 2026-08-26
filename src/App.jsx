import { useState } from "react";
import { fetchCompareList } from "./api/compareApi";
import DbSelector from "./components/DbSelector";
import SearchForm from "./components/SearchForm";
import ResultsTable from "./components/ResultsTable";
import DiffModal from "./components/DiffModal";

// Ana uygulama: durumu (state) tutar, bileşenleri birbirine bağlar.
// - Arama girdileri + sonuç listesi burada.
// - Bir satıra tıklanınca detay penceresi (DiffModal) açılır.
export default function App() {
  // Arama girdileri
  const [db1, setDb1] = useState("TVSALPHA");
  const [db2, setDb2] = useState("TVSPATARA");
  const [owner, setOwner] = useState("IVP");
  const [objectName, setObjectName] = useState("IVPUTIL");
  const [type, setType] = useState("");

  // Sonuç durumu
  const [sonuclar, setSonuclar] = useState([]);
  const [durum, setDurum] = useState("empty");   // empty | loading | error | ready
  const [hata, setHata] = useState("");
  const [filtre, setFiltre] = useState("ALL");

  // Gösterilen listenin ait olduğu arama (detay için lazım)
  const [sonSorgu, setSonSorgu] = useState(null);
  // Açık detay penceresi ({ type, name }) ya da null
  const [secili, setSecili] = useState(null);

  // "Ara": istek burada başlıyor (api katmanını çağırıyoruz).
  async function handleAra(e) {
    e.preventDefault();
    const sorgu = { owner, objectName, db1, db2, type };
    setSonSorgu(sorgu);
    setDurum("loading");
    try {
      const data = await fetchCompareList(sorgu);
      setSonuclar(data);
      setFiltre("ALL");
      setDurum("ready");
    } catch (err) {
      setHata(err.message);
      setDurum("error");
    }
  }

  return (
    <div className="page">
      <div className="app-shell">
        <header className="app-header"><h1>Veritabanı Karşılaştırma Aracı</h1></header>
        <main className="app-content">
          <DbSelector db1={db1} db2={db2} setDb1={setDb1} setDb2={setDb2} />

          <SearchForm
            owner={owner} objectName={objectName} type={type}
            setOwner={setOwner} setObjectName={setObjectName} setType={setType}
            onSubmit={handleAra}
          />

          {durum === "empty" && (
            <div className="empty-box">Aramak için bir şema ve nesne adı girin.</div>
          )}
          {durum === "loading" && (
            <div className="loading-box"><span className="spinner"></span><span>Sorgu çalıştırılıyor...</span></div>
          )}
          {durum === "error" && (
            <div className="empty-box">İstek başarısız: {hata}</div>
          )}
          {durum === "ready" && (
            <ResultsTable
              sonuclar={sonuclar}
              filtre={filtre}
              setFiltre={setFiltre}
              onRowClick={(r) => setSecili({ type: r.type, name: r.name })}
            />
          )}
        </main>
      </div>

      {/* Detay penceresi: bir satır seçiliyse aç */}
      {secili && sonSorgu && (
        <DiffModal
          sorgu={{ owner: sonSorgu.owner, objectName: secili.name, db1: sonSorgu.db1, db2: sonSorgu.db2 }}
          type={secili.type}
          onClose={() => setSecili(null)}
        />
      )}
    </div>
  );
}
