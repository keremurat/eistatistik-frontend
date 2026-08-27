"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type SystemDropdownOption = { value: string; label: string };

type Props = {
  value: string;
  options: SystemDropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function SystemDropdown({ value, options, onChange, placeholder = "Seçin…", ariaLabel, className = "", disabled = false, searchable = false, searchPlaceholder = "Ara…" }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState({ up: false, top: 0, bottom: 0, left: 0, width: 200 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const selected = options.find((option) => option.value === value);

  const shown = searchable && search.trim()
    ? options.filter((option) => option.label.toLocaleLowerCase("tr").includes(search.trim().toLocaleLowerCase("tr")))
    : options;

  function syncPosition() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Aşağıda yeterli yer yoksa (ve yukarıda daha çok yer varsa) paneli yukarı doğru aç.
    const count = Math.max(1, searchable && search.trim() ? shown.length : options.length);
    const estimated = Math.min((searchable ? 44 : 8) + count * 34 + 8, 300);
    const spaceBelow = window.innerHeight - rect.bottom;
    const up = spaceBelow < estimated + 8 && rect.top > spaceBelow;
    setPosition({ up, top: rect.bottom + 4, bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width });
  }

  useEffect(() => {
    if (!open) return;
    syncPosition();
    if (searchable) searchRef.current?.focus();
    function closeOutside(event: MouseEvent) {
      const node = event.target as Node;
      if (!triggerRef.current?.contains(node) && !panelRef.current?.contains(node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", syncPosition);
    window.addEventListener("scroll", syncPosition, true);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", syncPosition);
      window.removeEventListener("scroll", syncPosition, true);
    };
  }, [open, searchable]);

  return <div className={`cs-wrap system-dropdown ${className}`.trim()}>
    <button ref={triggerRef} type="button" className={`cs-trigger${open ? " open" : ""}`} aria-label={ariaLabel} aria-controls={panelId} aria-expanded={open} aria-haspopup="listbox" disabled={disabled} onClick={() => { syncPosition(); if (!open) setSearch(""); setOpen(current => !current); }}>
      <span className={selected ? undefined : "cs-placeholder"}>{selected?.label ?? placeholder}</span>
      <span className="cs-arrow" aria-hidden="true">▾</span>
    </button>
    {open && typeof document !== "undefined" && createPortal(<div ref={panelRef} id={panelId} className={`cs-panel system-dropdown-panel${position.up ? " open-up" : ""}`} role="listbox" aria-label={ariaLabel} style={{ position: "fixed", left: position.left, width: position.width, zIndex: 9999, ...(position.up ? { bottom: position.bottom } : { top: position.top }) }}>
      {searchable && (
        <input ref={searchRef} className="cs-search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={searchPlaceholder} aria-label="Seçeneklerde ara" />
      )}
      {searchable && <div style={{ maxHeight: 220, overflowY: "auto" }}>
        {shown.map(option => <button key={option.value} type="button" role="option" aria-selected={option.value === value} className={`cs-option${option.value === value ? " active" : ""}`} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button>)}
        {shown.length === 0 && <p style={{ padding: ".5rem .6rem", margin: 0, color: "var(--muted)", fontSize: ".68rem" }}>Sonuç bulunamadı</p>}
      </div>}
      {!searchable && options.map(option => <button key={option.value} type="button" role="option" aria-selected={option.value === value} className={`cs-option${option.value === value ? " active" : ""}`} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button>)}
    </div>, document.body)}
  </div>;
}
