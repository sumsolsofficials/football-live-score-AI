import React from "react";
export default function PossessionBar({ possessionA, possessionB }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-900">
        <span>{possessionA}%</span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Possession</span>
        <span>{possessionB}%</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="bg-green-600" style={{ width: `${possessionA}%` }} />
        <div className="bg-blue-600" style={{ width: `${possessionB}%` }} />
      </div>
    </div>
  );
}