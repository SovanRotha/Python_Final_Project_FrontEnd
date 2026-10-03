import { estimateDailyTravelBudget } from './travelCostEstimate.js';

export function isEarthPlace(page) {
  return (
    page.ns === 0 &&
    Array.isArray(page.coordinates) &&
    page.coordinates.some(
      (coordinate) =>
        (!coordinate.globe || coordinate.globe === 'earth') &&
        coordinate.type !== 'event' &&
        coordinate.type !== 'astronomical object',
    )
  );
}

export function mapWikipediaPage(page) {
  const coordinate = page.coordinates?.find(
    (point) => !point.globe || point.globe === 'earth',
  );
  const placeType = coordinate?.type
    ? coordinate.type.charAt(0).toLocaleUpperCase() + coordinate.type.slice(1)
    : 'Place';

  return {
    id: `wiki-${page.pageid}`,
    title: page.title,
    desc:
      page.extract ||
      'Open the Wikipedia article to learn more about this place.',
    img: page.thumbnail?.source,
    avgCost: estimateDailyTravelBudget({
      title: page.title,
      desc: page.extract || '',
    }),
    tags: ['Wikipedia'],
    category: placeType,
    type: placeType,
    source: 'Wikipedia',
    sourceUrl: `https://en.wikipedia.org/?curid=${page.pageid}`,
  };
}
