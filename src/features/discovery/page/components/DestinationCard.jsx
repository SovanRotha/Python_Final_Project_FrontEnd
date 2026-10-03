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
  },
  {
    id: 'paris',
    title: 'Paris, France',
    avgCost: '$145/day avg',
    rating: '4.8',
    reviews: '28k reviews',
    desc: 'Iconic boulevards, world-class museums, historic landmarks, and neighborhood cafes.',
    tags: ['CULTURE', 'FOOD', 'HISTORY'],
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    type: 'City'
  },
  {
    id: 'bali',
    title: 'Bali, Indonesia',
    avgCost: '$52/day avg',
    rating: '4.9',
    reviews: '21k reviews',
    desc: 'Tropical beaches, emerald rice terraces, and welcoming island culture.',
    tags: ['BEACH', 'NATURE', 'BUDGET'],
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    type: 'Coastal'
  },
  {
    id: 'reykjavik',
    title: 'Reykjavik, Iceland',
    avgCost: '$135/day avg',
    rating: '4.8',
    reviews: '9.7k reviews',
    desc: 'Use the lively capital as a base for waterfalls, hot springs, and northern lights.',
    tags: ['NATURE', 'SCENERY', 'ADVENTURE'],
    img: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=800&q=80',
    type: 'City'
  },
  {
    id: 'new-york',
    title: 'New York City, USA',
    avgCost: '$190/day avg',
    rating: '4.8',
    reviews: '36k reviews',
    desc: 'A vibrant mix of skyline views, Broadway shows, museums, and food from everywhere.',
    tags: ['CITY', 'CULTURE', 'FOOD'],
    img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
    type: 'City'
  },
  {
    id: 'marrakech',
    title: 'Marrakech, Morocco',
    avgCost: '$65/day avg',
    rating: '4.7',
    reviews: '12k reviews',
    desc: 'Explore colorful souks, tranquil gardens, and the historic medina.',
    tags: ['CULTURE', 'HISTORY', 'BUDGET'],
    img: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
    type: 'City'
  },
  {
    id: 'swiss-alps',
    title: 'Swiss Alps, Switzerland',
    avgCost: '$175/day avg',
    rating: '4.9',
    reviews: '8.4k reviews',
    desc: 'Mountain railways, alpine villages, and unforgettable hiking and ski trails.',
    tags: ['NATURE', 'SCENERY', 'ADVENTURE'],
    img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
    type: 'Nature'
  },
  {
    id: 'singapore',
    title: 'Singapore',
    avgCost: '$115/day avg',
    rating: '4.8',
    reviews: '14k reviews',
    desc: 'Discover futuristic gardens, lively waterfronts, and renowned hawker food.',
    tags: ['CITY', 'FOOD', 'CULTURE'],
    img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    type: 'City'
  },
  {
    id: 'petra',
    title: 'Petra, Jordan',
    avgCost: '$85/day avg',
    rating: '4.9',
    reviews: '7.1k reviews',
    desc: 'Walk through the rose-red canyon to discover the remarkable ancient city.',
    tags: ['HISTORY', 'CULTURE', 'ADVENTURE'],
    img: 'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?auto=format&fit=crop&w=800&q=80',
    type: 'Historical'
  },
  {
    id: 'santorini',
    title: 'Santorini, Greece',
    avgCost: '$130/day avg',
    rating: '4.8',
    reviews: '10.5k reviews',
    desc: 'Whitewashed villages, blue-domed churches, and sunset views over the Aegean.',
    tags: ['BEACH', 'SCENERY', 'CULTURE'],
    img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80',
    type: 'Coastal'
  },
  {
    id: 'cape-town',
    title: 'Cape Town, South Africa',
    avgCost: '$90/day avg',
    rating: '4.8',
    reviews: '9.2k reviews',
    desc: 'Pair dramatic Table Mountain views with beaches, vineyards, and coastal drives.',
    tags: ['NATURE', 'BEACH', 'ADVENTURE'],
    img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
    type: 'Coastal'
  },
  {
    id: 'banff',
    title: 'Banff, Canada',
    avgCost: '$120/day avg',
    rating: '4.9',
    reviews: '6.8k reviews',
    desc: 'Turquoise lakes, pine forests, and scenic trails in the Canadian Rockies.',
    tags: ['NATURE', 'SCENERY', 'HIKING'],
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    type: 'Nature'
  },
  {
    id: 'seoul',
    title: 'Seoul, South Korea',
    avgCost: '$88/day avg',
    rating: '4.8',
    reviews: '16k reviews',
    desc: 'Historic palaces, late-night markets, contemporary art, and Korean cuisine.',
    tags: ['CITY', 'CULTURE', 'FOOD'],
    img: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80',
    type: 'City'
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
    img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fushimi-inari',
    title: 'Fushimi Inari Shrine',
    category: 'SHINTO SHRINE',
    location: 'Kyoto, Japan',
    desc: 'Iconic network of thousands of vermilion torii gates winding up Mount Inari.',
    tags: ['NATURE', 'SPIRITUAL', 'FREE'],
    img: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'marble-mountains',
    title: 'Marble Mountains',
    category: 'NATURAL LANDMARK',
    location: 'Da Nang, Vietnam',
    desc: 'Cluster of five marble and limestone hills featuring hidden Buddhist grottoes.',
    tags: ['HIKING', 'VIEWS', 'CAVES'],
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
  }
];

