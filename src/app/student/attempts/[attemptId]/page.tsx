import Link from "next/link";
import { redirect } from "next/navigation";
import AttemptRunner from "./AttemptRunner";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServerT, getLang } from "@/lib/i18n";
import { Button, Card } from "@/components/ui";

export default async function StudentAttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const supabase = await createSupabaseServerClient();
  const [t, lang] = await Promise.all([getServerT(), getLang()]);

  const { data: attempt } = await supabase
    .from("attempts")
    .select("id,test_id,status,started_at")
    .eq("id", attemptId)
    .maybeSingle();

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card variant="bordered" padding="lg">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">{t("student.testDetail.notFound")}</h2>
            <p className="text-slate-600 mb-6">{t("student.testDetail.notFoundDesc")}</p>
            <Link href="/student/tests">
              <Button variant="primary">{t("student.testDetail.backToTests")}</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (attempt.status !== "in_progress") {
    redirect(`/student/attempts/${attemptId}/result`);
  }

  const { data: test } = await supabase
    .from("tests")
    .select("id,title,time_limit_seconds")
    .eq("id", attempt.test_id)
    .single();

  if (!test) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card variant="bordered" padding="lg">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">{t("student.testDetail.notFound")}</h2>
            <Link href="/student/tests">
              <Button variant="primary">{t("student.testDetail.backToTests")}</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  type QRowFull = {
    id: string; prompt: string; position: number;
    question_text_ru: string | null; question_text_en: string | null; question_text_fr: string | null;
  };
  type ORowFull = {
    id: string; question_id: string; text: string; position: number;
    option_text_ru: string | null; option_text_en: string | null; option_text_fr: string | null;
  };

  // Try to fetch with translation columns; fall back if the migration hasn't been run yet.
  const { data: questionsRaw, error: qErr } = await supabase
    .from("questions")
    .select("id,prompt,question_text_ru,question_text_en,question_text_fr,position")
    .eq("test_id", attempt.test_id)
    .order("position", { ascending: true });

  let questions: QRowFull[];
  if (qErr) {
    const { data: fallback } = await supabase
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

  let options: ORowFull[] = [];
  if (questionIds.length) {
    const { data: optionsRaw, error: oErr } = await supabase
      .from("options")
      .select("id,question_id,text,option_text_ru,option_text_en,option_text_fr,position")
      .in("question_id", questionIds)
      .order("position", { ascending: true });
    if (oErr) {
      const { data: fallback } = await supabase
        .from("options")
        .select("id,question_id,text,position")
        .in("question_id", questionIds)
        .order("position", { ascending: true });
      options = (fallback ?? []).map((o) => ({
        ...o,
        option_text_ru: null,
        option_text_en: null,
        option_text_fr: null,
      }));
    } else {
      options = (optionsRaw ?? []) as ORowFull[];
    }
  }

  const optionsByQuestion = new Map<string, typeof options>();
  options.forEach((o) => {
    const arr = optionsByQuestion.get(o.question_id) ?? [];
    arr.push(o);
    optionsByQuestion.set(o.question_id, arr);
  });

  type QRow = { prompt: string; question_text_ru: string | null; question_text_en: string | null; question_text_fr: string | null };
  type ORow = { text: string; option_text_ru: string | null; option_text_en: string | null; option_text_fr: string | null };

  const localizeQ = (q: QRow) => {
    if (lang === "ru") return q.question_text_ru ?? q.prompt;
    if (lang === "en") return q.question_text_en ?? q.prompt;
    if (lang === "fr") return q.question_text_fr ?? q.prompt;
    return q.prompt;
  };

  const localizeO = (o: ORow) => {
    if (lang === "ru") return o.option_text_ru ?? o.text;
    if (lang === "en") return o.option_text_en ?? o.text;
    if (lang === "fr") return o.option_text_fr ?? o.text;
    return o.text;
  };

  const runnerQuestions = (questions ?? []).map((q) => ({
    id: q.id,
    prompt: localizeQ(q),
    options: (optionsByQuestion.get(q.id) ?? []).map((o) => ({
      id: o.id,
      text: localizeO(o),
    })),
  }));

  return (
    <div className="space-y-4">
      <AttemptRunner
        attemptId={attempt.id}
        testTitle={test.title}
        startedAt={attempt.started_at}
        timeLimitSeconds={test.time_limit_seconds}
        questions={runnerQuestions}
      />
    </div>
  );
}
