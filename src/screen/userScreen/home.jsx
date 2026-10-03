import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDestinations,
  getRecommendedPlaces,
} from '../../services/api/destinationservices';
import DestinationCard, { 
  PlaceCard, 
  IconSearch,
  IconCalendar,
  IconUsers,
  IconArrowRight,
  IconSparkles,
  IconChevronRight
} from '../../features/discovery/page/components/DestinationCard';

function getApiItems(response, key) {
  if (Array.isArray(response)) return response;
  const items =
    response?.[key] ||
    response?.results ||
    response?.items ||
    response?.data;
  return Array.isArray(items) ? items : null;
}

function normalizePlace(item, destinationById = new Map()) {
  const cost = Number(item.average_daily_cost ?? item.averageDailyCost ?? item.dailyCost);
  const destination = destinationById.get(String(item.destination_id));
  return {
    ...item,
    id: String(item.id ?? item.destination_id ?? item.name),
    title: item.title || item.name || 'Untitled destination',
    desc: item.desc || item.description || '',
    img:
      item.img ||
      item.image ||
      item.imageUrl ||
      item.image_path ||
      destination?.image,
    avgCost: Number.isFinite(cost) && cost > 0
      ? `$${Math.round(cost)}/day avg`
      : item.avgCost || '',
    location:
      item.location ||
      [item.city, item.country || destination?.country]
        .filter(Boolean)
        .join(', '),
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

export default function Home({ savedPlaces = [], onToggleSave = () => {} }) {
  const navigate = useNavigate();
  const popularDestinationsRef = useRef(null);
  const popularDestinationsGroupRef = useRef(null);
  const popularDestinationsTrackRef = useRef(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Data & Loading States
  const [destinations, setDestinations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
  const [destinationsLoadError, setDestinationsLoadError] = useState('');
  const [placesLoadError, setPlacesLoadError] = useState('');
  const [catalogReloadKey, setCatalogReloadKey] = useState(0);
  
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoadingDestinations(true);
      setIsLoadingPlaces(true);
      setDestinationsLoadError('');
      setPlacesLoadError('');

      const [destinationsResponse, placesResponse] = await Promise.all([
        getDestinations(100),
        getRecommendedPlaces(3),
      ]);

      if (cancelled) return;

      const apiDestinations = getApiItems(destinationsResponse, 'destinations');
      const apiPlaces = getApiItems(placesResponse, 'places');
      const destinationById = new Map(
        (apiDestinations || []).map((destination) => [
          String(destination.id),
          destination,
        ]),
      );

      if (apiDestinations) {
        setDestinations(
          apiDestinations.map((destination) => normalizePlace(destination)),
        );
      } else {
        setDestinations([]);
        setDestinationsLoadError(
          `Could not load destinations: ${destinationsResponse?.error || 'The API returned an invalid response.'}`,
        );
      }
      if (apiPlaces) {
        setRecommendations(
          apiPlaces.map((place) => normalizePlace(place, destinationById)),
        );
      } else {
        setRecommendations([]);
        setPlacesLoadError(
          `Could not load places: ${placesResponse?.error || 'The API returned an invalid response.'}`,
        );
      }
      setIsLoadingDestinations(false);
      setIsLoadingPlaces(false);
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [catalogReloadKey]);
  const safeSavedPlaces = Array.isArray(savedPlaces) ? savedPlaces : [];
  const isSaved = (id) => safeSavedPlaces.includes(id);

  const toggleSave = (id) => {
    onToggleSave(id);
  };

  const openDestinationSearch = () => {
    const query = searchQuery.trim();
    navigate(query ? `/explore?search=${encodeURIComponent(query)}` : '/explore');
  };

  const filteredDestinations = destinations.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || item.type?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const seekPopularDestinations = (toEnd) => {
    const carousel = popularDestinationsRef.current;
    const group = popularDestinationsGroupRef.current;
    const animation = popularDestinationsTrackRef.current
      ?.getAnimations()
      .find((item) => item.playState !== 'finished');

    if (animation && group) {
      const duration = Number(animation.effect?.getTiming().duration);
      const endProgress = Math.max(
        0,
        (group.offsetWidth - carousel.clientWidth) /
          (group.offsetWidth * 2),
      );
      animation.currentTime = toEnd ? duration * endProgress : 0;
      return;
    }

    carousel?.scrollTo({
      left: toEnd ? carousel.scrollWidth : 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 pb-16 min-h-screen bg-slate-50 text-slate-800">
      
      {/* Hero Banner */}
      <section className="relative rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-6 md:p-10 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            NEXT-GEN TRAVEL ENGINE v2.0
          </div>
          
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Where will you <span className="bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text text-transparent">go next?</span>
          </h1>
          
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
            Discover places, plan your trip, manage your budget, and keep everything in one calm workspace.
          </p>

          {/* Search Box */}
          <div className="mt-6 bg-white rounded-2xl p-3 text-slate-800 shadow-2xl space-y-3 text-left">
            <div className="flex items-center gap-1 border-b border-slate-100 pb-2 overflow-x-auto text-xs font-semibold">
              {['All', 'Destinations', 'Attractions', 'Hotels', 'Food'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                    activeTab === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-5 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <IconSearch />
                <input 
                  type="text" 
                  aria-label="Search destinations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      openDestinationSearch();
                    }
                  }}
                  placeholder="Search destinations... (e.g. China)" 
                  className="bg-transparent w-full text-xs outline-none font-medium text-slate-800"
                />
              </div>

              <div className="md:col-span-3 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <IconCalendar />
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">WHEN</div>
                  <div className="text-xs font-semibold text-slate-700">Oct 14 – Oct 28</div>
                </div>
              </div>

              <div className="md:col-span-3 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <IconUsers />
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-400">WHO</div>
                  <div className="text-xs font-semibold text-slate-700">2 Guests</div>
                </div>
              </div>

              <button 
                type="button"
                onClick={openDestinationSearch}
                aria-label="Search destinations"
                className="md:col-span-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center p-3 transition"
              >
                <IconArrowRight />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button 
              type="button"
              onClick={() => navigate('/explore')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              Explore Destinations <IconArrowRight />
            </button>
            <button 
              type="button"
              onClick={() => navigate('/trips')}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-xs border border-white/20 transition"
            >
              Plan a Trip
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-teal-600 tracking-wider">01 // TOP HITS</div>
            <h2 className="text-xl font-black text-slate-800">Popular Destinations</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="Scroll to the first popular destination"
              onClick={() => seekPopularDestinations(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Start
            </button>
            <button
              type="button"
              aria-label="Scroll to the last popular destination"
              onClick={() => seekPopularDestinations(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              End
            </button>
            <button 
              type="button"
              onClick={() => navigate('/explore')}
              className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-800"
            >
              View all ({filteredDestinations.length}) <IconChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={popularDestinationsRef}
          aria-label="Popular destinations"
          className="relative flex w-full min-w-0 overflow-x-auto pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          <div ref={popularDestinationsTrackRef} className="popular-destinations-track">
            <div ref={popularDestinationsGroupRef} className="flex w-max shrink-0 gap-4 pr-4">
              {filteredDestinations.map(item => (
                <div key={item.id} className="w-[min(85vw,19rem)] shrink-0">
                  <DestinationCard 
                    item={item}
                    isSaved={isSaved(item.id)}
                    onToggleSave={toggleSave}
                    onAddToTrips={() =>
                      navigate('/trips', { state: { addDestination: item } })
                    }
                    onClick={() =>
                      navigate(`/places/${encodeURIComponent(String(item.id))}`, {
                        state: { destination: item },
                      })
                    }
                  />
                </div>
              ))}
            </div>
            {!isLoadingDestinations && filteredDestinations.length === 0 && (
              <p className="px-4 py-8 text-sm text-slate-500">
                {destinationsLoadError || 'No destinations are available yet.'}
                {destinationsLoadError && (
                  <button
                    type="button"
                    onClick={() => setCatalogReloadKey((key) => key + 1)}
                    className="ml-2 font-semibold text-teal-700 underline"
                  >
                    Retry
                  </button>
                )}
              </p>
            )}
            <div
              aria-hidden="true"
              inert
              className="flex w-max shrink-0 gap-4 pr-4"
            >
              {filteredDestinations.map(item => (
                <div key={`duplicate-${item.id}`} className="w-[min(85vw,19rem)] shrink-0">
                  <DestinationCard item={item} isSaved={isSaved(item.id)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Feature Banner */}
      <section className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-xl">
          <span className="bg-teal-500/30 text-teal-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-teal-400/30">
            TripOS Screenshot AI 2.0
          </span>
          <h3 className="text-xl font-extrabold">Stop manually typing flight bookings and reservations.</h3>
          <p className="text-xs text-slate-300">
            Paste a screenshot of any booking confirmation or receipt to automatically sync times and costs.
          </p>
        </div>
        <button 
          type="button"
          onClick={() => navigate('/ai')}
          className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 whitespace-nowrap"
        >
          <IconSparkles /> Try Screenshot AI
        </button>
      </section>

      {/* Recommended Places */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-bold text-teal-600 tracking-wider">02 // ATTRACTION HIGHLIGHTS</div>
          <h2 className="text-xl font-black text-slate-800">Recommended Places to Visit</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              onAddToTrips={() =>
                navigate('/trips', { state: { addDestination: place } })
              }
              onClick={() =>
                navigate(`/places/${encodeURIComponent(String(place.id))}`, {
                  state: { destination: place },
                })
              }
            />
          ))}
          {!isLoadingPlaces && recommendations.length === 0 && (
            <p className="text-sm text-slate-500">
              {placesLoadError || 'No recommended places are available yet.'}
              {placesLoadError && (
                <button
                  type="button"
                  onClick={() => setCatalogReloadKey((key) => key + 1)}
                  className="ml-2 font-semibold text-teal-700 underline"
                >
                  Retry
                </button>
              )}
            </p>
          )}
        </div>
      </section>

    </div>
  );
}