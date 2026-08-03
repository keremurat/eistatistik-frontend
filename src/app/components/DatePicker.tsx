"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const MONTHS = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
const DAYS   = ["Pt","Sa","Ça","Pe","Cu","Ct","Pz"];

export type DatePickerProps = {
  id?: string;
  value: string;        // DD.MM.YYYY
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
};

export function DatePicker({ id, value, onChange, required, placeholder = "GG.AA.YYYY" }: DatePickerProps) {
  const today    = new Date();
  const [open,   setOpen]  = useState(false);
  const [pos,    setPos]   = useState({ top: 0, left: 0 });
  const [view,   setView]  = useState({ year: today.getFullYear(), month: today.getMonth() });
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (inputRef.current?.contains(e.target as Node)) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown",   onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown",   onKey);
    };
  }, [open]);

  function openCalendar() {
    if (!inputRef.current) return;
    const r       = inputRef.current.getBoundingClientRect();
    const PANEL_H = 290;
    const top     = window.innerHeight - r.bottom - 8 < PANEL_H ? r.top - PANEL_H - 4 : r.bottom + 6;
    setPos({ top, left: r.left });
    if (value) {
      const parts = value.split(".");
      if (parts.length === 3) {
        const y = parseInt(parts[2]);
        const m = parseInt(parts[1]) - 1;
        if (!isNaN(y) && !isNaN(m)) setView({ year: y, month: m });
      }
    }
    setOpen((o) => !o);
  }

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstDow    = new Date(view.year, view.month, 1).getDay();
  const startOffset = (firstDow + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function parsedSelected() {
    if (!value) return null;
    const p = value.split(".");
    if (p.length !== 3) return null;
    return { day: parseInt(p[0]), month: parseInt(p[1]) - 1, year: parseInt(p[2]) };
  }

  const sel = parsedSelected();

  function isToday(day: number) {
    return today.getDate() === day && today.getMonth() === view.month && today.getFullYear() === view.year;
  }
  function isSelected(day: number) {
    return !!sel && sel.day === day && sel.month === view.month && sel.year === view.year;
  }

  function select(day: number) {
    const m = String(view.month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${d}.${m}.${view.year}`);
    setOpen(false);
  }

  function prevMonth() { setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }); }
  function nextMonth() { setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }); }

  const calendarPanel = (
    <div ref={panelRef} className="dc-panel"
      style={{ position: "fixed", top: pos.top, left: pos.left, width: 272, zIndex: 9999 }}
      role="dialog" aria-label="Takvim">
      <div className="dc-nav">
        <button className="dc-nav-btn" type="button" onClick={prevMonth} aria-label="Önceki ay">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <span className="dc-nav-label">{MONTHS[view.month]} {view.year}</span>
        <button className="dc-nav-btn" type="button" onClick={nextMonth} aria-label="Sonraki ay">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
      <div className="dc-grid">
        {DAYS.map((d) => <span key={d} className="dc-dow">{d}</span>)}
        {cells.map((day, i) =>
          day === null
            ? <button key={`e-${i}`} type="button" className="dc-cell" disabled aria-hidden="true" />
            : <button key={day} type="button"
                className={`dc-cell${isToday(day) ? " today" : ""}${isSelected(day) ? " selected" : ""}`}
                onClick={() => select(day)}
                aria-label={`${day} ${MONTHS[view.month]} ${view.year}`}
                aria-pressed={isSelected(day)}>
                {day}
              </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <input
        ref={inputRef}
        id={id}
        readOnly
        value={value}
        placeholder={placeholder}
        onClick={openCalendar}
        className={`dc-input${value ? " has-value" : ""}`}
        aria-required={required}
        aria-haspopup="dialog"
        aria-expanded={open}
      />
      {open && typeof document !== "undefined" && createPortal(calendarPanel, document.body)}
    </>
  );
}
