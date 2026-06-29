import React from "react";
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-emerald-500 dark:border-slate-700 dark:border-t-emerald-400" />
      <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Loading...</p>
    </div>
  );
}
