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
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <span className="text-3xl font-bold text-slate-900">TestPro</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {mode === "signin" ? t("login.welcome") : t("login.register")}
            </h1>
            <p className="text-slate-600">
              {mode === "signin" ? t("login.welcomeDesc") : t("login.registerDesc")}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "signin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setMode("signin")}
              disabled={pending}
            >
              {t("login.signIn")}
            </button>
            <button
              type="button"
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setMode("signup")}
              disabled={pending}
            >
              {t("login.signUp")}
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{message}</p>
            </div>
          )}

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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={pending}
            >
              {pending
                ? t("common.loading")
                : mode === "signin"
                ? t("login.signIn")
                : t("login.signUp")}
            </Button>
          </form>

          {mode === "signin" && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {t("login.forgotPassword")}
              </button>
            </div>
          )}
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-slate-600">
          {mode === "signin" ? (
            <>
              {t("login.noAccount")}{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {t("login.signUp")}
              </button>
            </>
          ) : (
            <>
              {t("login.hasAccount")}{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {t("login.signIn")}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
