import React, { useState } from "react";

// Curated palette so fallback avatars always look intentional, never random-ugly.
const PALETTE = [
  "#92400E", // brown
  "#BE185D", // pink/magenta
  "#1D4ED8", // blue
  "#0F766E", // teal
  "#7C3AED", // violet
  "#B45309", // amber-brown
  "#C2410C", // burnt orange
  "#0369A1", // sky blue
  "#15803D", // green
  "#9D174D", // rose
  "#4338CA", // indigo
  "#A16207", // gold
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initialsFor(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function colorFor(name = "") {
  return PALETTE[hashString(name) % PALETTE.length];
}

/**
 * Renders a team logo, falling back to a colored initials avatar
 * (deterministic per team name) when no logo is available or it fails to load.
 */
export default function TeamAvatar({ name, logo, size = 48, imgSize, rounded = "rounded-full" }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !logo || failed;
  const innerSize = imgSize ?? Math.round(size * 0.72);

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center ${rounded} font-black text-white shadow-inner select-none`}
        style={{ height: size, width: size, backgroundColor: colorFor(name), fontSize: size * 0.34 }}
      >
        {initialsFor(name)}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="object-contain"
      style={{ height: innerSize, width: innerSize }}
      onError={() => setFailed(true)}
    />
  );
}