// Popular Destination Card
export default function DestinationCard({
  item,
  isSaved,
  onToggleSave,
  onAddToTrips,
  onClick,
}) {
  if (!item) return null;

  return (
    <div
      role={onClick ? 'link' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View details for ${item.title || item.name}` : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (event) => {
        if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClick();
        }
      } : undefined}
      className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition group ${
        onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600' : ''
      }`}
    >
      <div className="relative min-h-48 overflow-hidden bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 p-5 text-white">
        {item.img && (
          <img
            src={item.img}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-slate-900/20" />
        {item.avgCost && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-slate-950/60 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
            {item.avgCost}
          </div>
        )}
        <button 
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave(item.id);
          }}
          aria-label={isSaved ? 'Remove saved place' : 'Save place'}
          className={`absolute right-4 top-4 z-10 rounded-full p-2 backdrop-blur-md transition ${
            isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
          }`}
        >
          <IconHeart active={isSaved} />
        </button>
        <div className="relative z-10 pt-10">
          {item.category && (
            <p className="text-[10px] font-bold uppercase tracking-wide text-teal-200">
              {item.category}
            </p>
          )}
          {item.location && (
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-teal-100/80">
              {item.location}
            </p>
          )}
          <h3 className="mt-2 text-lg font-bold">{item.title || item.name}</h3>
        </div>
        {(item.rating || item.reviews) && (
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-teal-100">
            {item.rating && <span className="text-amber-400">★</span>}
            {item.rating}
            {item.reviews && ` (${item.reviews})`}
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <p className="text-slate-500 text-xs line-clamp-2">{item.desc || item.description}</p>
        
        <div className="flex flex-wrap gap-1 pt-1 pb-2">
          {item.tags?.map(tag => (
            <span key={tag} className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button 
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAddToTrips();
            }}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-teal-700 transition hover:border-teal-200 hover:bg-teal-50"
          >
            Add to My Trips <IconSparkles />
          </button>
        </div>
      </div>
    </div>
  );
}

// Recommended Place Card
export function PlaceCard({ place, onClick, onAddToTrips }) {
  if (!place) return null;

  return (
    <div
      role={onClick ? 'link' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View details for ${place.title || place.name}` : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (event) => {
        if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClick();
        }
      } : undefined}
      className={`bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm ${
        onClick ? 'cursor-pointer transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600' : ''
      }`}
    >
      <div className="relative min-h-48 overflow-hidden bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 p-5 text-white">
        {place.img && (
          <img
            src={place.img}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-slate-900/20" />
        <div className="relative z-10">
        <div className="text-[10px] font-bold uppercase tracking-wide text-teal-200">
          {place.category || place.type}
        </div>
        {place.location && (
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-teal-100/80">
            {place.location}
          </p>
        )}
        <h3 className="mt-2 text-lg font-bold">{place.title || place.name}</h3>
        </div>
      </div>
      <div className="p-4 space-y-1">
        <p className="text-xs text-slate-500">{place.desc || place.description}</p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddToTrips();
          }}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-teal-700 transition hover:border-teal-200 hover:bg-teal-50"
        >
          Add to My Trips
        </button>
      </div>
    </div>
  );
}