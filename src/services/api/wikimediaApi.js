export const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
export const WIKIMEDIA_COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php';
export const WIKIDATA_API_URL = 'https://www.wikidata.org/w/api.php';

export async function fetchWikimediaQuery(apiUrl, params, signal) {
  const searchParams = new URLSearchParams({
    action: 'query',
    prop: 'coordinates|pageimages|extracts',
    coprop: 'type|globe',
    piprop: 'thumbnail',
    pithumbsize: '900',
    exintro: '1',
    explaintext: '1',
    format: 'json',
    formatversion: '2',
    origin: '*',
    ...params,
  });
  const response = await fetch(`${apiUrl}?${searchParams}`, { signal });

  if (!response.ok) {
    throw new Error(`Wikimedia search failed (HTTP ${response.status}).`);
  }

  const data = await response.json();
  return data.query || {};
}
