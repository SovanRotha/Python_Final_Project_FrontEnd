import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import UserSideBar from './shared/components/UserSideBar';
import Home from './screen/userScreen/home';
import Explore from './screen/userScreen/explore';
import Saved from './screen/userScreen/saved';
import Trip from './screen/userScreen/trip';
import Budget from './screen/userScreen/budget';
import AIAssistant from './screen/userScreen/ai_assistant';
import Notification from './screen/userScreen/notification';
import PlacePage from './features/discovery/page/PlacePage';

export default function UserPage() {
  const [savedPlaceRecords, setSavedPlaceRecords] = useState([]);
  const savedPlaces = savedPlaceRecords.map((place) => place.id);
  const savedPlaceDetails = Object.fromEntries(
    savedPlaceRecords.map((place) => [place.id, place]),
  );

  const handleToggleSave = (place) => {
    if (!place || typeof place !== 'object' || place.id == null) return;

    setSavedPlaceRecords((current) =>
      current.some((savedPlace) => savedPlace.id === place.id)
        ? current.filter((savedPlace) => savedPlace.id !== place.id)
        : [...current, place],
    );
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <UserSideBar />
      <main className="h-full min-w-0 flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                savedPlaces={savedPlaces}
                onToggleSave={handleToggleSave}
              />
            }
          />
          <Route
            path="/explore"
            element={
              <Explore
                savedPlaces={savedPlaces}
                onToggleSave={handleToggleSave}
              />
            }
          />
          <Route
            path="/places/:placeId"
            element={
              <PlacePage
                savedPlaces={savedPlaces}
                onToggleSave={handleToggleSave}
              />
            }
          />
          <Route
            path="/saved"
            element={
              <Saved
                savedPlaces={savedPlaces}
                savedPlaceDetails={savedPlaceDetails}
                onToggleSave={handleToggleSave}
              />
            }
          />
          <Route path="/trips" element={<Trip />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}