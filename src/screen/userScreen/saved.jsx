import { useEffect, useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DestinationCard from "../../features/discovery/page/components/DestinationCard";
import { fetchPlaces } from "../../services/api/placeapi.js";

function Saved({
  savedPlaces = [],
  onToggleSave = () => {},
  savingPlaceIds = [],
  savedPlacesLoading = false,
  savedPlacesError = "",
}) {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [placesError, setPlacesError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      try {
        const result = await fetchPlaces();
        if (!cancelled) {
          setPlaces(result);
          setPlacesError("");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Could not load places for saved list:", error);
          setPlacesError(
            error instanceof Error ? error.message : "Could not load places.",
          );
        }
      } finally {
        if (!cancelled) setLoadingPlaces(false);
      }
    }

    void loadPlaces();
    return () => {
      cancelled = true;
    };
  }, []);

  const savedItems = useMemo(() => {
    const savedIds = new Set(savedPlaces.map((id) => String(id)));
    return places
      .filter((place) => savedIds.has(String(place.id)))
      .map((place) => ({
        ...place,
        title: place.name,
        desc: place.description || "",
        img: place.image || "",
        tags: place.category ? [place.category] : [],
        kind: "place",
      }));
  }, [places, savedPlaces]);

  const isLoading = loadingPlaces || savedPlacesLoading;
  const error = savedPlacesError || placesError;

  return (
    <main className="min-h-full bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Your shortlist
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Saved places
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep the places you love handy while you plan.
          </p>
        </header>

        {placesError && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {placesError}
          </div>
        )}

        {isLoading ? (
          <div
            className="flex items-center justify-center gap-2 rounded-2xl bg-white p-12 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200"
            role="status"
          >
            <LoaderCircle className="animate-spin" size={18} />
            Loading saved places…
          </div>
        ) : savedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {savedItems.map((place) => (
              <DestinationCard
                key={place.id}
                item={place}
                isSaved
                showSave
                isSaving={savingPlaceIds.some(
                  (savingId) => String(savingId) === String(place.id),
                )}
                onToggleSave={onToggleSave}
                onAddToTrips={() =>
                  navigate("/trips", { state: { addDestination: place } })
                }
                onClick={() =>
                  navigate(`/places/${encodeURIComponent(String(place.id))}`, {
                    state: { destination: place },
                  })
                }
              />
            ))}
          </div>
        ) : error ? null : (
          <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold">No saved places yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Save a place from Home or Explore and it will show up here.
            </p>
            <button
              className="mt-5 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white"
              onClick={() => navigate("/explore")}
              type="button"
            >
              Explore places
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

export default Saved;
