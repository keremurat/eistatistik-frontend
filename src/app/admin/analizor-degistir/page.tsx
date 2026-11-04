"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { SystemDropdown } from "../../components/SystemDropdown";
import { useToast } from "../../components/ToastProvider";

const ICONS = {
  user: "M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z",
  transfer: "M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z",
  arrow: "M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z",
  orders: "M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z",
  warning: "M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z",
} as const;

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
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
  const toast = useToast();

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
  }

  function changeTarget(value: string) {
    setTargetId(value);
    setApproved(false);
  }

  function transferOrders() {
    if (!source || !target || !approved || source.activeOrders === 0) return;
    const transferred = source.activeOrders;
    setAnalysts((current) => current.map((item) => {
      if (item.id === source.id) return { ...item, activeOrders: 0 };
      if (item.id === target.id) return { ...item, activeOrders: item.activeOrders + transferred };
      return item;
    }));
    toast.success(`${transferred} aktif sipariş ${target.name} hesabına aktarıldı.`);
    setApproved(false);
  }

  const canTransfer = Boolean(source && target && approved && source.activeOrders > 0);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Sipariş Analizör Değiştir</h1>
            <p>Aktif siparişlerin tamamını bir analizörden diğerine aktarın.</p>
          </div>
        </header>

        <div className="stype-layout">
          <section className="stype-stack" aria-label="Analizör aktarım seçimleri">
            <article className="fav-card stype-section">
              <header><span className="fav-mark"><Icon name="user" /></span><h2>Kaynak analizör</h2></header>
              <label className="stype-field">
                <span>Siparişleri aktarılacak analizör</span>
                <SystemDropdown value={sourceId} onChange={changeSource} placeholder="Kaynak analizör seçin" ariaLabel="Kaynak analizör seçin" options={sourceOptions} />
                <small>Seçtiğiniz analizörün aktif siparişlerinin tamamı hedef analizöre aktarılır.</small>
              </label>
            </article>

            <article className={`fav-card stype-section${source ? "" : " xfer-waiting"}`}>
              <header><span className="fav-mark"><Icon name="transfer" /></span><h2>Hedef analizör</h2></header>
              <label className="stype-field">
                <span>Siparişlerin aktarılacağı analizör</span>
                <SystemDropdown value={targetId} onChange={changeTarget} placeholder={source ? "Hedef analizör seçin" : "Önce kaynak analizörü seçin"} ariaLabel="Hedef analizör seçin" options={targetOptions} disabled={!source} />
                <small>Kaynak analizör bu listede görünmez. Aynı kişi seçilemez.</small>
              </label>
            </article>
          </section>

          <aside className="fav-card xfer-summary" aria-label="Aktarım özeti">
            <header><span className="fav-mark"><Icon name="orders" /></span><h2>Aktarım özeti</h2></header>
            <div className="xfer-route">
              <div>
                <small>Kaynak</small>
                <strong>{source?.name ?? "Analizör seçilmedi"}</strong>
                {source && <span>{source.role}</span>}
              </div>
              <i><Icon name="arrow" size={16} /></i>
              <div>
                <small>Hedef</small>
                <strong>{target?.name ?? "Analizör seçilmedi"}</strong>
                {target && <span>{target.role}</span>}
              </div>
            </div>
            <dl className="xfer-counts">
              <div><dt>Aktarılacak sipariş</dt><dd>{source?.activeOrders ?? "—"}</dd></div>
              <div><dt>Hedef mevcut sipariş</dt><dd>{target?.activeOrders ?? "—"}</dd></div>
              <div className="total"><dt>Aktarım sonrası hedef</dt><dd>{source && target ? source.activeOrders + target.activeOrders : "—"}</dd></div>
            </dl>
            <div className="xfer-warning"><Icon name="warning" size={18} /><p>Bu işlem geri alınamaz. Aktif siparişler kalıcı olarak hedef analizöre aktarılır.</p></div>
            <label className={`xfer-approval${source && target ? " available" : ""}`}>
              <input type="checkbox" checked={approved} disabled={!source || !target || source.activeOrders === 0} onChange={(event) => setApproved(event.target.checked)} />
              <span>Aktarım bilgilerini kontrol ettim.</span>
            </label>
            <button type="button" className="fav-save" disabled={!canTransfer} onClick={transferOrders}>
              <Icon name="transfer" size={16} />
              {source ? `${source.activeOrders} siparişi aktar` : "Siparişleri aktar"}
            </button>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
