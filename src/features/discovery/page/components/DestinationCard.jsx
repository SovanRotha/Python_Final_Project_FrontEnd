import React from 'react';

// Built-in SVG Icons
export const IconSearch = () => (
  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const IconCalendar = () => (
  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const IconUsers = () => (
  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export const IconSparkles = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export const IconHeart = ({ active }) => (
  <svg className="w-4 h-4" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export const IconChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

// Combined Destination & Place Data
export const POPULAR_DESTINATIONS = [
  {
    id: 'china',
    title: 'ChongQing, China',
    avgCost: '$48/day avg',
    rating: '4.9',
    reviews: '32.4k reviews',
    desc: 'Cyberpunk nightscapes, spicy hotpot & dramatic mountain transport.',
    tags: ['CULTURE', 'FOOD', 'SCENERY'],
    img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    type: 'City'
  },
  {
    id: 'kyoto-tokyo',
    title: 'Kyoto & Tokyo, JP',
    avgCost: '$98/day avg',
    rating: '4.95',
    reviews: '18k reviews',
    desc: 'Historic temples, neon districts, and scenic bullet train journeys.',
    tags: ['HISTORY', 'CUISINE', 'TRANSIT'],
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    type: 'Multi-City'
  },
  {
    id: 'danang-hoian',
    title: 'Da Nang & Hoi An',
    avgCost: '$35/day avg',
    rating: '4.8',
    reviews: '11.1k reviews',
    desc: 'Golden bridges, lantern-lit ancient streets, and pristine beaches.',
    tags: ['BUDGET', 'BEACH', 'CULTURE'],
    img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
    type: 'Coastal'
  },
  {
    id: 'amalfi',
    title: 'Amalfi Coast, Italy',
    avgCost: '$160/day avg',
    rating: '4.9',
    reviews: '6.2k reviews',
    desc: 'Dramatic cliffside villages, pastel seaside villas, and lemon groves.',
    tags: ['SCENERY', 'ROMANCE', 'LUXURY'],
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    type: 'Coastal'
  }
];

export const RECOMMENDED_PLACES = [
  {
    id: 'wat-pho',
    title: 'Wat Pho & Reclining Buddha',
    category: 'HISTORICAL TEMPLE',
    location: 'Bangkok, Thailand',
    desc: 'One of Bangkok\'s oldest sanctuary complexes, home to the 46m gilded Buddha.',
    tags: ['CULTURE', 'ARCHITECTURE', 'MUST-SEE'],
    img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fushimi-inari',
    title: 'Fushimi Inari Shrine',
    category: 'SHINTO SHRINE',
    location: 'Kyoto, Japan',
    desc: 'Iconic network of thousands of vermilion torii gates winding up Mount Inari.',
    tags: ['NATURE', 'SPIRITUAL', 'FREE'],
    img: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'marble-mountains',
    title: 'Marble Mountains',
    category: 'NATURAL LANDMARK',
    location: 'Da Nang, Vietnam',
    desc: 'Cluster of five marble and limestone hills featuring hidden Buddhist grottoes.',
    tags: ['HIKING', 'VIEWS', 'CAVES'],
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
  }
];

// Popular Destination Card
export default function DestinationCard({ item, isSaved, onToggleSave, onBuildItinerary }) {
  if (!item) return null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition group">
      <div className="relative h-44 overflow-hidden">
        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold">
          {item.avgCost}
        </div>
        <button 
          type="button"
          onClick={() => onToggleSave(item.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
          }`}
        >
          <IconHeart active={isSaved} />
        </button>
        <div className="absolute bottom-3 left-3 bg-teal-900/80 backdrop-blur-md text-teal-200 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
          <span className="text-amber-400">★</span> {item.rating} ({item.reviews})
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
        <p className="text-slate-500 text-xs line-clamp-2">{item.desc}</p>
        
        <div className="flex flex-wrap gap-1 pt-1 pb-2">
          {item.tags?.map(tag => (
            <span key={tag} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <button 
          type="button"
          onClick={onBuildItinerary}
          className="w-full py-2 bg-slate-50 hover:bg-teal-50 text-teal-700 font-semibold text-xs rounded-xl border border-slate-200 hover:border-teal-200 transition flex items-center justify-center gap-1"
        >
          Build Itinerary <IconSparkles />
        </button>
      </div>
    </div>
  );
}

// Recommended Place Card
export function PlaceCard({ place }) {
  if (!place) return null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      <div className="relative h-40">
        <img src={place.img} alt={place.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          {place.category}
        </div>
      </div>
      <div className="p-4 space-y-1">
        <div className="text-[11px] text-slate-400 font-semibold">{place.location}</div>
        <h3 className="font-bold text-slate-800 text-sm">{place.title}</h3>
        <p className="text-xs text-slate-500">{place.desc}</p>
      </div>
    </div>
  );
}