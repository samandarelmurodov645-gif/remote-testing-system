import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { updateTestAction } from "../actions";
import {
  addOptionAction,
  deleteOptionAction,
  deleteQuestionAction,
  setCorrectOptionAction,
  setCorrectAnswerTextAction,
  resetAttemptsAction,
} from "./actions";
import { AddQuestionForm } from "./AddQuestionForm";
import { ResetAttemptsButton } from "./ResetAttemptsButton";
import { PageHeader } from "@/components/layout";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui";
import { ExcelImport } from "./ExcelImport";
import { getServerT } from "@/lib/i18n";

export default async function AdminTestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { testId } = await params;
  const { error, reset } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: test } = await supabase
    .from("tests")
    .select("id,title,description,time_limit_seconds,max_attempts,published")
    .eq("id", testId)
    .maybeSingle();

  if (!test) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card variant="bordered" padding="lg">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">{t("admin.testDetail.notFound")}</h2>
            <p className="text-slate-600 mb-6">{t("admin.testDetail.notFoundDesc")}</p>
            <Link href="/admin/tests">
              <Button variant="primary">{t("admin.testDetail.backToTests")}</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("id,test_id,prompt,position,question_type,correct_answer_text")
    .eq("test_id", testId)
    .order("position", { ascending: true });

  const questionIds = (questions ?? []).map((q) => q.id);

  const options: Array<{ id: string; question_id: string; text: string; position: number }> =
    questionIds.length
      ? (await supabase.from("options").select("id,question_id,text,position").in("question_id", questionIds).order("position", { ascending: true })).data ?? []
      : [];

  const correct: Array<{ question_id: string; option_id: string }> = questionIds.length
    ? (await supabase.from("correct_options").select("question_id,option_id").in("question_id", questionIds)).data ?? []
    : [];

  const correctByQuestion = new Map<string, string>();
  correct.forEach((c) => correctByQuestion.set(c.question_id, c.option_id));

  const optionsByQuestion = new Map<string, Array<{ id: string; question_id: string; text: string; position: number }>>();
  options.forEach((o) => {
    const arr = optionsByQuestion.get(o.question_id) ?? [];
    arr.push(o);
    optionsByQuestion.set(o.question_id, arr);
  });

  return (
    <div>
      <PageHeader
        title={t("admin.testDetail.title")}
        description={test.title}
        actions={
          <Link href="/admin/tests">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("admin.testDetail.backToTests")}
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600">{decodeURIComponent(error)}</p>
        </div>
      )}

      {reset === "success" && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-emerald-700 font-medium">{t("admin.testDetail.resetSuccess")}</p>
        </div>
      )}

      {/* Test Settings */}
      <Card variant="bordered" padding="lg" className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{t("admin.testDetail.settings")}</h2>
            <p className="text-sm text-slate-600 mt-1">{t("admin.testDetail.settingsDesc")}</p>
          </div>
          {test.published ? (
            <Badge variant="success">{t("admin.tests.published")}</Badge>
          ) : (
            <Badge variant="default">{t("admin.tests.draft")}</Badge>
          )}
        </div>

        <form action={updateTestAction} className="space-y-4">
          <input type="hidden" name="test_id" value={test.id} />
          <Input name="title" label={t("common.testName")} defaultValue={test.title} required />
          <Textarea name="description" label={t("common.description")} defaultValue={test.description ?? ""} rows={3} helperText={t("common.descriptionPlaceholder")} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="time_limit_seconds" type="number" label={t("common.timeLimit")} min={1} defaultValue={test.time_limit_seconds} required />
            <Input name="max_attempts" type="number" label={t("common.maxAttempts")} min={1} defaultValue={test.max_attempts} required />
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <input id="published" name="published" type="checkbox" defaultChecked={test.published}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
            <div>
              <label htmlFor="published" className="font-medium text-slate-900 cursor-pointer">
                {t("admin.testDetail.publishLabel")}
              </label>
              <p className="text-sm text-slate-600">{t("admin.testDetail.publishDesc")}</p>
            </div>
          </div>
          <Button type="submit" variant="primary" size="lg">{t("common.save")}</Button>
        </form>
      </Card>

      {/* Excel Import */}
      <ExcelImport testId={testId} />

      {/* Questions Section */}
      <Card variant="bordered" padding="lg">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{t("admin.testDetail.questions")}</h2>
              <p className="text-sm text-slate-600 mt-1">
                {questions?.length || 0} {t("admin.testDetail.questionsCreated")}
              </p>
            </div>
          </div>
          <AddQuestionForm testId={testId} />
        </div>

        <div className="space-y-4">
          {(questions ?? []).map((q, qIndex) => {
            const qOptions = optionsByQuestion.get(q.id) ?? [];
            const selected = correctByQuestion.get(q.id) ?? null;

            return (
              <Card key={q.id} variant="elevated" padding="lg">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold shrink-0">
                      {qIndex + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-slate-500">{q.position + 1}{t("admin.testDetail.question")}</span>
                        <Badge
                          variant={q.question_type === "open_answer" ? "default" : "info"}
                          size="sm"
                        >
                          {q.question_type === "open_answer"
                            ? t("admin.testDetail.openAnswer")
                            : t("admin.testDetail.multipleChoice")}
                        </Badge>
                      </div>
                      <div className="text-lg font-medium text-slate-900">{q.prompt}</div>
                    </div>
                  </div>
                  <form action={deleteQuestionAction}>
                    <input type="hidden" name="test_id" value={test.id} />
                    <input type="hidden" name="question_id" value={q.id} />
                    <Button type="submit" variant="danger" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </form>
                </div>

                {q.question_type === "open_answer" ? (
                  /* Open-answer question: show correct answer text editor */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900">{t("admin.testDetail.correctAnswerText")}</h4>
                      {q.correct_answer_text && (
                        <Badge variant="success" size="sm">{t("admin.testDetail.correctMarked")}</Badge>
                      )}
                    </div>
                    {q.correct_answer_text && (
                      <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                        <p className="text-sm text-purple-900">{q.correct_answer_text}</p>
                      </div>
                    )}
                    <form action={setCorrectAnswerTextAction} className="flex gap-2">
                      <input type="hidden" name="test_id" value={test.id} />
                      <input type="hidden" name="question_id" value={q.id} />
                      <input
                        name="correct_answer_text"
                        defaultValue={q.correct_answer_text ?? ""}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder={t("admin.testDetail.correctAnswerPlaceholder")}
                        required
                      />
                      <Button type="submit" variant="secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t("admin.testDetail.setCorrectText")}
                      </Button>
                    </form>
                  </div>
                ) : (
                  /* Multiple-choice question: show options */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900">{t("admin.testDetail.options")}</h4>
                      {selected && (
                        <Badge variant="success" size="sm">{t("admin.testDetail.correctMarked")}</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      {qOptions.map((o, oIndex) => (
                        <div key={o.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          selected === o.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"
                        }`}>
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600 shrink-0">
                            {String.fromCharCode(65 + oIndex)}
                          </div>
                          <div className="flex-1 text-slate-900">{o.text}</div>
                          <div className="flex items-center gap-2">
                            <form action={setCorrectOptionAction}>
                              <input type="hidden" name="test_id" value={test.id} />
                              <input type="hidden" name="question_id" value={q.id} />
                              <input type="hidden" name="option_id" value={o.id} />
                              <Button type="submit" variant={selected === o.id ? "primary" : "outline"} size="sm">
                                {selected === o.id ? (
                                  <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t("admin.testDetail.correct")}
                                  </>
                                ) : t("admin.testDetail.setCorrect")}
                              </Button>
                            </form>
                            <form action={deleteOptionAction}>
                              <input type="hidden" name="test_id" value={test.id} />
                              <input type="hidden" name="option_id" value={o.id} />
                              <Button type="submit" variant="ghost" size="sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </Button>
                            </form>
                          </div>
                        </div>
                      ))}

                      {qOptions.length === 0 && (
                        <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                          <svg className="w-8 h-8 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm">{t("admin.testDetail.noOptions")}</p>
                        </div>
                      )}
                    </div>

                    <form action={addOptionAction} className="flex gap-2 mt-4">
                      <input type="hidden" name="test_id" value={test.id} />
                      <input type="hidden" name="question_id" value={q.id} />
                      <input name="text"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm bg-white text-slate-900 placeholder:text-slate-400"
                        placeholder={t("admin.testDetail.optionPlaceholder")} required />
                      <Button type="submit" variant="secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t("admin.testDetail.addOption")}
                      </Button>
                    </form>
                  </div>
                )}
              </Card>
            );
          })}

          {(!questions || questions.length === 0) && (
            <Card variant="bordered" padding="lg">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("admin.testDetail.noQuestions")}</h3>
                <p className="text-slate-600">{t("admin.testDetail.noQuestionsHint")}</p>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card variant="bordered" padding="lg" className="mt-6 border-red-200">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-red-700 mb-1">{t("admin.testDetail.dangerZone")}</h2>
            <p className="text-sm text-slate-600">{t("admin.testDetail.resetAttemptsDesc")}</p>
          </div>
          <ResetAttemptsButton testId={test.id} resetAction={resetAttemptsAction} />
        </div>
      </Card>
    </div>
  );
}
