import { POPULAR_DESTINATIONS } from './components/DestinationCard';

export function withFallbackDestinations(apiDestinations) {
  if (!Array.isArray(apiDestinations) || apiDestinations.length === 0) {
    return POPULAR_DESTINATIONS;
  }

  if (apiDestinations.length >= POPULAR_DESTINATIONS.length) {
    return apiDestinations;
  }

  const apiIds = new Set(apiDestinations.map((destination) => String(destination.id)));
  const fallbackDestinations = POPULAR_DESTINATIONS.filter(
    (destination) => !apiIds.has(String(destination.id)),
  );

  return [
    ...apiDestinations,
    ...fallbackDestinations.slice(0, POPULAR_DESTINATIONS.length - apiDestinations.length),
  ];
}
