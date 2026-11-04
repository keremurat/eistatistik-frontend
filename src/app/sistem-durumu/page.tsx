import { connection } from "next/server";
import { ApiStatus, getApiStatus } from "@/lib/api/status";

type StatusResult =
  | { ok: true; response: ApiStatus }
  | { ok: false; message: string };

async function loadApiStatus(): Promise<StatusResult> {
  try {
    return { ok: true, response: await getApiStatus() };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Bilinmeyen bağlantı hatası",
    };
  }
}

export default async function SystemStatusPage() {
  await connection();
  const result = await loadApiStatus();

  if (result.ok) {
    const { data } = result.response;

    return (
      <main className="st-page">
        <header className="orders-hero">
          <h1>Sistem durumu</h1>
        </header>
        <section className="detail-panel" aria-labelledby="api-status-title">
          <p className="eyebrow">RAILS API</p>
          <h2 id="api-status-title">Backend bağlantısı çalışıyor</h2>
          <dl className="overview-facts">
            <div><dt>Servis</dt><dd>{data.service}</dd></div>
            <div><dt>Durum</dt><dd>{data.status}</dd></div>
          </dl>
        </section>
      </main>
    );
  }

  return (
    <main className="st-page">
      <header className="orders-hero">
        <h1>Sistem durumu</h1>
      </header>
      <section className="detail-panel" aria-labelledby="api-error-title">
        <p className="eyebrow">BAĞLANTI HATASI</p>
        <h2 id="api-error-title">Backend bağlantısı kurulamadı</h2>
        <p>{result.message}</p>
      </section>
    </main>
  );
}
