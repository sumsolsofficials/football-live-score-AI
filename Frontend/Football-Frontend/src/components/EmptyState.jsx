import React from "react";
export default function EmptyState({ message = "Nothing to show right now", icon = "⚽" }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center dark:border-slate-800/60 dark:bg-card-dark/40">
      <span className="text-4xl opacity-50 scale-100 hover:scale-110 transition-transform duration-300">{icon}</span>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
