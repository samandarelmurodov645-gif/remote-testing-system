import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createTestAction, deleteTestAction } from "./actions";
import { PageHeader } from "@/components/layout";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui";
import { getServerT } from "@/lib/i18n";
import { ExcelUploadAndCreate } from "./ExcelUploadAndCreate";
import { SUBJECTS, SUBJECT_EMOJI } from "@/lib/subjects";

export default async function AdminTestsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: tests } = await supabase
    .from("tests")
    .select("id,title,published,time_limit_seconds,max_attempts,subject,created_at")
    .order("created_at", { ascending: false });

  // Stats
  const [{ count: studentCount }, { count: weeklyAttempts }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase
        .from("attempts")
        .select("*", { count: "exact", head: true })
        .gte(
          "started_at",
          (() => {
            const now = new Date();
            const day = now.getDay() === 0 ? 7 : now.getDay();
            const monday = new Date(now);
            monday.setDate(now.getDate() - (day - 1));
            monday.setHours(0, 0, 0, 0);
            return monday.toISOString();
          })()
        ),
    ]);

  const totalTests = tests?.length ?? 0;

  const stats = [
    {
      label: t("stats.totalTests"),
      value: totalTests,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
    {
      label: t("stats.totalStudents"),
      value: studentCount ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: t("stats.weeklyAttempts"),
      value: weeklyAttempts ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("admin.tests.title")}
        description={t("admin.tests.desc")}
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-5 border border-white shadow-sm card-hover`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-md`}>
                {s.icon}
              </div>
            </div>
            <div className={`text-3xl font-bold ${s.text} mb-1`}>{s.value}</div>
            <div className="text-sm text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600">{decodeURIComponent(error)}</p>
        </div>
      )}

      {/* Excel Upload & Create */}
      <ExcelUploadAndCreate />

      {/* Create Test Form */}
      <Card variant="bordered" padding="lg" className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">{t("admin.tests.createNew")}</h2>
        <form action={createTestAction} className="space-y-4">
          <Input name="title" label={t("common.testName")} placeholder={t("common.testNamePlaceholder")} required />
          <Textarea name="description" label={t("common.description")} placeholder={t("common.descriptionPlaceholder")} rows={3} />
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t("subject.label")} <span className="text-red-500">*</span>
            </label>
            <select
              name="subject"
              defaultValue="General"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white text-slate-900"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {SUBJECT_EMOJI[s]} {t(`subject.${s}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="time_limit_seconds" type="number" label={t("common.timeLimit")} placeholder="600" min={1} defaultValue={600} required />
            <Input name="max_attempts" type="number" label={t("common.maxAttempts")} placeholder="1" min={1} defaultValue={1} required />
          </div>
          <Button type="submit" variant="primary" size="lg">{t("common.createTest")}</Button>
        </form>
      </Card>

      {/* Tests List */}
      <Card variant="bordered" padding="none">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">{t("admin.tests.existing")}</h2>
          <p className="text-slate-600 mt-1">{t("admin.tests.manage")}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.tests.name")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("subject.label")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.tests.status")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.tests.timeLimit")}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.tests.maxAttempts")}</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">{t("admin.tests.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(tests ?? []).map((test) => (
                <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline" href={`/admin/tests/${test.id}`}>
                      {test.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">
                    {SUBJECT_EMOJI[test.subject ?? "General"]} {t(`subject.${test.subject ?? "General"}`)}
                  </td>
                  <td className="px-6 py-4">
                    {test.published ? (
                      <Badge variant="success" size="sm">{t("admin.tests.published")}</Badge>
                    ) : (
                      <Badge variant="default" size="sm">{t("admin.tests.draft")}</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{test.time_limit_seconds}s</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{test.max_attempts}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/tests/${test.id}`}>
                        <Button variant="outline" size="sm">{t("common.edit")}</Button>
                      </Link>
                      <form action={deleteTestAction}>
                        <input type="hidden" name="test_id" value={test.id} />
                        <Button type="submit" variant="danger" size="sm">{t("common.delete")}</Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!tests || tests.length === 0) && (
                <tr>
                  <td className="px-6 py-12 text-center text-slate-500" colSpan={6}>
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="font-medium">{t("admin.tests.noTests")}</p>
                      <p className="text-sm mt-1">{t("admin.tests.noTestsHint")}</p>
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
