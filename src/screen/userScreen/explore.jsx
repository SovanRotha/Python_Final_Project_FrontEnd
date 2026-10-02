

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DestinationCard, {
  POPULAR_DESTINATIONS,
} from '../../features/discovery/page/components/DestinationCard';

function Explore({ savedPlaces = [], onToggleSave = () => {} }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const places = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return POPULAR_DESTINATIONS;

    return POPULAR_DESTINATIONS.filter((place) =>
      `${place.title} ${place.desc} ${place.tags.join(' ')}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Find your next stop
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Explore destinations</h1>
          <p className="mt-2 text-sm text-slate-500">
            Search popular places, compare daily costs, and save your favorites.
          </p>
        </header>
        <label className="block max-w-xl">
          <span className="sr-only">Search destinations</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by place, activity, or tag..."
          />
        </label>
        {places.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => (
              <DestinationCard
                key={place.id}
                item={place}
                isSaved={savedPlaces.includes(place.id)}
                onToggleSave={onToggleSave}
                onBuildItinerary={() => navigate('/trips')}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
            No destinations match “{query}”. Try another search.
          </p>
        )}
      </div>
    </div>
  );
}

export default Explore;