"use client";

import { useState, useTransition } from "react";
import { signInAction, signUpAction } from "./actions";
import { Button } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const LEFT_SYMBOLS = [
  { s: "∑", l: "8%",  t: "70%", delay: "0s",   dur: "13s", fs: "1.8rem", op: 0.2 },
  { s: "π", l: "18%", t: "40%", delay: "2s",   dur: "17s", fs: "1.4rem", op: 0.22 },
  { s: "∫", l: "28%", t: "60%", delay: "5s",   dur: "14s", fs: "2.2rem", op: 0.15 },
  { s: "∞", l: "42%", t: "25%", delay: "3s",   dur: "18s", fs: "1.6rem", op: 0.18 },
  { s: "Δ", l: "55%", t: "75%", delay: "7s",   dur: "16s", fs: "1.9rem", op: 0.14 },
  { s: "α", l: "65%", t: "45%", delay: "1s",   dur: "20s", fs: "1.5rem", op: 0.2 },
  { s: "θ", l: "75%", t: "30%", delay: "4s",   dur: "15s", fs: "1.4rem", op: 0.18 },
  { s: "λ", l: "85%", t: "65%", delay: "6s",   dur: "19s", fs: "2rem",   op: 0.15 },
  { s: "E=mc²", l: "15%", t: "15%", delay: "8s", dur: "22s", fs: "1rem", op: 0.15 },
  { s: "H₂O", l: "72%", t: "82%", delay: "2.5s", dur: "16s", fs: "1.1rem", op: 0.17 },
  { s: "√",  l: "50%", t: "10%", delay: "10s", dur: "18s", fs: "1.7rem", op: 0.13 },
  { s: "β",  l: "35%", t: "85%", delay: "4.5s", dur: "21s", fs: "1.5rem", op: 0.16 },
];

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const res = mode === "signin"
        ? await signInAction(formData)
        : await signUpAction(formData);
      if (res && !res.ok) setMessage(res.message);
    });
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0F0F1A" }}>

      {/* ── Left: branded space panel ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col">
        {/* Background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)"
        }} />

        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="stars-1" />
          <div className="stars-2" />
        </div>

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.25) 0%, transparent 60%)"
        }} />

        {/* Floating symbols */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {LEFT_SYMBOLS.map((sym, i) => (
            <span
              key={i}
              className="absolute font-mono font-bold animate-sym-drift"
              style={{
                left: sym.l,
                top: sym.t,
                fontSize: sym.fs,
                opacity: sym.op,
                color: "#a5b4fc",
                animationDelay: sym.delay,
                animationDuration: sym.dur,
              }}
            >
              {sym.s}
            </span>
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TestPro</span>
          </div>

          {/* Main text */}
          <div className="my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/15 text-indigo-200 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {t("home.badge")}
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              {mode === "signin" ? t("login.welcome") : t("login.register")}
            </h2>
            <p className="text-indigo-200/80 text-lg leading-relaxed mb-10 max-w-sm">
              {mode === "signin" ? t("login.welcomeDesc") : t("login.registerDesc")}
            </p>

            {/* Feature checklist */}
            <div className="space-y-3.5">
              {[
                t("home.feature1.title"),
                t("home.feature2.title"),
                t("home.feature3.title"),
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-indigo-100 text-sm font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-8 border-t border-white/10">
            {[
              { value: "10K+", label: t("home.stats.students") },
              { value: "500+", label: t("home.stats.tests") },
              { value: "98%",  label: t("home.stats.satisfaction") },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-indigo-300/70 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative" style={{ background: "#0F0F1A" }}>
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(79,70,229,0.08) 0%, transparent 60%)"
        }} />

        {/* Language switcher */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher dropUp={false} />
        </div>

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-white">TestPro</span>
          </div>

          {/* Form card */}
          <div className="glass rounded-2xl border border-white/10 p-8 animate-fade-in-up">
            {/* Header */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white mb-1.5">
                {mode === "signin" ? t("login.welcome") : t("login.register")}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                {mode === "signin" ? t("login.welcomeDesc") : t("login.registerDesc")}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-1.5 p-1 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.06)" }}>
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setMessage(null); }}
                  disabled={pending}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {m === "signin" ? t("login.signIn") : t("login.signUp")}
                </button>
              ))}
            </div>

            {/* Error */}
            {message && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-300">{message}</p>
              </div>
            )}

            {/* Form */}
            <form action={onSubmit} className="space-y-4">
              <input type="hidden" name="next" value={nextPath} />

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t("login.emailLabel")} <span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder")}
                  required
                  disabled={pending}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder:text-slate-500 transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "rgba(99,102,241,0.6)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15), 0 0 16px rgba(99,102,241,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {t("login.password")} <span className="text-red-400">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder={t("login.passwordPlaceholder")}
                  required
                  disabled={pending}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder:text-slate-500 transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "rgba(99,102,241,0.6)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15), 0 0 16px rgba(99,102,241,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "rgba(255,255,255,0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {mode === "signup" && (
                  <p className="mt-1.5 text-xs text-slate-500">{t("login.passwordHint")}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={pending}
                className="btn-ripple mt-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
              >
                {pending ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-indigo-300 border-t-white rounded-full animate-spin" />
                    {t("common.loading")}
                  </span>
                ) : mode === "signin" ? t("login.signIn") : t("login.signUp")}
              </Button>
            </form>

            {mode === "signin" && (
              <div className="mt-4 text-center">
                <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  {t("login.forgotPassword")}
                </button>
              </div>
            )}
          </div>

          {/* Footer link */}
          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === "signin" ? (
              <>
                {t("login.noAccount")}{" "}
                <button type="button"
                  onClick={() => { setMode("signup"); setMessage(null); }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  {t("login.signUp")}
                </button>
              </>
            ) : (
              <>
                {t("login.hasAccount")}{" "}
                <button type="button"
                  onClick={() => { setMode("signin"); setMessage(null); }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  {t("login.signIn")}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
