import Link from "next/link";
import { redirect } from "next/navigation";
import AttemptRunner from "./AttemptRunner";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n";
import { Button, Card } from "@/components/ui";

export default async function StudentAttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

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

  const { data: questions } = await supabase
    .from("questions")
    .select("id,prompt,position")
    .eq("test_id", attempt.test_id)
    .order("position", { ascending: true });

  const questionIds = (questions ?? []).map((q) => q.id);
  const options: Array<{
    id: string;
    question_id: string;
    text: string;
    position: number;
  }> = questionIds.length
    ? (
        await supabase
          .from("options")
          .select("id,question_id,text,position")
          .in("question_id", questionIds)
          .order("position", { ascending: true })
      ).data ?? []
    : [];

  const optionsByQuestion = new Map<
    string,
    Array<{ id: string; question_id: string; text: string; position: number }>
  >();
  options.forEach((o) => {
    const arr = optionsByQuestion.get(o.question_id) ?? [];
    arr.push(o);
    optionsByQuestion.set(o.question_id, arr);
  });

  const runnerQuestions = (questions ?? []).map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: (optionsByQuestion.get(q.id) ?? []).map((o) => ({
      id: o.id,
      text: o.text,
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
