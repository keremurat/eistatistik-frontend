"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

const PANEL_H = 244;
const PANEL_W = 180;

export type TimePickerProps = {
  id?: string;
  value: string;      // "HH:MM"
  onChange: (v: string) => void;
  placeholder?: string;
};

export function TimePicker({ id, value, onChange, placeholder = "SS:DD" }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hourRef  = useRef<HTMLDivElement>(null);
  const minRef   = useRef<HTMLDivElement>(null);

  const parts = value ? value.split(":") : [];
  const selH  = parts[0] ?? "";
  const selM  = parts[1] ?? "";

  // Dışarı tıklama / Escape + seçili değeri scroll'a getir
  useEffect(() => {
    if (!open) return;

    // Panel render edildikten sonra seçili değeri ortala
    requestAnimationFrame(() => {
      const hEl = hourRef.current?.querySelector<HTMLElement>(`[data-v="${selH}"]`);
      hEl?.scrollIntoView({ block: "center", behavior: "instant" });
      const mEl = minRef.current?.querySelector<HTMLElement>(`[data-v="${selM}"]`);
      mEl?.scrollIntoView({ block: "center", behavior: "instant" });
    });

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
  }, [open, selH, selM]);

  function openPanel() {
    if (!inputRef.current) return;
    const r   = inputRef.current.getBoundingClientRect();
    const pad = 8;
    const top = window.innerHeight - r.bottom - pad < PANEL_H
      ? r.top - PANEL_H - 4
      : r.bottom + 6;
    // Paneli viewport içinde tut: sağ/sol kenardan taşmasın.
    const maxLeft = Math.max(pad, window.innerWidth - PANEL_W - pad);
    const left = Math.min(Math.max(pad, r.left), maxLeft);
    setPos({ top, left });
    setOpen((o) => !o);
  }

  function pickH(h: string) { onChange(`${h}:${selM || "00"}`); }
  function pickM(m: string) { onChange(`${selH || "00"}:${m}`); }

  // ── Panel ──────────────────────────────────────────────────────────────────
  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Saat seçici"
      className="time-picker-panel"
      style={{ top: pos.top, left: pos.left }}>

      {/* Sütun başlıkları */}
      <div className="time-picker-head">
        <p>Saat</p>
        <span />
        <p>Dakika</p>
      </div>

      {/* Ayraç */}
      <div className="time-picker-rule" />

      {/* İki sütun */}
      <div className="time-picker-columns">
        {/* Saat sütunu */}
        <div
          ref={hourRef}
          className="time-picker-list time-picker-hours">
          {HOURS.map((h) => {
            const active = h === selH;
            return (
              <button
                key={h}
                data-v={h}
                type="button"
                onClick={() => pickH(h)}
                className={`time-picker-option${active ? " active" : ""}`}
                aria-pressed={active}>
                {h}
              </button>
            );
          })}
        </div>

        {/* Dikey ayraç */}
        <span className="time-picker-divider" />

        {/* Dakika sütunu */}
        <div
          ref={minRef}
          className="time-picker-list time-picker-minutes">
          {MINUTES.map((m) => {
            const active = m === selM;
            return (
              <button
                key={m}
                data-v={m}
                type="button"
                onClick={() => pickM(m)}
                className={`time-picker-option${active ? " active" : ""}`}
                aria-pressed={active}>
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alt: seçili saat göstergesi */}
      <div className="time-picker-value">
        {selH || "00"}:{selM || "00"}
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
        onClick={openPanel}
        className={`dc-input${value ? " has-value" : ""}`}
        aria-haspopup="dialog"
      />
      {open && typeof document !== "undefined" && createPortal(panel, document.body)}
    </>
  );
}
