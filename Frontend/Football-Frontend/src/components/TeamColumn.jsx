import React from "react";
import TeamAvatar from "./TeamAvatar.jsx";

export default function TeamColumn({ team, size = "sm" }) {
  const box = size === "lg" ? 64 : 48;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-2xl ring-2 ring-slate-100 dark:ring-slate-800/60">
        <TeamAvatar name={team.name} logo={team.logo} size={box} rounded="rounded-2xl" />
      </div>
      <span className="max-w-[90px] text-center text-sm font-semibold leading-tight text-slate-800 dark:text-slate-200">{team.name}</span>
    </div>
  );
}
