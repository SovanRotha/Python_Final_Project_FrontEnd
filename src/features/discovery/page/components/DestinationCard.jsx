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
            onToggleSave(item);
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