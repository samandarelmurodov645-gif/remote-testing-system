import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { Button, Badge } from "@/components/ui";
import { getServerT, getLang } from "@/lib/i18n";

export default async function AttemptResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const supabase = await createSupabaseServerClient();
  const service = createSupabaseServiceClient();
  const [t, lang] = await Promise.all([getServerT(), getLang()]);

  // Verify the current user owns this attempt
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) notFound();

  const { data: attempt } = await supabase
    .from("attempts")
    .select("id,test_id,status,score,answers,finished_at")
    .eq("id", attemptId)
    .eq("student_id", userData.user.id)
    .maybeSingle();

  if (!attempt || (attempt.status !== "submitted" && attempt.status !== "expired")) {
    notFound();
  }

  // Use service client for test/questions/options/correct_options so results
  // remain readable even if a test is later unpublished, and to bypass the
  // correct_options RLS that restricts reads to admins only.
  const { data: test } = await service
    .from("tests")
    .select("id,title,max_attempts")
    .eq("id", attempt.test_id)
    .maybeSingle();

  if (!test) notFound();

  type QRowFull = { id: string; prompt: string; question_text_ru: string | null; question_text_en: string | null; question_text_fr: string | null; position: number };
  type ORowFull = { id: string; question_id: string; text: string; option_text_ru: string | null; option_text_en: string | null; option_text_fr: string | null; position: number };

  const { data: questionsRaw, error: qErr } = await service
    .from("questions")
    .select("id,prompt,question_text_ru,question_text_en,question_text_fr,position")
    .eq("test_id", attempt.test_id)
    .order("position", { ascending: true });

  let questions: QRowFull[];
  if (qErr) {
    const { data: fallback } = await service
      .from("questions")
      .select("id,prompt,position")
      .eq("test_id", attempt.test_id)
      .order("position", { ascending: true });
    questions = (fallback ?? []).map((q) => ({
      ...q,
      question_text_ru: null,
      question_text_en: null,
      question_text_fr: null,
    }));
  } else {
    questions = (questionsRaw ?? []) as QRowFull[];
  }

  const questionIds = questions.map((q) => q.id);

  const [optResult, { data: correctOptions }, { count: totalAttempts }] =
    await Promise.all([
      questionIds.length
        ? service
            .from("options")
            .select("id,question_id,text,option_text_ru,option_text_en,option_text_fr,position")
            .in("question_id", questionIds)
            .order("position", { ascending: true })
        : Promise.resolve({ data: [] as ORowFull[], error: null }),
      questionIds.length
        ? service
            .from("correct_options")
            .select("question_id,option_id")
            .in("question_id", questionIds)
        : Promise.resolve({ data: [] as Array<{ question_id: string; option_id: string }> }),
      // RLS automatically scopes this to the current student's attempts
      supabase
        .from("attempts")
        .select("*", { count: "exact", head: true })
        .eq("test_id", attempt.test_id)
        .eq("student_id", userData.user.id),
    ]);

  let options: ORowFull[];
  if (optResult.error) {
    const { data: fallback } = questionIds.length
      ? await service
          .from("options")
          .select("id,question_id,text,position")
          .in("question_id", questionIds)
          .order("position", { ascending: true })
      : { data: [] as Array<{ id: string; question_id: string; text: string; position: number }> };
    options = (fallback ?? []).map((o) => ({
      ...o,
      option_text_ru: null,
      option_text_en: null,
      option_text_fr: null,
    }));
  } else {
    options = (optResult.data ?? []) as ORowFull[];
  }

  const optionsByQuestion = new Map<string, Array<ORowFull>>();
  options.forEach((o) => {
    const arr = optionsByQuestion.get(o.question_id) ?? [];
    arr.push(o);
    optionsByQuestion.set(o.question_id, arr);
  });

  const localizeQ = (q: QRowFull) => {
    if (lang === "ru") return q.question_text_ru ?? q.prompt;
    if (lang === "en") return q.question_text_en ?? q.prompt;
    if (lang === "fr") return q.question_text_fr ?? q.prompt;
    return q.prompt;
  };

  const localizeO = (o: ORowFull) => {
    if (lang === "ru") return o.option_text_ru ?? o.text;
    if (lang === "en") return o.option_text_en ?? o.text;
    if (lang === "fr") return o.option_text_fr ?? o.text;
    return o.text;
  };

  const correctByQuestion = new Map<string, string>();
  (correctOptions ?? []).forEach((co) => {
    correctByQuestion.set(co.question_id, co.option_id);
  });

  const studentAnswers = ((attempt.answers ?? {}) as Record<string, string>);
  const total = questions.length;
  const score = attempt.score ?? 0;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const attemptsUsed = totalAttempts ?? 0;
  const attemptsRemaining = Math.max(0, test.max_attempts - attemptsUsed);
  const canRetry = attemptsRemaining > 0;

  const scoreColor =
    pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <div className="mb-6">
        <Link href="/student/results">
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("student.results.title")}
          </Button>
        </Link>
      </div>

      {/* Score summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6 text-center">
        <p className="text-sm font-medium text-slate-500 mb-1">{test.title}</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {t("attempt.result.title")}
        </h1>

        {/* Circular score */}
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="2" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke={scoreColor}
              strokeWidth="2"
              strokeDasharray={`${pct * 0.974} 97.4`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-900">{pct}%</span>
            <span className="text-xs text-slate-400">{t("attempt.result.score")}</span>
          </div>
        </div>

        <p className="text-xl font-semibold text-slate-700 mb-1">
          {score} / {total} {t("attempt.result.correctCount")}
        </p>

        <div className="flex items-center justify-center gap-2 mb-6 text-sm text-slate-500">
          {attempt.status === "expired" ? (
            <Badge variant="danger" size="sm">{t("attempt.expired")}</Badge>
          ) : (
            <Badge variant="success" size="sm">{t("attempt.completed")}</Badge>
          )}
          {attempt.finished_at && (
            <span>{new Date(attempt.finished_at).toLocaleString()}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/student/tests">
            <Button variant="outline">{t("student.testDetail.backToTests")}</Button>
          </Link>
          {canRetry && (
            <Link href={`/student/tests/${test.id}`}>
              <Button variant="primary">
                {t("attempt.result.tryAgain")}
                <span className="ml-1.5 text-indigo-200 text-xs font-normal">
                  ({attemptsRemaining} {t("attempt.result.attemptsLeft")})
                </span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Question breakdown */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        {t("attempt.result.breakdown")}
      </h2>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const opts = optionsByQuestion.get(q.id) ?? [];
          const correctOptId = correctByQuestion.get(q.id);
          const chosenOptId = studentAnswers[q.id];
          const isCorrect = !!chosenOptId && chosenOptId === correctOptId;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border-2 p-5 ${
                isCorrect ? "border-emerald-200" : "border-red-200"
              }`}
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
                    isCorrect
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isCorrect ? "✓" : "✗"}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-0.5">
                    {t("attempt.result.question")} {idx + 1}
                  </p>
                  <p className="text-base font-medium text-slate-900">{localizeQ(q)}</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 ml-10">
                {opts.map((o) => {
                  const isCorrectOpt = o.id === correctOptId;
                  const isChosen = o.id === chosenOptId;
                  const isWrong = isChosen && !isCorrectOpt;

                  return (
                    <div
                      key={o.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                        isCorrectOpt
                          ? "border-emerald-400 bg-emerald-50"
                          : isWrong
                          ? "border-red-400 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isCorrectOpt
                            ? "border-emerald-500 bg-emerald-500"
                            : isWrong
                            ? "border-red-500 bg-red-500"
                            : "border-slate-300"
                        }`}
                      >
                        {isCorrectOpt && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd" />
                          </svg>
                        )}
                        {isWrong && (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm flex-1 ${
                          isCorrectOpt
                            ? "text-emerald-900 font-medium"
                            : isWrong
                            ? "text-red-900 font-medium"
                            : "text-slate-700"
                        }`}
                      >
                        {localizeO(o)}
                      </span>
                      {isCorrectOpt && (
                        <span className="text-xs font-semibold text-emerald-600 shrink-0 whitespace-nowrap">
                          {t("attempt.result.correctAnswer")}
                        </span>
                      )}
                      {isWrong && (
                        <span className="text-xs font-semibold text-red-600 shrink-0 whitespace-nowrap">
                          {t("attempt.result.yourAnswer")}
                        </span>
                      )}
                    </div>
                  );
                })}

                {!chosenOptId && (
                  <p className="text-sm text-slate-400 italic ml-1 mt-1">
                    {t("attempt.notAnswered")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-200">
        <Link href="/student/results">
          <Button variant="outline">{t("student.results.title")}</Button>
        </Link>
        <div className="flex gap-3">
          <Link href="/student/tests">
            <Button variant="outline">{t("student.testDetail.backToTests")}</Button>
          </Link>
          {canRetry && (
            <Link href={`/student/tests/${test.id}`}>
              <Button variant="primary">{t("attempt.result.tryAgain")}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
