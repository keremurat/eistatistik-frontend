"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "../AdminShell";
import { MessageTemplate, readMessageTemplates, templateSnippet } from "./messageTemplateData";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
    </svg>
  );
}

function Caret() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

function Envelope() {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
    </svg>
  );
}

export default function MesajSablonlariPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTemplates(readMessageTemplates()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return templates;
    return templates.filter((template) => `${template.title} ${template.body}`.toLocaleLowerCase("tr-TR").includes(needle));
  }, [query, templates]);

  return (
    <AdminShell>
      <div className="fav-page">
        <header className="fav-head">
          <div>
            <h1>Mesaj Şablonları <span>{templates.length}</span></h1>
            <p>Hazır mesajlar başlık ve içerikle durur. Bir satıra girince şablonun ayrıntısı açılır.</p>
          </div>
          <Link className="orders-create" href="/admin/mesaj-sablonlari/ekle"><PlusIcon />Yeni şablon</Link>
        </header>

        <section className="fav-card" aria-label="Mesaj şablonları listesi">
          <label className="fav-search">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık veya mesaj ara" aria-label="Mesaj şablonlarında ara" />
          </label>

          {visible.length === 0 ? (
            <div className="fav-empty">
              <strong>{templates.length === 0 ? "Henüz mesaj şablonu yok" : "Eşleşen şablon yok"}</strong>
              <p>{templates.length === 0 ? "İlk mesaj şablonunu oluşturun." : "Aramayı değiştirin ya da yeni bir şablon ekleyin."}</p>
            </div>
          ) : (
            <ul className="fav-list">
              {visible.map((template) => (
                <li key={template.id}>
                  <Link href={`/admin/mesaj-sablonlari/${template.id}`}>
                    <span className="fav-mark"><Envelope /></span>
                    <span className="fav-copy">
                      <strong>{template.title}</strong>
                      <small className="mtpl-snippet">{templateSnippet(template.body)}</small>
                    </span>
                    {/^\d+$/.test(template.id) && <span className="fav-count">#{template.id}</span>}
                    <Caret />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
