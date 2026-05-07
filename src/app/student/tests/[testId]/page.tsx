import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { startAttemptAction } from "./actions";
import { Button, Card } from "@/components/ui";
import { getServerT } from "@/lib/i18n";

export default async function StudentTestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { testId } = await params;
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: test } = await supabase
    .from("tests")
    .select("id,title,description,time_limit_seconds,max_attempts,published")
    .eq("id", testId)
    .maybeSingle();

  if (!test || !test.published) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card variant="bordered" padding="lg">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
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

  const { data: questions } = await supabase.from("questions").select("id").eq("test_id", testId);
  const questionCount = questions?.length ?? 0;
  const minutes = Math.round(test.time_limit_seconds / 60);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/student/tests">
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("student.testDetail.backToTests")}
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600">{decodeURIComponent(error)}</p>
        </div>
      )}

      <Card variant="elevated" padding="lg">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{test.title}</h1>
            {test.description && (
              <p className="text-slate-600 leading-relaxed">{test.description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-5 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-xl mb-6 border border-slate-100">
          {[
            { value: questionCount, label: t("student.testDetail.questions") },
            { value: minutes, label: t("student.testDetail.minutes") },
            { value: test.max_attempts, label: t("student.testDetail.maxAttempts") },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{s.value}</div>
              <div className="text-sm text-slate-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t("student.testDetail.beforeStart")}
          </h3>
          <ul className="text-sm text-blue-800 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              {t("student.testDetail.checkConnection")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              {t("student.testDetail.timeWarning").replace("%d", String(minutes))}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              {t("student.testDetail.autoSave")}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              {t("student.testDetail.attemptsInfo").replace("%d", String(test.max_attempts))}
            </li>
          </ul>
        </div>

        <form action={startAttemptAction}>
          <input type="hidden" name="test_id" value={test.id} />
          <Button type="submit" variant="primary" size="lg" fullWidth>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t("student.testDetail.start")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
