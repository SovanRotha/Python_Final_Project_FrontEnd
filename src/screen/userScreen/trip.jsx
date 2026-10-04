import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TripPlanningPanel from '../../features/trips/components/TripPlanningPanel';
import accommodationApi from '../../services/api/accommodation_api.js';
import checklistApi from '../../services/api/check_list_api.js';
import checklistItemApi from '../../services/api/check_list_item_api.js';
import packingApi from '../../services/api/packing_api.js';
import packingListApi from '../../services/api/packing_list_api.js';
import transportApi from '../../services/api/transport_api.js';
import {
  getTrips,
  createTrip,
  deleteTrip,
} from '../../services/api/tripService';

function Trip() {
  const navigate = useNavigate();
  const location = useLocation();
  const loadTask = useRef(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tripResources, setTripResources] = useState({
    accommodations: [],
    checklists: [],
    checklistItems: [],
    packingItems: [],
    packingLists: [],
    transports: [],
    errors: {},
  });
  const [isLoadingResources, setIsLoadingResources] = useState(true);

  // Modal State for Adding a New Trip
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    dailyCost: '',
  });

  const loadTripResources = useCallback(async () => {
    const results = await Promise.allSettled([
      accommodationApi.list(),
      checklistApi.list(),
      checklistItemApi.list(),
      packingApi.list(),
      packingListApi.list(),
      transportApi.list(),
    ]);
    const keys = [
      'accommodations',
      'checklists',
      'checklistItems',
      'packingItems',
      'packingLists',
      'transports',
    ];
    const nextResources = {
      accommodations: [],
      checklists: [],
      checklistItems: [],
      packingItems: [],
      packingLists: [],
      transports: [],
      errors: {},
    };

    results.forEach((result, index) => {
      const key = keys[index];
      if (result.status === 'fulfilled') {
        nextResources[key] = result.value;
      } else {
        console.error(`Could not load trip ${key}:`, result.reason);
        nextResources.errors[key] =
          result.reason instanceof Error
            ? result.reason.message
            : `Could not load ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
      }
    });

    setTripResources(nextResources);
    setIsLoadingResources(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadTripResources);
  }, [loadTripResources]);

  const reloadTripResources = useCallback(async () => {
    setIsLoadingResources(true);
    await loadTripResources();
  }, [loadTripResources]);

  useEffect(() => {
    const destination = location.state?.addDestination;
    let task = loadTask.current;

    if (!task || task.locationKey !== location.key) {
      task = {
        locationKey: location.key,
        promise: (async () => {
          const existingTrips = await getTrips(50);
          if (!destination) return { existingTrips, newTrip: null };

          const destinationId = String(destination.id);
          const matchingTrip = existingTrips.find(
            (trip) => String(trip.destinationId) === destinationId,
          );
          if (matchingTrip) {
            return { existingTrips, newTrip: matchingTrip };
          }

          const title = destination.title || destination.name || 'New destination';
          const description =
            destination.desc ||
            destination.description ||
            'Destination selected from Explore.';
          const dailyCost =
            destination.avgCost ||
            destination.dailyCost ||
            destination.estimatedCost ||
            'Not available';
          const newTrip = await createTrip({
            name: title,
            title,
            description,
            desc: description,
            destinationId,
            location: destination.location || '',
            category: destination.category || destination.type || '',
            tags: Array.isArray(destination.tags) ? destination.tags : [],
            dailyCost,
            sourceUrl: destination.sourceUrl || '',
            image: destination.img || destination.image || destination.imageUrl || '',
            imageUrl: destination.img || destination.image || destination.imageUrl || '',
          });
          return { existingTrips, newTrip };
        })(),
      };
      loadTask.current = task;
    }

    let isActive = true;
    task.promise
      .then(({ existingTrips, newTrip }) => {
        if (!isActive) return;

        if (destination && !newTrip) {
          setActionError('Could not add this place to My Trips. Please try again.');
        } else {
          setTrips(
            newTrip
              ? [newTrip, ...existingTrips.filter((trip) => trip.id !== newTrip.id)]
              : existingTrips,
          );
        }
        setIsLoading(false);

        if (destination) {
          navigate(location.pathname, { replace: true, state: null });
        }
      })
      .catch((error) => {
        if (!isActive) return;
        console.error('Could not load trips:', error);
        setActionError('Could not load trips. Please try again.');
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [location.key, location.pathname, location.state, navigate]);

  // Handle Create Trip Form Submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setActionError('');
    const newTrip = await createTrip({
      name: formData.name,
      title: formData.name,
      description: formData.description,
      desc: formData.description,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      image: formData.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      dailyCost: formData.dailyCost || '$50/day',
      tags: ['Trip', 'Custom'],
    });

    if (!newTrip) {
      setActionError('Could not save this trip. Check browser storage and try again.');
      setIsSubmitting(false);
      return;
    }

    setTrips((prev) => [newTrip, ...prev]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', imageUrl: '', dailyCost: '' });
  };

  // Handle Delete Trip
  const handleDelete = async (tripId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    const deleted = await deleteTrip(tripId);
    if (deleted) {
      setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
    } else {
      setActionError('Could not delete this trip. Please try again.');
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Your travel plans
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">My trips</h1>
            <p className="mt-1 text-sm text-slate-500">
              Keep your destinations, budget, and travel ideas together.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800"
          >
            + Create New Trip
          </button>
        </header>

        {actionError && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {actionError}
          </p>
        )}

        {Object.entries(tripResources.errors).length > 0 && (
          <div
            className="space-y-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"
            role="status"
          >
            <p className="font-semibold">
              Some trip details could not be loaded:
            </p>
            {Object.entries(tripResources.errors).map(([key, message]) => (
              <p key={key}>{message}</p>
            ))}
            <button
              className="mt-1 font-semibold underline underline-offset-2"
              onClick={() => void reloadTripResources()}
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content Area */}
        {isLoading ? (
          /* Skeleton Loaders */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="h-64 animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>
        ) : trips.length > 0 ? (
          /* Trips Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {trips.map((trip) => {
              const title = trip.title || trip.name || 'Untitled Trip';
              const desc = trip.desc || trip.description || 'No description added yet.';
              const tags = Array.isArray(trip.tags) ? trip.tags : [];
              const image =
                trip.image ||
                trip.imageUrl ||
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
              const cost = trip.dailyCost || trip.estimatedCost || '$50/day';

              return (
                <div
                  key={trip.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Image Cover */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover transition transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      Active Trip
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      title="Delete Trip"
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/50 text-white backdrop-blur-md transition hover:bg-rose-600"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    {(trip.location || trip.category) && (
                      <p className="text-xs font-semibold text-teal-700">
                        {[trip.location, trip.category].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 line-clamp-2">{desc}</p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs font-bold text-teal-700">{cost}</span>
                      <button
                        onClick={() => navigate('/explore')}
                        className="text-xs font-bold text-slate-700 hover:text-teal-700"
                      >
                        Explore Places →
                      </button>
                    </div>
                    <TripPlanningPanel
                      key={trip.id}
                      onReload={reloadTripResources}
                      resources={tripResources}
                      trip={trip}
                    />
                    {isLoadingResources && (
                      <p className="mt-2 text-xs text-slate-400">
                        Loading trip details…
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl">
              ✈
            </div>
            <h2 className="mt-4 text-lg font-bold">Your next trip starts here</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You do not have any trips planned yet. Explore a destination or create a new trip to start collecting ideas.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link
                className="inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
                to="/explore"
              >
                Explore destinations
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                + Custom Trip
              </button>
            </div>
          </section>
        )}

      </div>

      {/* Modal: Create Trip */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Plan a New Trip</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Trip Destination / Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Siem Reap Getaway"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notes on itinerary, sights, or goals..."
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daily Budget Estimate
                </label>
                <input
                  type="text"
                  value={formData.dailyCost}
                  onChange={(e) => setFormData({ ...formData, dailyCost: e.target.value })}
                  placeholder="$50/day"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-teal-700/20 hover:bg-teal-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trip;