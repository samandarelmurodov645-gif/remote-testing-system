import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { getServerT } from "@/lib/i18n";

export default async function StudentResultsPage() {
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: attempts, error: attemptsError } = await supabase
    .from("attempts")
    .select("id,test_id,status,score,started_at,finished_at")
    .eq("student_id", userData.user.id)
    .order("started_at", { ascending: false });

  if (attemptsError) {
    console.error("Attempts query error:", attemptsError);
  }

  const rows = attempts ?? [];
  const testIds = Array.from(new Set(rows.map((a) => a.test_id)));

  let titleById = new Map<string, string>();
  let questionCountByTest = new Map<string, number>();

  if (testIds.length > 0) {
    const [{ data: tests }, { data: questionRows }] = await Promise.all([
      supabase.from("tests").select("id,title").in("id", testIds),
      supabase.from("questions").select("test_id").in("test_id", testIds),
    ]);

    (tests ?? []).forEach((t) => titleById.set(t.id, t.title));
    (questionRows ?? []).forEach((q) => {
      questionCountByTest.set(q.test_id, (questionCountByTest.get(q.test_id) ?? 0) + 1);
    });
  }

  function getScorePct(score: number | null, test_id: string): number | null {
    if (score === null) return null;
    const total = questionCountByTest.get(test_id) ?? 0;
    if (total === 0) return null;
    return Math.round((score / total) * 100);
  }

  const completedRows = rows.filter(
    (a) => a.status === "submitted" || a.status === "expired"
  );

  const pcts = completedRows
    .map((a) => getScorePct(a.score, a.test_id))
    .filter((p): p is number => p !== null);

  const avgScore =
    pcts.length > 0
      ? Math.round(pcts.reduce((s, p) => s + p, 0) / pcts.length)
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

      {completedRows.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="text-2xl font-bold text-indigo-600">{completedRows.length}</div>
            <div className="text-xs text-slate-600 mt-0.5">{t("attempt.completed")}</div>
          </div>
          {avgScore !== null && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-600">{avgScore}%</div>
              <div className="text-xs text-slate-600 mt-0.5">{t("student.results.avgScore")}</div>
            </div>
          )}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="text-2xl font-bold text-slate-700">{rows.length}</div>
            <div className="text-xs text-slate-600 mt-0.5">{t("student.results.total")}</div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {rows.length === 0 && (
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

        {rows.map((a) => {
          const pct = getScorePct(a.score, a.test_id);
          const isFinished = a.status === "submitted" || a.status === "expired";

          const card = (
            <Card variant="bordered" padding="lg" className={isFinished ? "card-hover" : ""}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
                    {titleById.get(a.test_id) ?? a.test_id.slice(0, 12) + "…"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>{new Date(a.started_at).toLocaleString()}</span>
                    <span className="text-slate-300">•</span>
                    {a.status === "submitted" && (
                      <Badge variant="success" size="sm">{t("attempt.completed")}</Badge>
                    )}
                    {a.status === "expired" && (
                      <Badge variant="danger" size="sm">{t("attempt.expired")}</Badge>
                    )}
                    {a.status === "in_progress" && (
                      <Badge variant="warning" size="sm">{t("attempt.inProgress")}</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {pct !== null && (
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15.5" fill="none"
                          stroke={pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="3"
                          strokeDasharray={`${pct * 0.974} 97.4`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-900">{pct}%</span>
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

          if (isFinished) {
            return (
              <Link key={a.id} href={`/student/attempts/${a.id}/result`} className="block">
                {card}
              </Link>
            );
          }

          return <div key={a.id}>{card}</div>;
        })}
      </div>
    </div>
  );
}
