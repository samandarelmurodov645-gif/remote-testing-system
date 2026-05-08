"use client";

import { useState, useTransition } from "react";
import { signInAction, signUpAction } from "./actions";
import { Button, Input } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const res =
        mode === "signin"
          ? await signInAction(formData)
          : await signUpAction(formData);
      if (res && !res.ok) setMessage(res.message);
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Branded panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900" />
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Floating orbs */}
        <div className="absolute top-16 left-16 w-56 h-56 bg-white rounded-full mix-blend-overlay opacity-10 animate-float" />
        <div className="absolute bottom-24 right-8 w-72 h-72 bg-purple-300 rounded-full mix-blend-overlay opacity-10 animate-float delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-overlay opacity-5 animate-float delay-100" />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TestPro</span>
          </div>

          {/* Main text */}
          <div className="my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-indigo-100 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t("home.badge")}
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              {mode === "signin" ? t("login.welcome") : t("login.register")}
            </h2>
            <p className="text-indigo-200 text-lg leading-relaxed mb-10 max-w-sm">
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
                  <div className="w-5 h-5 rounded-full bg-emerald-400/30 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-indigo-100 text-sm font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 pt-8 border-t border-white/15">
            {[
              { value: "10K+", label: t("home.stats.students") },
              { value: "500+", label: t("home.stats.tests") },
              { value: "98%", label: t("home.stats.satisfaction") },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-indigo-300 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">TestPro</span>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
            {/* Header */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
                {mode === "signin" ? t("login.welcome") : t("login.register")}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                {mode === "signin" ? t("login.welcomeDesc") : t("login.registerDesc")}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setMessage(null); }}
                  disabled={pending}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {m === "signin" ? t("login.signIn") : t("login.signUp")}
                </button>
              ))}
            </div>

            {/* Error message */}
            {message && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{message}</p>
              </div>
            )}

            {/* Form */}
            <form action={onSubmit} className="space-y-4">
              <input type="hidden" name="next" value={nextPath} />

              <Input
                name="email"
                type="email"
                label={t("login.emailLabel")}
                placeholder={t("login.emailPlaceholder")}
                required
                disabled={pending}
              />

              <Input
                name="password"
                type="password"
                label={t("login.password")}
                placeholder={t("login.passwordPlaceholder")}
                required
                disabled={pending}
                helperText={mode === "signup" ? t("login.passwordHint") : undefined}
              />

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
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
                <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                  {t("login.forgotPassword")}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === "signin" ? (
              <>
                {t("login.noAccount")}{" "}
                <button type="button" onClick={() => { setMode("signup"); setMessage(null); }}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                  {t("login.signUp")}
                </button>
              </>
            ) : (
              <>
                {t("login.hasAccount")}{" "}
                <button type="button" onClick={() => { setMode("signin"); setMessage(null); }}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
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
