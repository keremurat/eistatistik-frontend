export type CatalogFaculty = { id: number; name: string; departments: string[] };
export type CatalogUniversity = { id: number; name: string; city: string; kind: string; faculties: CatalogFaculty[] };

export function universityLogoUrl(id: number) {
  // YÖK Atlas bu ağdan doğrudan açılmıyor. Logo aynı kaynaktan, erişilen bir önbellek üzerinden geliyor.
  const source = `yokatlas.yok.gov.tr/api/universite-logo?universiteId=${id}`;
  return `https://images.weserv.nl/?url=${encodeURIComponent(source)}&w=64&h=64&fit=inside&we=1`;
}

export function loadUniversityCatalog() {
  return fetch("/data/university-catalog.json").then(async response => {
    if (!response.ok) throw new Error("Üniversite kataloğu yüklenemedi.");
    const data = await response.json() as { universities: CatalogUniversity[] };
    return data.universities;
  });
}
