import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { getServerT } from "@/lib/i18n";

export default async function StudentResultsPage() {
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: attempts } = await supabase
    .from("attempts")
    .select("id,test_id,status,score,started_at,finished_at")
    .order("started_at", { ascending: false });

  const testIds = Array.from(new Set((attempts ?? []).map((a) => a.test_id)));
  const tests: Array<{ id: string; title: string }> = testIds.length
    ? (await supabase.from("tests").select("id,title").in("id", testIds)).data ?? []
    : [];

  const titleById = new Map<string, string>();
  tests.forEach((t) => titleById.set(t.id, t.title));

  const completedCount = (attempts ?? []).filter((a) => a.status === "submitted" || a.status === "expired").length;
  const scoredAttempts = (attempts ?? []).filter((a) => a.score !== null);
  const avgScore =
    scoredAttempts.length > 0
      ? Math.round(scoredAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / scoredAttempts.length)
      : null;

  return (
    <div>
      <PageHeader
        title={t("student.results.title")}
        description={t("student.results.desc")}
        actions={
          <Link href="/student/tests">
            <Button variant="outline">{t("student.results.backToTests")}</Button>
          </Link>
        }
      />

      {/* Summary stats */}
      {completedCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="text-2xl font-bold text-indigo-600">{completedCount}</div>
            <div className="text-xs text-slate-600 mt-0.5">{t("attempt.completed")}</div>
          </div>
          {avgScore !== null && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-600">{avgScore}</div>
              <div className="text-xs text-slate-600 mt-0.5">{t("student.results.avgScore")}</div>
            </div>
          )}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-700">{attempts?.length ?? 0}</div>
            <div className="text-xs text-slate-600 mt-0.5">{t("student.results.total")}</div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {(attempts ?? []).map((a) => {
          const scorePercent =
            a.score !== null ? Math.min(100, Math.round(a.score)) : null;

          return (
            <Card
              key={a.id}
              variant="bordered"
              padding="lg"
              className="card-hover"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
                    {titleById.get(a.test_id) ?? a.test_id.slice(0, 12)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span>{new Date(a.started_at).toLocaleString()}</span>
                    <span className="text-slate-300">•</span>
                    {(a.status === "submitted" || a.status === "expired") && (
                      <Badge variant="success" size="sm">{t("attempt.completed")}</Badge>
                    )}
                    {a.status === "in_progress" && (
                      <Badge variant="warning" size="sm">{t("attempt.inProgress")}</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {a.score !== null && (
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15.5" fill="none"
                          stroke="#4f46e5" strokeWidth="3"
                          strokeDasharray={`${(scorePercent ?? 0) * 0.974} 97.4`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-900">{a.score}</span>
                      </div>
                    </div>
                  )}
                  {a.status === "in_progress" && (
                    <Link href={`/student/attempts/${a.id}`}>
                      <Button variant="primary" size="sm">{t("student.results.continue")}</Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {(!attempts || attempts.length === 0) && (
          <Card variant="bordered" padding="lg">
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("student.results.noAttempts")}</h3>
              <p className="text-slate-600 mb-6">{t("student.results.noAttemptsHint")}</p>
              <Link href="/student/tests">
                <Button variant="primary">{t("student.results.viewTests")}</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
