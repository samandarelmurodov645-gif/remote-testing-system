"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { submitAttemptAction } from "@/app/student/tests/[testId]/actions";
import { Button, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

type Question = {
  id: string;
  prompt: string;
  options: Array<{ id: string; text: string }>;
};

export default function AttemptRunner(props: {
  attemptId: string;
  testTitle: string;
  startedAt: string;
  timeLimitSeconds: number;
  questions: Question[];
}) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  // Synchronous guard: prevents the timer auto-submit and the manual submit
  // button from both firing a server action in the same event-loop tick.
  // useRef so the flag is set before React re-renders (unlike useState).
  const submittedRef = useRef(false);

  const startedAtMs = useMemo(
    () => new Date(props.startedAt).getTime(),
    [props.startedAt]
  );
  const [nowMs, setNowMs] = useState(() => Date.now());

  const remainingMs = Math.max(
    0,
    startedAtMs + props.timeLimitSeconds * 1000 - nowMs
  );
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const selectedCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, props.questions.length - selectedCount);

  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(remainingSeconds % 60).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (remainingMs !== 0) return;
    if (submittedRef.current) return; // already submitted — skip
    submittedRef.current = true;
    startTransition(async () => {
      await submitAttemptAction({ attempt_id: props.attemptId, answers, expired: true });
      window.location.href = "/student/results";
    });
  // props.attemptId and answers are intentionally captured at expiry time;
  // submittedRef ensures this fires at most once regardless of re-renders.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs]);

  function submit(expired: boolean) {
    if (submittedRef.current) return; // already submitted — skip
    submittedRef.current = true;
    setMessage(null);
    startTransition(async () => {
      const res = await submitAttemptAction({ attempt_id: props.attemptId, answers, expired });
      if (!res.ok) {
        // Allow the student to retry on a transient server error.
        submittedRef.current = false;
        setMessage(res.message);
        return;
      }
      window.location.href = "/student/results";
    });
  }

  const progressPct = Math.round((selectedCount / props.questions.length) * 100);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Test header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{props.testTitle}</h1>
        <p className="text-slate-600 mt-1 text-sm">{t("attempt.focus")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Questions */}
        <section className="lg:col-span-8 space-y-5">
          {props.questions.map((q, idx) => (
            <Card key={q.id} variant="bordered" padding="lg" className={`transition-all ${answers[q.id] ? "ring-2 ring-indigo-100 border-indigo-200" : ""}`}>
              <div className="flex items-start gap-3 mb-5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  answers[q.id] ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">
                    {idx + 1}/{props.questions.length}
                  </div>
                  <p className="text-base text-slate-900 leading-relaxed font-medium">{q.prompt}</p>
                </div>
              </div>

              <div className="space-y-2 ml-11">
                {q.options.map((o) => {
                  const active = answers[q.id] === o.id;
                  return (
                    <label key={o.id} className={`flex items-start gap-4 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      active ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    } ${pending || remainingMs === 0 ? "opacity-60 cursor-not-allowed" : ""}`}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={o.id}
                        checked={active}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: o.id }))}
                        disabled={pending || remainingMs === 0}
                        className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className={`flex-1 text-sm leading-relaxed ${active ? "text-indigo-900 font-medium" : "text-slate-700"}`}>
                        {o.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>
          ))}

          {message && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{message}</p>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-6 space-y-4">
            {/* Timer */}
            <Card variant="bordered" padding="md">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                {t("attempt.timeLeft")}
              </div>
              <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-2xl font-bold ${
                remainingSeconds < 60 ? "bg-red-100 text-red-700" :
                remainingSeconds < 300 ? "bg-amber-100 text-amber-700" :
                "bg-emerald-100 text-emerald-700"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {mm}:{ss}
              </div>
            </Card>

            {/* Progress */}
            <Card variant="bordered" padding="md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {t("attempt.progress")}
                </h3>
                <span className="text-sm font-bold text-indigo-600">{progressPct}%</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="grid grid-cols-8 gap-1.5 mb-4">
                {props.questions.map((q, idx) => {
                  const done = Boolean(answers[q.id]);
                  return (
                    <div key={q.id} className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium border transition-all ${
                      done ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`} title={done ? t("attempt.answerGiven") : t("attempt.notAnswered")}>
                      {idx + 1}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{selectedCount}</div>
                  <div className="text-xs text-slate-500">{t("attempt.answered")}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-400">{unansweredCount}</div>
                  <div className="text-xs text-slate-500">{t("attempt.remaining")}</div>
                </div>
              </div>
            </Card>

            {/* Submit */}
            <Card variant="bordered" padding="md">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => submit(false)}
                disabled={pending || remainingMs === 0}
              >
                {pending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-indigo-200 border-t-white rounded-full animate-spin" />
                    {t("attempt.submitting")}
                  </span>
                ) : t("attempt.submit")}
              </Button>
              <p className="text-xs text-center text-slate-500 mt-2">{t("attempt.confirmSubmit")}</p>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
