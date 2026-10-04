import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../../screen/userScreen/home";
import Explore from "../../screen/userScreen/explore";
import Saved from "../../screen/userScreen/saved";
import Trip from "../../screen/userScreen/trip";
import Budget from "../../screen/userScreen/budget";
import AIAssistant from "../../screen/userScreen/ai_assistant";
import Notification from "../../screen/userScreen/notification";
import UserSideBar from "../../shared/components/UserSideBar";
import Memory from "../../screen/userScreen/memory";

function UserPage() {
  const [savedPlaces, setSavedPlaces] = useState([]);

  const handleToggleSave = (placeId) => {
    setSavedPlaces((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  return (
    <BrowserRouter>
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
              path="/saved"
              element={
                <Saved
                  savedPlaces={savedPlaces}
                  onToggleSave={handleToggleSave}
                />
              }
            />
            <Route path="/trips" element={<Trip />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/memories" element={<Memory/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default UserPage;