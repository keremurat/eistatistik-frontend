export type ApiStatus = {
  data: {
    service: string;
    status: "ok";
  };
};

export async function getApiStatus(): Promise<ApiStatus> {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3001";
  const response = await fetch(`${apiBaseUrl}/api/v1/status`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Rails API durum isteği başarısız oldu: ${response.status}`);
  }

  return response.json() as Promise<ApiStatus>;
}
