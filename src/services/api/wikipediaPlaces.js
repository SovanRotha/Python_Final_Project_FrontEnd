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
      const name = place.name || place.title || '';
      if (!name) return place;
      const queries = [
        name,
        [name, place.location, place.address].filter(Boolean).join(' '),
      ].filter((query, index, all) => query && all.indexOf(query) === index);

      try {
        const targetName = name
          .toLocaleLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, ' ')
          .trim();
        let match = null;
        for (const query of queries) {
          const result = await fetchWikimediaQuery(WIKIPEDIA_API_URL, {
            generator: 'search',
            gsrsearch: query,
            gsrnamespace: '0',
            gsrlimit: '8',
          }, signal);
          match = (Array.isArray(result.pages) ? result.pages : [])
            .filter(isEarthPlace)
            .map((page) => ({
              page,
              title: page.title.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim(),
            }))
            .filter(({ title }) => title === targetName || title.includes(targetName))
            .sort((left, right) => {
              const exactDifference = Number(right.title === targetName) - Number(left.title === targetName);
              if (exactDifference) return exactDifference;
              return Number(Boolean(right.page.thumbnail?.source)) - Number(Boolean(left.page.thumbnail?.source));
            })[0] || null;
          if (match) break;
        }

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
