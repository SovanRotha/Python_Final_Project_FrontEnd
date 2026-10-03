import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  POPULAR_DESTINATIONS,
  RECOMMENDED_PLACES,
} from './components/DestinationCard';
import {
  getDestinationById,
  getRecommendedPlaces,
} from '../../../services/api/destinationservices';
import { getWikipediaPlaceById } from '../../../services/api/wikipediaPlaces';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80';

export default function PlacePage({
  savedPlaces = [],
  onToggleSave = () => {},
  canSavePlaces = false,
  savingPlaceIds = [],
}) {
  const { placeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const routeDestination = location.state?.destination;
  const hasRouteDestination =
    routeDestination && String(routeDestination.id) === placeId;
  const [loadedPlace, setLoadedPlace] = useState(null);
  const fetchedDestination =
    loadedPlace?.placeId === placeId ? loadedPlace.destination : null;
  const isLoading = !hasRouteDestination && loadedPlace?.placeId !== placeId;

  useEffect(() => {
    if (hasRouteDestination) {
      return undefined;
    }

    let isMounted = true;

    async function loadDestination() {
      if (placeId.startsWith('wiki-')) {
        const wikipediaPlace = await getWikipediaPlaceById(
          placeId.slice('wiki-'.length),
        );
        if (isMounted) {
          setLoadedPlace({ placeId, destination: wikipediaPlace });
        }
        return;
      }

      const destination = await getDestinationById(placeId);
      if (!isMounted) return;

      if (destination) {
        setLoadedPlace({ placeId, destination });
        return;
      }

      const places = await getRecommendedPlaces();
      if (!isMounted) return;

      const localPlace = [
        ...(Array.isArray(places) ? places : []),
        ...POPULAR_DESTINATIONS,
        ...RECOMMENDED_PLACES,
      ].find((place) => String(place.id) === placeId);
      setLoadedPlace({ placeId, destination: localPlace || null });
    }

    loadDestination();

    return () => {
      isMounted = false;
    };
  }, [hasRouteDestination, placeId]);

  const destination = hasRouteDestination ? routeDestination : fetchedDestination;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
        <div className="mx-auto h-96 max-w-4xl animate-pulse rounded-3xl bg-slate-200" />
      </div>
    );
  }

  if (!destination) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">Place not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            This place may no longer be available. Explore destinations to find another.
          </p>
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="mt-6 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
          >
            Back to Explore
          </button>
        </div>
      </main>
    );
  }

  const title = destination.title || destination.name || 'Place details';
  const description =
    destination.desc || destination.description || 'No description available.';
  const image =
    destination.image ||
    destination.imageUrl ||
    destination.img ||
    FALLBACK_IMAGE;
  const tags = Array.isArray(destination.tags) ? destination.tags : [];
  const cost =
    destination.dailyCost ||
    destination.estimatedCost ||
    destination.avgCost ||
    'Not available';
  const isSaved = savedPlaces.some(
    (savedId) => String(savedId) === String(destination.id),
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-800 sm:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          ← Back
        </button>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative min-h-64 overflow-hidden bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 px-6 py-12 text-white sm:min-h-96 sm:px-10 sm:py-16">
            <img
              src={image}
              alt=""
              aria-hidden="true"
              onError={(event) => {
                if (event.currentTarget.src !== FALLBACK_IMAGE) {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="relative z-10 flex min-h-40 flex-col justify-end sm:min-h-64">
            {destination.category && (
              <p className="text-xs font-bold uppercase tracking-widest text-teal-200">
                {destination.category}
              </p>
            )}
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h1>
            </div>
          </div>

          {destination.sourceUrl && (
            <p className="text-xs text-slate-500">
              Place information from{' '}
              <a
                href={destination.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-teal-700 underline"
              >
                Wikipedia
              </a>
              .
            </p>
          )}
          <div className="space-y-6 p-6 sm:p-8">
            {(destination.location || destination.category || tags.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {destination.location && (
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {destination.location}
                  </span>
                )}
                {destination.category && (
                  <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                    {destination.category}
                  </span>
                )}
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                About this place
              </h2>
              <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
            </section>

            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  {destination.avgCost
                    ? 'Rough travel budget'
                    : 'Estimated daily cost'}
                </p>
                <p className="mt-1 font-bold text-slate-800">{cost}</p>
                {destination.avgCost && (
                  <p className="mt-1 text-xs text-slate-500">
                    Approximate per-person estimate; excludes flights and varies by season.
                  </p>
                )}
              </div>
              {destination.rating && (
                <div>
                  <p className="text-xs font-medium text-slate-400">Rating</p>
                  <p className="mt-1 font-bold text-slate-800">
                    ★ {destination.rating}
                    {destination.reviews ? ` (${destination.reviews})` : ''}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              {destination.kind === 'place' && canSavePlaces && (
              <button
                type="button"
                onClick={() => onToggleSave(destination.id)}
                disabled={savingPlaceIds.some(
                  (savingId) => String(savingId) === String(destination.id),
                )}
                className={`rounded-2xl border px-6 py-3 text-sm font-bold transition ${
                  isSaved
                    ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isSaved ? '♥ Saved' : '♡ Save Place'}
              </button>
              )}
              <button
                type="button"
                onClick={() =>
                  navigate('/trips', {
                    state: { addDestination: destination },
                  })
                }
                className="rounded-2xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800"
              >
                Add to My Trips →
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}