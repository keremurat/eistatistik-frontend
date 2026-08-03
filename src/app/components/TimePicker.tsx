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
    const top = window.innerHeight - r.bottom - 8 < PANEL_H
      ? r.top - PANEL_H - 4
      : r.bottom + 6;
    setPos({ top, left: r.left });
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
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: PANEL_W,
        zIndex: 9999,
        background: "#fff",
        border: "1px solid var(--line)",
        borderRadius: 13,
        boxShadow: "0 18px 45px rgba(19,43,70,.18)",
        padding: ".55rem",
        animation: "profile-menu-in .15s ease-out",
        overflow: "hidden",
      }}>

      {/* Sütun başlıkları */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1px 1fr",
        marginBottom: ".4rem",
      }}>
        <p style={{
          margin: 0, textAlign: "center",
          fontSize: ".63rem", fontWeight: 850,
          color: "var(--navy)", letterSpacing: "-.01em",
        }}>Saat</p>
        <span style={{ background: "var(--line)" }} />
        <p style={{
          margin: 0, textAlign: "center",
          fontSize: ".63rem", fontWeight: 850,
          color: "var(--navy)", letterSpacing: "-.01em",
        }}>Dakika</p>
      </div>

      {/* Ayraç */}
      <div style={{ height: 1, background: "var(--line)", margin: "0 -.55rem .4rem" }} />

      {/* İki sütun */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", height: 178 }}>
        {/* Saat sütunu */}
        <div
          ref={hourRef}
          style={{ overflowY: "auto", paddingRight: 2, scrollbarWidth: "none" }}>
          {HOURS.map((h) => {
            const active = h === selH;
            return (
              <button
                key={h}
                data-v={h}
                type="button"
                onClick={() => pickH(h)}
                style={{
                  width: "100%",
                  padding: ".36rem 0",
                  border: 0,
                  borderRadius: 6,
                  background: active ? "var(--navy)" : "transparent",
                  color: active ? "#fff" : "#3f556a",
                  font: "inherit",
                  fontSize: ".7rem",
                  fontWeight: active ? 800 : 700,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: ".1s",
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--canvas)"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                aria-pressed={active}>
                {h}
              </button>
            );
          })}
        </div>

        {/* Dikey ayraç */}
        <span style={{ background: "var(--line)" }} />

        {/* Dakika sütunu */}
        <div
          ref={minRef}
          style={{ overflowY: "auto", paddingLeft: 2, scrollbarWidth: "none" }}>
          {MINUTES.map((m) => {
            const active = m === selM;
            return (
              <button
                key={m}
                data-v={m}
                type="button"
                onClick={() => pickM(m)}
                style={{
                  width: "100%",
                  padding: ".36rem 0",
                  border: 0,
                  borderRadius: 6,
                  background: active ? "var(--navy)" : "transparent",
                  color: active ? "#fff" : "#3f556a",
                  font: "inherit",
                  fontSize: ".7rem",
                  fontWeight: active ? 800 : 700,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: ".1s",
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--canvas)"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                aria-pressed={active}>
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alt: seçili saat göstergesi */}
      <div style={{
        marginTop: ".4rem",
        paddingTop: ".4rem",
        borderTop: "1px solid var(--line)",
        textAlign: "center",
        fontSize: ".8rem",
        fontWeight: 850,
        color: "var(--navy)",
        letterSpacing: ".04em",
        fontVariantNumeric: "tabular-nums",
      }}>
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
        aria-expanded={open}
      />
      {open && typeof document !== "undefined" && createPortal(panel, document.body)}
    </>
  );
}
