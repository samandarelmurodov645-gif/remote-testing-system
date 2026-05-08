"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button, Card, Badge } from "@/components/ui";
import {
  getWeeklyExamDataAction,
  submitWeeklyExamAction,
  type WeeklyExamData,
  type LeaderboardEntry,
} from "./actions";

function getWeekId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const weekNum = Math.ceil(
    ((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7
  );
  return `${year}-W${String(weekNum).padStart(2, "0")}`;
}

function getNextMonday(): string {
  const now = new Date();
  const day = now.getDay() === 0 ? 7 : now.getDay();
  const next = new Date(now);
  next.setDate(now.getDate() + (8 - day));
  next.setHours(0, 0, 0, 0);
  return next.toLocaleDateString();
}

type State = "landing" | "loading" | "taking" | "done" | "already-taken";

export default function WeeklyExamRunner({
  leaderboard,
}: {
  leaderboard: LeaderboardEntry[];
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<State>("landing");
  const [examData, setExamData] = useState<WeeklyExamData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const weekId = useMemo(() => getWeekId(), []);

  useEffect(() => {
    const stored = localStorage.getItem(`weekly-exam-${weekId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setResult(data);
        setState("already-taken");
      } catch {
        setState("landing");
      }
    }
  }, [weekId]);

  function startExam() {
    setState("loading");
    startTransition(async () => {
      const data = await getWeeklyExamDataAction();
      if (!data || data.questions.length === 0) {
        setState("landing");
        return;
      }
      setExamData(data);
      setState("taking");
    });
  }

  function submitExam() {
    if (!examData) return;
    startTransition(async () => {
      const res = await submitWeeklyExamAction(answers);
      localStorage.setItem(`weekly-exam-${weekId}`, JSON.stringify(res));
      setResult(res);
      setState("done");
    });
  }

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">{t("weekly.loading")}</p>
        </div>
      </div>
    );
  }

  if (state === "taking" && examData) {
    const answered = Object.keys(answers).length;
    const total = examData.questions.length;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("weekly.title")}</h1>
            <p className="text-slate-600 text-sm mt-1">
              {examData.mode === "smart" ? t("weekly.smartMode") : t("weekly.randomMode")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">{t("attempt.answered")}</div>
            <div className="text-2xl font-bold text-indigo-600">{answered}/{total}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>

        <div className="space-y-6">
          {examData.questions.map((q, idx) => (
            <Card key={q.id} variant="bordered" padding="lg" className={`transition-all ${answers[q.id] ? "ring-2 ring-indigo-200" : ""}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  answers[q.id] ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {idx + 1}
                </div>
                <p className="text-base font-medium text-slate-900 leading-relaxed">{q.prompt}</p>
              </div>
              <div className="space-y-2 ml-11">
                {q.options.map((o) => {
                  const active = answers[q.id] === o.id;
                  return (
                    <label key={o.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      active ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={o.id}
                        checked={active}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className={`text-sm ${active ? "font-medium text-indigo-900" : "text-slate-700"}`}>
                        {o.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">{t("attempt.confirmSubmit")}</p>
          <Button
            variant="primary"
            size="lg"
            onClick={submitExam}
            disabled={answered === 0 || isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-indigo-200 border-t-white rounded-full animate-spin" />
                {t("attempt.submitting")}
              </span>
            ) : t("attempt.submit")}
          </Button>
        </div>
      </div>
    );
  }

  if ((state === "done" || state === "already-taken") && result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Result card */}
        <Card variant="elevated" padding="lg" className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl font-bold">{pct}%</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {state === "already-taken" ? t("weekly.alreadyTaken") : "🎉 " + t("weekly.yourScore")}
          </h2>
          <p className="text-slate-600 mb-6">
            {t("weekly.correctAnswers")} <span className="font-bold text-slate-900">{result.score}</span>{" "}
            {t("weekly.outOf")} {result.total}
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t("weekly.nextReset")} {getNextMonday()}
          </div>
        </Card>

        {/* Leaderboard */}
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t("weekly.leaderboard")}
          </h3>
          {leaderboard.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">{t("weekly.noLeaderboard")}</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, idx) => (
                <div key={entry.studentId} className={`flex items-center gap-4 p-3 rounded-xl ${
                  idx === 0 ? "bg-amber-50 border border-amber-200" :
                  idx === 1 ? "bg-slate-50 border border-slate-200" :
                  idx === 2 ? "bg-orange-50 border border-orange-200" :
                  "bg-white border border-slate-100"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    idx === 0 ? "bg-amber-400 text-white" :
                    idx === 1 ? "bg-slate-400 text-white" :
                    idx === 2 ? "bg-orange-400 text-white" :
                    "bg-slate-200 text-slate-600"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{entry.name}</p>
                    <p className="text-xs text-slate-500">{entry.attempts} {t("weekly.totalAttempts")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-900">{entry.totalScore}</p>
                    <p className="text-xs text-slate-500">{t("weekly.score")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Landing page
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <Badge variant="default" className="bg-white/20 text-white border-white/30 text-xs">
                {t("weekly.resetInfo")}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{t("weekly.title")}</h1>
            <p className="text-white/80 mb-6">{t("weekly.subtitle")}</p>
            <Button
              variant="secondary"
              size="lg"
              onClick={startExam}
              disabled={isPending}
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-0"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                  {t("weekly.loading")}
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("weekly.start")}
                </>
              )}
            </Button>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">20</span>
            </div>
            <span className="text-white/70 text-sm">{t("common.questions")}</span>
          </div>
        </div>
      </Card>

      {/* Smart mode info cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card variant="bordered" padding="md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm mb-1">{t("weekly.smartMode")}</p>
            </div>
          </div>
        </Card>
        <Card variant="bordered" padding="md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm mb-1">{t("weekly.randomMode")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t("weekly.leaderboard")}
        </h3>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">{t("weekly.noLeaderboard")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => (
              <div key={entry.studentId} className={`flex items-center gap-4 p-3 rounded-xl ${
                idx === 0 ? "bg-amber-50 border border-amber-200" :
                idx === 1 ? "bg-slate-50 border border-slate-200" :
                idx === 2 ? "bg-orange-50 border border-orange-200" :
                "bg-white border border-slate-100"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  idx === 0 ? "bg-amber-400 text-white" :
                  idx === 1 ? "bg-slate-400 text-white" :
                  idx === 2 ? "bg-orange-400 text-white" :
                  "bg-slate-200 text-slate-600"
                }`}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{entry.name}</p>
                  <p className="text-xs text-slate-500">{entry.attempts} {t("weekly.totalAttempts")}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-indigo-600 text-lg">{entry.totalScore}</p>
                  <p className="text-xs text-slate-500">{t("weekly.score")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
