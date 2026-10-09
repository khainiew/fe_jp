import { useEffect, useMemo, useState } from "react";

function formatTime(totalSeconds) {
  const safe = Math.max(totalSeconds, 0);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function Timer({ initialSeconds = 7200, running = true, dangerAt = 1800 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const danger = useMemo(() => seconds <= dangerAt, [seconds, dangerAt]);

  return (
    <div className={`rounded-2xl border p-4 ${danger ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${danger ? "text-red-700" : "text-green-700"}`}>
            {danger ? "Segera habis" : "Batas konsumsi"}
          </p>
          <p className={`mt-1 font-mono text-3xl font-black ${danger ? "text-red-700" : "text-green-800"}`}>
            {formatTime(seconds)}
          </p>
        </div>
        <div className={`rounded-xl px-3 py-2 text-xs font-bold ${danger ? "bg-red-700 text-white" : "bg-green-700 text-white"}`}>
          {running ? "LIVE" : "STOP"}
        </div>
      </div>
    </div>
  );
}