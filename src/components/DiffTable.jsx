import { buildRows } from "../utils/diffView";

// Bir diff hücresi: parçaları basar, mark:true olanları vurgu sınıfıyla sarar.
// markClass sol için "mark-db1" (mavi), sağ için "mark-db2" (kehribar).
function DiffCell({ data, markClass }) {
  return (
    <td className={data.cls}>
      {data.segs.map((seg, i) =>
        seg.mark
          ? <span key={i} className={markClass}>{seg.text}</span>
          : <span key={i}>{seg.text}</span>
      )}
    </td>
  );
}

// Yan yana diff tablosu. Renklendirme mantığı utils/diffView.js'te hazırlanıyor;
// burada sadece satırları map'leyip basıyoruz (React auto-escape yaptığı için esc() yok).
export default function DiffTable({ diff }) {
  const rows = buildRows(diff);
  return (
    <table className="diff-table">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td className="diff-num">{row.left.no}</td>
            <DiffCell data={row.left} markClass="mark-db1" />
            <td className="diff-sep"></td>
            <td className="diff-num">{row.right.no}</td>
            <DiffCell data={row.right} markClass="mark-db2" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
