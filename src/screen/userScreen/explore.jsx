import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DestinationCard from '../../features/discovery/page/components/DestinationCard';
import { getDestinations } from '../../services/api/destinationservices';
import { searchWikipediaPlaces } from '../../services/api/wikipediaPlaces';

const CATEGORIES = ['All', 'Popular', 'Beach', 'Culture', 'Budget Friendly'];
const DEFAULT_DISCOVERY_QUERY = 'tourist attractions around the world';

function normalizeDestination(item) {
  const cost = Number(
    item.average_daily_cost ?? item.averageDailyCost ?? item.dailyCost,
  );
  const image = item.img || item.image || item.imageUrl;

  return {
    ...item,
    id: String(item.id ?? item.destination_id ?? item.name),
    title: item.title || item.name || 'Untitled destination',
    desc: item.desc || item.description || '',
    img: image,
    avgCost:
      Number.isFinite(cost) && cost > 0
        ? `$${Math.round(cost)}/day avg`
        : item.avgCost || '',
    location:
      item.location ||
      [item.city, item.country].filter(Boolean).join(', '),
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

function getApiItems(response) {
  if (Array.isArray(response)) return response;
  if (!response || response.error) return null;

  const items =
    response.destinations ||
    response.results ||
    response.items ||
    response.data;
  return Array.isArray(items) ? items : null;
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ');
}

function matchesCategory(place, category) {
  if (category === 'All') return true;

  const tags = (Array.isArray(place.tags) ? place.tags : []).map(normalizeText);
  const description = normalizeText(
    `${place.category || ''} ${place.type || ''} ${place.title || ''} ${place.desc || ''}`,
  );

  if (category === 'Popular') {
    return (
      place.isPopular === true ||
      place.is_popular === true ||
      place.popular === true ||
      tags.includes('popular')
    );
  }

  if (category === 'Budget Friendly') {
    const cost = Number(
      place.average_daily_cost ?? place.averageDailyCost ?? place.dailyCost,
    );
    return (
      place.isBudgetFriendly === true ||
      place.is_budget_friendly === true ||
      tags.some((tag) =>
        ['budget', 'budget friendly', 'low cost', 'affordable'].includes(tag),
      ) ||
      (Number.isFinite(cost) && cost > 0 && cost <= 100)
    );
  }

  const normalizedCategory = normalizeText(category);
  return (
    tags.includes(normalizedCategory) ||
    description.includes(normalizedCategory)
  );
}

function Explore({ savedPlaces = [], onToggleSave = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch =
    new URLSearchParams(location.search).get('search')?.trim() || '';
  const [query, setQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [destinations, setDestinations] = useState([]);
  const [dataSource, setDataSource] = useState('backend');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [onlineContinuation, setOnlineContinuation] = useState(null);
  const [onlineCountryName, setOnlineCountryName] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDestinations() {
      const response = await getDestinations(50);
      const items = getApiItems(response);

      if (!isMounted) return;

      if (items) {
        setDestinations(items.map(normalizeDestination));
        setDataSource('backend');
        setLoadError('');
        setIsLoading(false);
        return;
      }

      setDataSource('wikipedia');
      setLoadError(
        'The destination API is unavailable, so live Wikipedia places are shown instead.',
      );
      try {
        const result = await searchWikipediaPlaces(
          initialSearch || DEFAULT_DISCOVERY_QUERY,
        );
        if (isMounted) {
          setDestinations(result.places);
          setOnlineContinuation(result.continuation);
          setOnlineCountryName(result.countryName);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            `Could not load destinations from the API or Wikipedia: ${
              error instanceof Error ? error.message : 'Unknown error.'
            }`,
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadDestinations();
    return () => {
      isMounted = false;
    };
  }, [initialSearch]);

  async function searchLivePlaces(searchTerm) {
    setIsSearching(true);
    setDataSource('wikipedia');
    setLoadError('');
    try {
      const result = await searchWikipediaPlaces(searchTerm);
      setDestinations(result.places);
      setOnlineContinuation(result.continuation);
      setOnlineCountryName(result.countryName);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'Live place search failed.',
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) return;
    await searchLivePlaces(searchTerm);
  }

  async function handleLoadMore() {
    if (!onlineContinuation || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const result = await searchWikipediaPlaces(
        query.trim() || initialSearch || DEFAULT_DISCOVERY_QUERY,
        undefined,
        onlineContinuation,
      );
      setDestinations((currentPlaces) => {
        const existingIds = new Set(currentPlaces.map((place) => place.id));
        return [
          ...currentPlaces,
          ...result.places.filter((place) => !existingIds.has(place.id)),
        ];
      });
      setOnlineContinuation(result.continuation);
      setOnlineCountryName(result.countryName);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'Could not load more places.',
      );
    } finally {
      setIsLoadingMore(false);
    }
  }

  const filteredPlaces = useMemo(() => {
    const searchText = dataSource === 'backend' ? query.trim().toLowerCase() : '';
    return destinations.filter((place) => {
      const searchableText = [
        place.title,
        place.desc,
        place.location,
        place.country,
        ...(Array.isArray(place.tags) ? place.tags : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        searchableText.includes(searchText) &&
        matchesCategory(place, selectedCategory)
      );
    });
  }, [dataSource, destinations, query, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-slate-800 sm:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 p-8 text-white shadow-xl sm:p-12">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-block rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300 backdrop-blur-md">
              TripOS Discovery
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Explore Destinations
            </h1>
            <p className="text-sm text-teal-100/80 sm:text-base">
              Discover destinations from the live API or search real places from Wikipedia.
            </p>
          </div>
        </header>

        <section className="space-y-4" aria-label="Search and filter destinations">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-3xl flex-col gap-2 sm:flex-row"
            >
              <input
                aria-label="Search places"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a place or country..."
                className="w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10"
              />
              <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="rounded-2xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSearching ? 'Searching…' : 'Search live places'}
              </button>
            </form>

            <div className="text-xs font-semibold text-slate-500">
              Showing <span className="text-teal-700">{filteredPlaces.length}</span>{' '}
              {dataSource === 'wikipedia' ? 'live places' : 'destinations'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {loadError && (
          <div
            role="status"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            {loadError}
          </div>
        )}

        {onlineCountryName && dataSource === 'wikipedia' && (
          <h2 className="text-lg font-bold text-slate-800">
            Live places in {onlineCountryName}
          </h2>
        )}

        {isLoading || isSearching ? (
          <div
            role="status"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-3xl bg-slate-200/60"
              />
            ))}
          </div>
        ) : filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map((place) => (
              <div key={place.id} className="space-y-2">
                <DestinationCard
                  item={place}
                  isSaved={savedPlaces.includes(place.id)}
                  onToggleSave={onToggleSave}
                  onAddToTrips={() =>
                    navigate('/trips', { state: { addDestination: place } })
                  }
                  onClick={() =>
                    navigate(`/places/${encodeURIComponent(String(place.id))}`, {
                      state: { destination: place },
                    })
                  }
                />
                {place.sourceUrl && (
                  <a
                    href={place.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-teal-700 underline"
                  >
                    Source
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-base font-semibold text-slate-700">
              No places found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or select a different category.
            </p>
          </div>
        )}

        {dataSource === 'wikipedia' && onlineContinuation && !isLoading && (
          <div className="flex justify-center">
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={handleLoadMore}
              className="rounded-xl border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:bg-teal-50 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoadingMore ? 'Loading more places…' : 'Load more places'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
