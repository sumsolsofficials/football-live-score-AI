import React from "react";

const STATUS_LABEL = {
  "1H": "1st Half", HT: "Half Time", "2H": "2nd Half",
  ET: "Extra Time", BT: "Break", P: "Penalties",
  INT: "Interrupted", SUSP: "Suspended",
};

export default function LiveBadge({ status, statusShort, minute }) {
  if (status !== "LIVE") return null;
  const label = STATUS_LABEL[statusShort] ?? statusShort ?? "LIVE";
  const showMinute = statusShort !== "HT" && statusShort !== "BT" && minute != null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-sm shadow-accent/30">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      {label}{showMinute && ` ${minute}'`}
    </span>
  );
}
