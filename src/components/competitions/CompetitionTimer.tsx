"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompetitionTimerProps {
  endTime: number; // Unix timestamp in milliseconds
  onTimeout: () => void;
}

export function CompetitionTimer({ endTime, onTimeout }: CompetitionTimerProps) {
  const { t } = useLanguage();
  const [remaining, setRemaining] = useState<number>(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    const updateTimer = () => {
      const timeLeft = Math.max(0, endTime - Date.now());
      setRemaining(timeLeft);
      if (timeLeft === 0 && !hasTimedOut) {
        setHasTimedOut(true);
        onTimeoutRef.current();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 250);
    return () => clearInterval(interval);
  }, [endTime, hasTimedOut]);

  const seconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  const colorClass =
    seconds < 60
      ? "bg-red-100 text-red-700 border-red-300"
      : seconds < 300
      ? "bg-amber-100 text-amber-700 border-amber-300"
      : "bg-emerald-100 text-emerald-700 border-emerald-300";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-600">{t("attempt.timeLeft")}:</span>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold border-2 ${colorClass}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {mm}:{ss}
      </div>
    </div>
  );
}
