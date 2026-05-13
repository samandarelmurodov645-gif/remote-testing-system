"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const QUOTE_COUNT = 10;

export function QuotesCarousel() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setVisible(true);
    }, 350);
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % QUOTE_COUNT);
        setVisible(true);
      }, 350);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-16 animate-fade-in-up delay-500 max-w-3xl mx-auto">
      {/* Gradient border wrapper */}
      <div
        style={{
          background: "linear-gradient(135deg, #4338CA, #10B981, #6366f1)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 6s ease infinite",
          padding: "2px",
          borderRadius: "1.25rem",
        }}
      >
        <div className="bg-white rounded-[1.15rem] px-8 py-8 text-center relative overflow-hidden">
          {/* Decorative quote mark */}
          <div
            className="absolute top-3 left-5 font-serif select-none leading-none"
            style={{ fontSize: "5rem", color: "rgba(67,56,202,0.07)", lineHeight: 1 }}
            aria-hidden="true"
          >
            &ldquo;
          </div>

          {/* Quote content with fade */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              minHeight: "6rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p className="text-lg font-medium text-slate-800 leading-relaxed mb-4 max-w-xl mx-auto relative z-10">
              &ldquo;{t(`quote.${current + 1}.text`)}&rdquo;
            </p>
            <p className="text-sm font-semibold" style={{ color: "#4338CA" }}>
              — {t(`quote.${current + 1}.author`)}
            </p>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: QUOTE_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Quote ${i + 1}`}
                style={{
                  height: "6px",
                  width: i === current ? "24px" : "6px",
                  borderRadius: "99px",
                  background: i === current ? "#4338CA" : "rgba(67,56,202,0.2)",
                  transition: "all 0.3s ease",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
