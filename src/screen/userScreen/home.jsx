import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDestinations, getRecommendedPlaces } from '../../services/api/destinationapi';
import DestinationCard, { 
  PlaceCard, 
  POPULAR_DESTINATIONS, 
  RECOMMENDED_PLACES,
  IconSearch,
  IconCalendar,
  IconUsers,
  IconArrowRight,
  IconSparkles,
  IconChevronRight
} from '../../features/discovery/page/components/DestinationCard';

export default function Home({ savedPlaces = [], onToggleSave = () => {} }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSaved, setLocalSaved] = useState([]);

  // Data & Loading States
  const [destinations, setDestinations] = useState(POPULAR_DESTINATIONS);
  const [recommendations, setRecommendations] = useState(RECOMMENDED_PLACES);
  
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const [apiDestinations, apiPlaces] = await Promise.all([
        getDestinations(),
        getRecommendedPlaces(),
      ]);

      if (cancelled) return;

      setDestinations(
        Array.isArray(apiDestinations) && apiDestinations.length > 0
          ? apiDestinations
          : POPULAR_DESTINATIONS,
      );
      setRecommendations(
        Array.isArray(apiPlaces) && apiPlaces.length > 0
          ? apiPlaces
          : RECOMMENDED_PLACES,
      );
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);
  const safeSavedPlaces = Array.isArray(savedPlaces) ? savedPlaces : [];
  const isSaved = (id) => (safeSavedPlaces.length > 0) ? safeSavedPlaces.includes(id) : localSaved.includes(id);

  const toggleSave = (id) => {
    onToggleSave(id);
    setLocalSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredDestinations = destinations.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || item.type?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => navigate('/explore')}
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
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-teal-600 tracking-wider">01 // TOP HITS</div>
            <h2 className="text-xl font-black text-slate-800">Popular Destinations</h2>
          </div>
          <button 
            type="button"
            onClick={() => navigate('/explore')}
            className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1"
          >
            View all ({filteredDestinations.length}) <IconChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDestinations.map(item => (
            <DestinationCard 
              key={item.id}
              item={item}
              isSaved={isSaved(item.id)}
              onToggleSave={toggleSave}
              onBuildItinerary={() => navigate('/trips')}
            />
          ))}
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
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

    </div>
  );
}