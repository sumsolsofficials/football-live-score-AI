import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMatches } from "../context/MatchesContext.jsx";
import LogoImg from "../assets/logo.png";

function LogoIcon() {
  return (
    <img
      src={LogoImg}
      alt="Football Live Logo"
      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-slate-300/40 bg-white object-cover"
    />
  );
}

export default function Header() {
  const { liveMatches } = useMatches();
  const location = useLocation();

  const tabs = [
    { path: "/", label: "Home", key: "home" },
    { path: "/live", label: "Live", key: "live", badge: true },
    { path: "/settings", label: "Settings", key: "settings" },
  ];

  const getActiveIndex = (pathname) => {
    if (pathname === "/settings") return 2;
    if (pathname === "/live") return 1;
    return 0; // Default to Home for other routes
  };

  const activeIndex = getActiveIndex(location.pathname);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-bg-dark/80">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col items-start gap-3 group sm:flex-row sm:items-center">
            <div className="group-hover:scale-105 transition-transform duration-300">
              <LogoIcon />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white sm:text-lg">
                  Football Live
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                  Live
                </span>
              </div>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Scoreboard
              </p>
            </div>
          </Link>

          {/* Desktop navigation only */}
          <nav className="hidden sm:flex relative items-center bg-slate-150/80 dark:bg-slate-800/60 rounded-full p-0.5 w-[210px] sm:w-[230px]">
            {/* Sliding highlight indicator */}
            <div
              className="absolute top-0.5 bottom-0.5 left-0.5 rounded-full bg-white dark:bg-slate-700 shadow-sm transition-all duration-300 ease-out"
              style={{
                width: "calc(33.333% - 1px)",
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />

            {tabs.map((tab, idx) => {
              const isActive = activeIndex === idx;
              return (
                <Link
                  key={tab.key}
                  to={tab.path}
                  className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 py-1.5 text-xs font-extrabold transition-colors duration-300 ${
                    isActive
                      ? "text-accent"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && liveMatches.length > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white animate-pulse">
                      {liveMatches.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/60 bg-white/90 backdrop-blur-md dark:border-slate-800/60 dark:bg-bg-dark/90 sm:hidden">
        <div className="mx-auto flex max-w-2xl items-center px-4 py-2">
          <div className="relative flex w-full items-center bg-slate-150/80 dark:bg-slate-800/60 rounded-full p-0.5">
            <div
              className="absolute top-0.5 bottom-0.5 left-0.5 rounded-full bg-white dark:bg-slate-700 shadow-sm transition-all duration-300 ease-out"
              style={{
                width: "calc(33.333% - 1px)",
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />

            {tabs.map((tab, idx) => {
              const isActive = activeIndex === idx;
              return (
                <Link
                  key={tab.key}
                  to={tab.path}
                  className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-extrabold transition-colors duration-300 ${
                    isActive
                      ? "text-accent"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && liveMatches.length > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white animate-pulse">
                      {liveMatches.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

