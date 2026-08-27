import { useState, useEffect } from "react";
import { fetchCompareList, fetchOwners } from "./api/compareApi";
import DbSelector from "./components/DbSelector";
import SearchForm from "./components/SearchForm";
import ResultsTable from "./components/ResultsTable";
import Pagination from "./components/Pagination";
import DiffModal from "./components/DiffModal";

const SIZE = 50;   // sayfa başına nesne (backend default'u ile aynı)

export default function App() {
  // Arama girdileri
  const [db1, setDb1] = useState("TVSALPHA");
  const [db2, setDb2] = useState("TVSPATARA");
  const [owner, setOwner] = useState("");
  const [objectName, setObjectName] = useState("");
  const [type, setType] = useState("");
  const [owners, setOwners] = useState([]);

  // Sonuç durumu
  const [sonuclar, setSonuclar] = useState([]);
  const [durum, setDurum] = useState("empty");   // empty | loading | error | ready
  const [hata, setHata] = useState("");
  const [filtre, setFiltre] = useState("ALL");

  // Sayfalama durumu
  const [page, setPage] = useState(0);           // içeride 0-tabanlı
  const [hasMore, setHasMore] = useState(false);
  const [toplam, setToplam] = useState(0);
  const [gecis, setGecis] = useState(false);     // sayfa geçişi yükleniyor mu

  // Detay için
  const [sonSorgu, setSonSorgu] = useState(null);
  const [secili, setSecili] = useState(null);

  // Açılışta owner listesini çek, ilkini seç.
  useEffect(() => {
    fetchOwners({ db1, db2 })
      .then((list) => { setOwners(list); if (list.length) setOwner((m) => m || list[0]); })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Belirli bir sayfayı getirir; sonuçları HER ZAMAN değiştirir (ok'lu gezinme).
  async function ara(yeniPage, sorgu) {
    setGecis(true);
    try {
      const data = await fetchCompareList({ ...sorgu, page: yeniPage });
      setSonuclar(data.results);
      setHasMore(data.hasMore);
      setToplam(data.total);
      setPage(yeniPage);
      setDurum("ready");
    } catch (err) {
      setHata(err.message);
      setDurum("error");
    } finally {
      setGecis(false);
    }
  }

  function handleAra(e) {
    e.preventDefault();
    const sorgu = { owner, objectName, db1, db2, type };
    setSonSorgu(sorgu);
    setFiltre("ALL");
    setDurum("loading");   // ilk aramada tam spinner (tablo henüz yok)
    ara(0, sorgu);         // her yeni aramada 1. sayfadan başla
  }

  return (
    <div className="page">
      <div className="app-shell">
        <header className="app-header"><h1>Veritabanı Karşılaştırma Aracı</h1></header>
        <main className="app-content">
          <DbSelector db1={db1} db2={db2} setDb1={setDb1} setDb2={setDb2} />

          <SearchForm
            owner={owner} objectName={objectName} type={type} owners={owners}
            setOwner={setOwner} setObjectName={setObjectName} setType={setType}
            onSubmit={handleAra}
          />

          {durum === "empty" && (
            <div className="empty-box">Bir owner (şema) seçin, Ara'ya basın. Nesne adı opsiyonel.</div>
          )}
          {durum === "loading" && (
            <div className="loading-box"><span className="spinner"></span><span>Sorgu çalıştırılıyor...</span></div>
          )}
          {durum === "error" && (
            <div className="empty-box">İstek başarısız: {hata}</div>
          )}
          {durum === "ready" && (
            <>
              <ResultsTable
                sonuclar={sonuclar}
                filtre={filtre}
                setFiltre={setFiltre}
                onRowClick={(r) => setSecili({ type: r.type, name: r.name })}
              />
              <Pagination
                page={page}
                size={SIZE}
                toplam={toplam}
                hasMore={hasMore}
                gecis={gecis}
                onPrev={() => ara(page - 1, sonSorgu)}
                onNext={() => ara(page + 1, sonSorgu)}
              />
            </>
          )}
        </main>
      </div>

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