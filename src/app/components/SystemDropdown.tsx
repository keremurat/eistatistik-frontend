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
};

export function SystemDropdown({ value, options, onChange, placeholder = "Seçin…", ariaLabel, className = "", disabled = false }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 200 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const selected = options.find((option) => option.value === value);

  function syncPosition() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }

  useEffect(() => {
    if (!open) return;
    syncPosition();
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
  }, [open]);

  return <div className={`cs-wrap system-dropdown ${className}`.trim()}>
    <button ref={triggerRef} type="button" className={`cs-trigger${open ? " open" : ""}`} aria-label={ariaLabel} aria-controls={panelId} aria-expanded={open} aria-haspopup="listbox" disabled={disabled} onClick={() => { syncPosition(); setOpen(current => !current); }}>
      <span className={selected ? undefined : "cs-placeholder"}>{selected?.label ?? placeholder}</span>
      <span className="cs-arrow" aria-hidden="true">▾</span>
    </button>
    {open && typeof document !== "undefined" && createPortal(<div ref={panelRef} id={panelId} className="cs-panel system-dropdown-panel" role="listbox" aria-label={ariaLabel} style={{ position: "fixed", top: position.top, left: position.left, width: position.width, zIndex: 9999 }}>
      {options.map(option => <button key={option.value} type="button" role="option" aria-selected={option.value === value} className={`cs-option${option.value === value ? " active" : ""}`} onClick={() => { onChange(option.value); setOpen(false); }}>{option.label}</button>)}
    </div>, document.body)}
  </div>;
}
