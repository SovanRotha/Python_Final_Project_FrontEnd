import { searchPlacesInCountry, findCountry } from './wikipediaCountrySearch.js';
import {
  fetchWikimediaQuery,
  WIKIPEDIA_API_URL,
} from './wikimediaApi.js';
import {
  isEarthPlace,
  mapWikipediaPage,
} from './wikipediaPlaceMapper.js';

export async function searchWikipediaPlaces(query, signal, continuation) {
  const {
    countryName: continuedCountry,
    countrySearches,
    searchQuery,
    ...apiContinuation
  } = continuation || {};
  const country = await resolveCountry(query, continuedCountry, signal);

  if (country) {
    return searchCountryPlaces(country, countrySearches, signal);
  }

  return searchGeneralPlaces(query, searchQuery, apiContinuation, signal);
}

async function resolveCountry(query, currentCountry, signal) {
  if (currentCountry) return currentCountry;

  try {
    return await findCountry(query, signal);
  } catch (error) {
    console.warn(
      'Country detection is unavailable; searching place names instead:',
      error,
    );
    return null;
  }
}

async function searchCountryPlaces(country, searches, signal) {
  const result = await searchPlacesInCountry(country, signal, searches);
  const places = result.pages.map((page) => ({
    ...mapWikipediaPage(page, country.name),
    location: country.name,
  }));

  return {
    places,
    continuation: result.continuation.length
      ? { countryName: country, countrySearches: result.continuation }
      : null,
    countryName: country.name,
  };
}

async function searchGeneralPlaces(query, savedQuery, continuation, signal) {
  const searchQuery = savedQuery || query;
  const result = await fetchWikimediaQuery(
    WIKIPEDIA_API_URL,
    {
      generator: 'search',
      gsrsearch: searchQuery,
      gsrnamespace: '0',
      gsrlimit: '20',
      ...continuation,
    },
    signal,
  );
  const pages = Array.isArray(result.pages)
    ? result.pages.filter(isEarthPlace)
    : [];
  const places = pages
    .sort((left, right) => left.index - right.index)
    .map(mapWikipediaPage);

  return {
    places,
    continuation: result.continue
      ? { ...result.continue, searchQuery }
      : null,
    countryName: null,
  };
}

export async function getWikipediaPlaceById(pageId) {
  const result = await fetchWikimediaQuery(WIKIPEDIA_API_URL, {
    pageids: pageId,
  });
  const pages = Array.isArray(result.pages) ? result.pages : [];

  if (pages.length === 0 || !isEarthPlace(pages[0])) return null;

  return mapWikipediaPage(pages[0]);
}

export async function searchWikipediaDestinations(query = 'popular travel destinations', signal) {
  const result = await fetchWikimediaQuery(WIKIPEDIA_API_URL, {
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '0',
    gsrlimit: '30',
  }, signal);

  return (Array.isArray(result.pages) ? result.pages : [])
    .filter(isEarthPlace)
    .sort((left, right) => left.index - right.index)
    .map((page) => {
      const place = mapWikipediaPage(page);
      return {
        ...place,
        kind: 'destination',
        name: place.title,
        title: place.title,
        desc: place.desc,
        img: place.img,
        type: 'Destinations',
        location: place.category,
      };
    });
}

export async function enrichPlacesWithWikipedia(places, signal) {
  return Promise.all(
    places.map(async (place) => {
      const query = [place.name || place.title, place.location, place.address]
        .filter(Boolean)
        .join(' ');
      if (!query) return place;

      try {
        const result = await fetchWikimediaQuery(WIKIPEDIA_API_URL, {
          generator: 'search',
          gsrsearch: query,
          gsrnamespace: '0',
          gsrlimit: '8',
        }, signal);
        const targetName = (place.name || place.title || '')
          .toLocaleLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, ' ')
          .trim();
        const match = (Array.isArray(result.pages) ? result.pages : [])
          .filter(isEarthPlace)
          .map((page) => ({
            page,
            title: page.title.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim(),
          }))
          .sort((left, right) => {
            const leftExact = left.title === targetName ? 1 : 0;
            const rightExact = right.title === targetName ? 1 : 0;
            return rightExact - leftExact;
          })
          .find(({ title }) => title === targetName || title.includes(targetName) || targetName.includes(title));

        if (!match) return place;
        const wikiPlace = mapWikipediaPage(match.page, place.location);
        return {
          ...place,
          description: wikiPlace.desc || place.description,
          desc: wikiPlace.desc || place.desc || place.description,
          image: wikiPlace.img || place.image,
          img: wikiPlace.img || place.img || place.image,
          source: 'Wikipedia',
          sourceUrl: wikiPlace.sourceUrl,
        };
      } catch (error) {
        console.warn(`Could not enrich ${place.name || place.title} with Wikipedia data:`, error);
        return place;
      }
    }),
  );
}
