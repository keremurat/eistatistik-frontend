"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { SystemDropdown } from "../../components/SystemDropdown";

type IconName = "user" | "transfer" | "arrow" | "orders" | "warning" | "check";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    transfer: <><path d="M17 3l4 4-4 4" /><path d="M3 7h18" /><path d="m7 21-4-4 4-4" /><path d="M21 17H3" /></>,
    arrow: <><path d="M12 5v14" /><path d="m17 14-5 5-5-5" /></>,
    orders: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
    warning: <><path d="M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type Analyst = { id: string; name: string; role: string; activeOrders: number };

const initialAnalysts: Analyst[] = [
  { id: "general", name: "eistatistik Genel Analizör", role: "Genel analizör", activeOrders: 31 },
  { id: "naci", name: "Naci Murat", role: "Kıdemli analizör", activeOrders: 18 },
  { id: "rabia", name: "Rabia Aktaş", role: "Analizör", activeOrders: 16 },
  { id: "fatih", name: "Fatih Akar", role: "Analizör", activeOrders: 12 },
  { id: "alihsan", name: "Aliihsan Şükür", role: "Analizör", activeOrders: 9 },
  { id: "ertugrul", name: "Ertuğrul Gümüşsu", role: "Analizör", activeOrders: 8 },
  { id: "mehmet", name: "Mehmet Meşe", role: "Analizör", activeOrders: 7 },
  { id: "esra", name: "Esra Öztürk", role: "Analizör", activeOrders: 5 },
  { id: "emre", name: "Emre Dünder", role: "Analizör", activeOrders: 4 },
  { id: "gizem", name: "Gizem Şahin", role: "Analizör", activeOrders: 3 },
];

export default function AnalizorDegistirPage() {
  const [analysts, setAnalysts] = useState(initialAnalysts);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [approved, setApproved] = useState(false);
  const [message, setMessage] = useState("");

  const source = analysts.find((item) => item.id === sourceId);
  const target = analysts.find((item) => item.id === targetId);
  const sourceOptions = useMemo(() => analysts.map((item) => ({
    value: item.id,
    label: `${item.name} · ${item.activeOrders} aktif sipariş`,
  })), [analysts]);
  const targetOptions = useMemo(() => analysts.filter((item) => item.id !== sourceId).map((item) => ({
    value: item.id,
    label: `${item.name} · ${item.activeOrders} aktif sipariş`,
  })), [analysts, sourceId]);

  function changeSource(value: string) {
    setSourceId(value);
    if (targetId === value) setTargetId("");
    setApproved(false);
    setMessage("");
  }

  function changeTarget(value: string) {
    setTargetId(value);
    setApproved(false);
    setMessage("");
  }

  function transferOrders() {
    if (!source || !target || !approved || source.activeOrders === 0) return;
    const transferred = source.activeOrders;
    setAnalysts((current) => current.map((item) => {
      if (item.id === source.id) return { ...item, activeOrders: 0 };
      if (item.id === target.id) return { ...item, activeOrders: item.activeOrders + transferred };
      return item;
    }));
    setMessage(`${transferred} aktif sipariş ${target.name} hesabına aktarıldı.`);
    setApproved(false);
  }

  const canTransfer = Boolean(source && target && approved && source.activeOrders > 0);

  return <AdminShell>
    <main className="orders-page analyst-transfer-page">
      <header className="orders-hero"><h1>Analizör değiştir</h1></header>

      {message && <div className="analyst-transfer-success" role="status"><Icon name="check" size={16} /><span>{message}</span></div>}

      <div className="analyst-transfer-layout">
        <section className="analyst-transfer-form" aria-label="Analizör aktarım seçimleri">
          <article className="detail-panel analyst-transfer-panel">
            <header>
              <span className="analyst-transfer-icon"><Icon name="user" size={16} /></span>
              <div><small>1. ADIM</small><h2>Kaynak analizör</h2></div>
              <b>1</b>
            </header>
            <div className="analyst-transfer-panel-body">
              <label>Siparişleri aktarılacak analizör</label>
              <SystemDropdown value={sourceId} onChange={changeSource} placeholder="Kaynak analizör seçin" ariaLabel="Kaynak analizör seçin" options={sourceOptions} />
              <p>Seçtiğiniz analizörün aktif siparişlerinin tamamı hedef analizöre aktarılır.</p>
            </div>
          </article>

          <article className={`detail-panel analyst-transfer-panel target${source ? " ready" : ""}`}>
            <header>
              <span className="analyst-transfer-icon"><Icon name="transfer" size={16} /></span>
              <div><small>2. ADIM</small><h2>Hedef analizör</h2></div>
              <b>2</b>
            </header>
            <div className="analyst-transfer-panel-body">
              <label>Siparişlerin aktarılacağı analizör</label>
              <SystemDropdown value={targetId} onChange={changeTarget} placeholder={source ? "Hedef analizör seçin" : "Önce kaynak analizörü seçin"} ariaLabel="Hedef analizör seçin" options={targetOptions} disabled={!source} />
              <p>Kaynak analizör hedef listesinde gösterilmez; aynı kişi seçilemez.</p>
            </div>
          </article>
        </section>

        <aside className="detail-panel analyst-transfer-summary" aria-label="Aktarım özeti">
          <header><span><Icon name="orders" size={16} /></span><h2>Aktarım özeti</h2></header>

          <div className="analyst-transfer-route">
            <div><small>KAYNAK</small><strong>{source?.name ?? "Analizör seçilmedi"}</strong>{source && <span>{source.role}</span>}</div>
            <i><Icon name="arrow" size={17} /></i>
            <div><small>HEDEF</small><strong>{target?.name ?? "Analizör seçilmedi"}</strong>{target && <span>{target.role}</span>}</div>
          </div>

          <dl className="analyst-transfer-counts">
            <div><dt>Aktarılacak sipariş</dt><dd>{source?.activeOrders ?? "—"}</dd></div>
            <div><dt>Hedef mevcut sipariş</dt><dd>{target?.activeOrders ?? "—"}</dd></div>
            <div className="total"><dt>Aktarım sonrası hedef</dt><dd>{source && target ? source.activeOrders + target.activeOrders : "—"}</dd></div>
          </dl>

          <div className="analyst-transfer-warning"><Icon name="warning" size={17} /><p>Bu işlem geri alınamaz. Aktif siparişler kalıcı olarak hedef analizöre aktarılır.</p></div>

          <label className={`analyst-transfer-approval${source && target ? " available" : ""}`}>
            <input type="checkbox" checked={approved} disabled={!source || !target || source.activeOrders === 0} onChange={(event) => setApproved(event.target.checked)} />
            <span>Aktarım bilgilerini kontrol ettim.</span>
          </label>

          <button type="button" className="analyst-transfer-submit" disabled={!canTransfer} onClick={transferOrders}>
            <Icon name="transfer" size={16} />
            {source ? `${source.activeOrders} siparişi aktar` : "Siparişleri aktar"}
          </button>
        </aside>
      </div>
    </main>
  </AdminShell>;
}
