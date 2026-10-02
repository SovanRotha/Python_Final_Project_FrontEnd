import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Sidebar
import UserSideBar from './shared/components/UserSideBar';

// Import Screens
import Home from './screen/userScreen/home';
import Explore from './screen/userScreen/explore';

export default function UserPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Left Sidebar */}
      <UserSideBar />

      {/* 2. Main Right Content Area */}
      <main className="flex-1 w-full overflow-y-auto min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </main>
    </div>
  );
}