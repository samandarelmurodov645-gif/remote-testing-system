import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout";
import { Card, Badge } from "@/components/ui";
import { getServerT } from "@/lib/i18n";

export default async function AdminResultsPage() {
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: attempts } = await supabase
    .from("attempts")
    .select("id,student_id,test_id,status,score,started_at,finished_at")
    .order("started_at", { ascending: false })
    .limit(200);

  const testIds = Array.from(new Set((attempts ?? []).map((a) => a.test_id)));
  const studentIds = Array.from(new Set((attempts ?? []).map((a) => a.student_id)));

  const tests: Array<{ id: string; title: string }> = testIds.length
    ? (await supabase.from("tests").select("id,title").in("id", testIds)).data ?? []
    : [];

  const students: Array<{ user_id: string; email: string | null; full_name: string | null }> =
    studentIds.length
      ? (await supabase.from("profiles").select("user_id,email,full_name").in("user_id", studentIds)).data ?? []
      : [];

  const testTitle = new Map<string, string>();
  tests.forEach((t) => testTitle.set(t.id, t.title));

  const studentLabel = new Map<string, string>();
  students.forEach((s) => studentLabel.set(s.user_id, s.full_name || s.email || s.user_id.slice(0, 8)));

  const completed = (attempts ?? []).filter((a) => a.status === "submitted" || a.status === "expired").length;
  const inProgress = (attempts ?? []).filter((a) => a.status === "in_progress").length;
  const avgScore =
    completed > 0
      ? Math.round(
          (attempts ?? [])
            .filter((a) => a.score !== null)
            .reduce((sum, a) => sum + (a.score ?? 0), 0) / completed
        )
      : 0;

  return (
    <div>
      <PageHeader title={t("admin.results.title")} description={t("admin.results.desc")} />

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: t("attempt.completed"), value: completed, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: t("attempt.inProgress"), value: inProgress, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Avg Score", value: avgScore, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Total", value: attempts?.length ?? 0, color: "text-slate-700", bg: "bg-slate-50" },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-4 border border-white`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-600 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">{t("admin.results.last200")}</p>
      </div>

      <Card variant="bordered" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.results.student")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.results.test")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.results.status")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.results.score")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.results.started")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.results.finished")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(attempts ?? []).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    {studentLabel.get(a.student_id) ?? a.student_id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-slate-700 text-sm">
                    {testTitle.get(a.test_id) ?? a.test_id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    {a.status === "submitted" && <Badge variant="success" size="sm">{t("attempt.completed")}</Badge>}
                    {a.status === "in_progress" && <Badge variant="warning" size="sm">{t("attempt.inProgress")}</Badge>}
                    {a.status === "expired" && <Badge variant="danger" size="sm">{t("attempt.expired")}</Badge>}
                  </td>
                  <td className="px-6 py-4">
                    {a.score !== null ? (
                      <span className="font-bold text-slate-900 text-lg">{a.score}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {new Date(a.started_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {a.finished_at ? new Date(a.finished_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {(!attempts || attempts.length === 0) && (
                <tr>
                  <td className="px-6 py-12 text-center text-slate-500" colSpan={6}>
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="font-medium">{t("admin.results.noResults")}</p>
                      <p className="text-sm mt-1">{t("admin.results.noResultsHint")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
