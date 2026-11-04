"use client";

import { FormEvent, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { DatePicker } from "../../components/DatePicker";
import { SystemDropdown } from "../../components/SystemDropdown";
import { useToast } from "../../components/ToastProvider";

const ICONS = {
  funnel: "M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.33A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM146.18,130.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,48H216Z",
  send: "M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0,.07L118.42,153l45.77-45.77a8,8,0,0,0-11.31-11.31L107.1,141.68,28.08,98.2l.07,0,.14,0L216,40Z",
} as const;

const ORDER_TYPES = [
  { value: "graphical-abstract", label: "Graphical Abstract" },
  { value: "kampanyali-power", label: "Kampanyalı Power Analizi" },
  { value: "kampanya-online", label: "Kampanya Online Danışmanlık" },
  { value: "veri-isleme", label: "Veri İşleme" },
  { value: "raporlama", label: "Raporlama" },
  { value: "online-mentorluk", label: "Online Mentörlük" },
  { value: "spss", label: "SPSS Analizi" },
  { value: "r-analizi", label: "R Analizi" },
  { value: "python-analizi", label: "Python Analizi" },
  { value: "olcek-gelistirme", label: "Ölçek Geliştirme" },
  { value: "regresyon", label: "Regresyon Analizi" },
  { value: "anket", label: "Anket Değerlendirme" },
];

const ORDER_STATUSES = [
  { value: "tumu", label: "Tümü" },
  { value: "siparis-verildi", label: "Sipariş Verildi" },
  { value: "ucret-belirlendi", label: "Ücret Belirlendi" },
  { value: "odeme-yapildi", label: "Ödeme Yapıldı" },
  { value: "yapiliyor", label: "Yapılıyor" },
  { value: "yapildi", label: "Yapıldı" },
  { value: "ek-ucret", label: "Ek Ücret Bekleniyor" },
  { value: "teslim", label: "Teslim Edildi" },
  { value: "iptal", label: "İptal" },
];

const MAIL_OPTIONS = [
  { value: "bildirilsin", label: "Bildirilsin" },
  { value: "bildirilmesin", label: "Bildirilmesin" },
];

const ORDERS = [
  { kod: "DS120325001", musteri: "Ebru Buket Erken", tur: "spss", durum: "teslim" },
  { kod: "DS120325002", musteri: "Ebru Buket Erken", tur: "anket", durum: "yapiliyor" },
  { kod: "DS050225001", musteri: "Mehmet Doğrul", tur: "r-analizi", durum: "teslim" },
  { kod: "DS221124001", musteri: "Ayça Ünal", tur: "python-analizi", durum: "teslim" },
  { kod: "DS221124002", musteri: "Ayça Ünal", tur: "raporlama", durum: "iptal" },
  { kod: "DS140924001", musteri: "Başak Sözüdoğru", tur: "olcek-gelistirme", durum: "teslim" },
  { kod: "DS280624001", musteri: "Emine Dilara Çolpak", tur: "regresyon", durum: "teslim" },
  { kod: "DS220424001", musteri: "Tuğçe Koç", tur: "spss", durum: "teslim" },
];

function Icon({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function todayStamp() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
}

export default function TopluMesajPage() {
  const toast = useToast();
  const [orderType, setOrderType] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [startDate, setStartDate] = useState(todayStamp);
  const [endDate, setEndDate] = useState(todayStamp);
  const [order, setOrder] = useState("");
  const [mail, setMail] = useState("bildirilsin");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => ORDERS.filter((item) => {
    if (orderType && item.tur !== orderType) return false;
    if (orderStatus && orderStatus !== "tumu" && item.durum !== orderStatus) return false;
    return true;
  }), [orderType, orderStatus]);

  const orderOptions = filtered.map((item) => ({ value: item.kod, label: `${item.kod} — ${item.musteri}` }));
  const typeLabel = ORDER_TYPES.find((item) => item.value === orderType)?.label ?? "Tümü";
  const statusLabel = ORDER_STATUSES.find((item) => item.value === orderStatus)?.label ?? "Tümü";
  const mailLabel = MAIL_OPTIONS.find((item) => item.value === mail)?.label ?? "Bildirilsin";
  const selectedOrder = orderOptions.find((item) => item.value === order)?.label ?? "Seçilmedi";

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) {
      setError("Mesaj alanı boş bırakılamaz.");
      return;
    }
    setError("");
    toast.success("Mesaj gönderim kuyruğuna alındı.");
  }

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Toplu Mesaj Gönder</h1>
            <p>Sipariş türü ve duruma göre kitle seçilir. Mesaj kuyruğa alınır.</p>
          </div>
        </header>

        <form className="stype-layout" onSubmit={send}>
          <section className="fav-card stype-section">
            <header><span className="fav-mark"><Icon name="funnel" /></span><h2>Hedef ve mesaj</h2></header>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Sipariş türü</span>
                <SystemDropdown value={orderType} onChange={(value) => { setOrderType(value); setOrder(""); }} placeholder="Sipariş türü seçiniz" ariaLabel="Sipariş türü" searchable searchPlaceholder="Tür ara…" options={ORDER_TYPES} />
              </label>
              <label className="stype-field">
                <span>Sipariş durumu</span>
                <SystemDropdown value={orderStatus} onChange={(value) => { setOrderStatus(value); setOrder(""); }} placeholder="Sipariş durumu seçiniz" ariaLabel="Sipariş durumu" options={ORDER_STATUSES} />
              </label>
            </div>
            <div className="stype-grid two">
              <label className="stype-field">
                <span>Başlangıç</span>
                <DatePicker id="tm-bas" value={startDate} onChange={setStartDate} />
              </label>
              <label className="stype-field">
                <span>Bitiş</span>
                <DatePicker id="tm-bit" value={endDate} onChange={setEndDate} />
              </label>
            </div>
            <label className="stype-field">
              <span>Siparişler</span>
              <SystemDropdown value={order} onChange={setOrder} placeholder="Sipariş seçiniz" ariaLabel="Sipariş" searchable searchPlaceholder="Sipariş ara…" options={orderOptions} />
              <small>{filtered.length} sipariş listeleniyor.</small>
            </label>
            <label className="stype-field">
              <span>Mail ile bilgilendirme</span>
              <SystemDropdown value={mail} onChange={setMail} ariaLabel="Mail ile bilgilendirme" options={MAIL_OPTIONS} />
            </label>
            <label className="stype-field">
              <span>Mesaj</span>
              <textarea value={message} onChange={(event) => { setMessage(event.target.value); setError(""); }} placeholder="Göndermek istediğiniz mesajı buraya yazın…" rows={5} />
            </label>
          </section>

          <aside className="fav-card acct-summary" aria-label="Gönderim özeti">
            <header><span className="fav-mark"><Icon name="send" /></span><h2>Gönderim özeti</h2></header>
            <span className={`acct-badge ${mail === "bildirilsin" ? "gelen" : ""}`}>{mailLabel}</span>
            <p className="acct-figure">{filtered.length}</p>
            <dl className="acct-rows">
              <div><dt>Sipariş türü</dt><dd>{typeLabel}</dd></div>
              <div><dt>Durum</dt><dd>{statusLabel}</dd></div>
              <div><dt>Tarih</dt><dd>{startDate} – {endDate}</dd></div>
              <div><dt>Sipariş</dt><dd className="wrap">{selectedOrder}</dd></div>
            </dl>
            {message.trim() && <p className="tm-bubble">{message.trim()}</p>}
            {error && <p className="acct-error" role="alert">{error}</p>}
            <button className="fav-save" type="submit" disabled={!message.trim()}>Gönder</button>
          </aside>
        </form>
      </div>
    </AdminShell>
  );
}
