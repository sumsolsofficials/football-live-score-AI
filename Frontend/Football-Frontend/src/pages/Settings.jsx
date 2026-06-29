import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useSettings } from "../context/SettingsContext.jsx";

function SettingRow({ icon, label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9.5 w-9.5 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 text-base dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/30">
          {icon}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-850 dark:text-slate-200">{label}</p>
          {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Dark mode enabled" : "Light mode enabled"}
      onClick={onChange}
      className={`relative h-7 w-13.5 flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 ease-in-out focus:outline-none ${
        checked ? "bg-accent shadow-md shadow-accent/25" : "bg-slate-200 dark:bg-slate-800"
      }`}
    >
      <span
        className={`block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
          checked ? "translate-x-6.5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SegmentedControl({ options, value, onChange }) {
  const activeIndex = options.findIndex((o) => o.value === value);
  return (
    <div className="relative flex rounded-full bg-slate-100 p-0.5 dark:bg-slate-800/60 shadow-sm w-48 sm:w-56 flex-shrink-0">
      {/* Sliding background highlight */}
      <div
        className="absolute top-0.5 bottom-0.5 rounded-full bg-white dark:bg-slate-700 shadow-sm transition-all duration-300 ease-out"
        style={{
          width: `calc(${100 / options.length}% - 1px)`,
          transform: `translateX(${activeIndex * 100}%)`,
          left: "0.5px"
        }}
      />
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative z-10 flex-1 rounded-full py-1 text-[11px] font-black capitalize transition-colors duration-300 cursor-pointer ${
              isActive
                ? "text-accent"
                : "text-slate-550 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="px-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-550">{title}</p>
      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white px-4 dark:divide-slate-800/60 dark:border-slate-800/60 dark:bg-card-dark shadow-sm">
        {children}
      </div>
    </div>
  );
}

export default function Settings() {
  const { dark, toggle } = useTheme();
  const { statsStyle, setStatsStyle } = useSettings();

  const statsStyleOptions = [
    { value: "bars", label: "Bars" },
    { value: "numbers", label: "Numbers" },
    { value: "both", label: "Both" }
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-405 dark:text-slate-500 mt-0.5">Customize your experience</p>
      </div>

      <Section title="Appearance">
        <SettingRow icon="🎨" label="Dark Mode" description="Switch to dark theme">
          <Toggle checked={dark} onChange={toggle} />
        </SettingRow>
        <SettingRow icon="📊" label="Stats Style" description="Show stats as bars, numbers, or both">
          <SegmentedControl
            options={statsStyleOptions}
            value={statsStyle}
            onChange={setStatsStyle}
          />
        </SettingRow>
      </Section>

      <Section title="Data">
        <SettingRow icon="🔄" label="Refresh Rate" description="Live scores update automatically">
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-extrabold text-accent border border-accent/20">60s</span>
        </SettingRow>
      </Section>

      <Section title="About">
        <SettingRow icon="⚽" label="App Name" description="Football Live Scoreboard v1.0" />
        <SettingRow icon="📡" label="Data Source" description="api-sports.io v3 · Free Tier" />
      </Section>
    </div>
  );
}

