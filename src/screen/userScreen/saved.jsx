

import { useNavigate } from 'react-router-dom';
import DestinationCard, {
  POPULAR_DESTINATIONS,
} from '../../features/discovery/page/components/DestinationCard';

function Saved({ savedPlaces = [], onToggleSave = () => {} }) {
  const navigate = useNavigate();
  const places = POPULAR_DESTINATIONS.filter((place) =>
    savedPlaces.includes(place.id),
  );

  return (
    <div className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Your shortlist
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Saved places</h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep the places you love handy while you plan.
          </p>
        </header>
        {places.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => (
              <DestinationCard
                key={place.id}
                item={place}
                isSaved
                onToggleSave={onToggleSave}
                onAddToTrips={() =>
                  navigate('/trips', { state: { addDestination: place } })
                }
              />
            ))}
          </div>
        ) : (
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold">No saved places yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Save a destination from Home or Explore and it will show up here.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

export default Saved;