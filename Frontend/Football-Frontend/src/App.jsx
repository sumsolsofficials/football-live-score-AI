import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import LiveMatches from "./pages/LiveMatches.jsx";
import League from "./pages/League.jsx";
import Match from "./pages/Matches.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-[#eefcf3] text-slate-900 dark:bg-bg-dark dark:text-text-dark transition-colors">
      <Header />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:pb-12">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/live"       element={<LiveMatches />} />
          <Route path="/league/:id" element={<League />} />
          <Route path="/match/:id"  element={<Match />} />
          <Route path="/settings"   element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

