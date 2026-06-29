import React from "react";
export default function StatRow({ label, valueA, valueB }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="w-10 text-left font-semibold text-slate-900">{valueA}</span>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className="w-10 text-right font-semibold text-slate-900">{valueB}</span>
    </div>
  );
}