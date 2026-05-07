import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { getServerT } from "@/lib/i18n";

function getDifficultyFromTime(seconds: number) {
  if (seconds <= 300) return "hard";
  if (seconds <= 600) return "medium";
  return "easy";
}

export default async function StudentTestsPage() {
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: tests } = await supabase
    .from("tests")
    .select("id,title,description,time_limit_seconds,max_attempts")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const difficultyConfig = {
    easy: { label: t("student.tests.difficulty.easy"), class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    medium: { label: t("student.tests.difficulty.medium"), class: "bg-amber-100 text-amber-700 border-amber-200" },
    hard: { label: t("student.tests.difficulty.hard"), class: "bg-red-100 text-red-700 border-red-200" },
  };

  return (
    <div>
      <PageHeader
        title={t("student.tests.title")}
        description={t("student.tests.desc")}
      />

      {/* Tests Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(tests ?? []).map((test) => {
          const difficulty = getDifficultyFromTime(test.time_limit_seconds);
          const diff = difficultyConfig[difficulty];

          return (
            <Link key={test.id} href={`/student/tests/${test.id}`} className="group block">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-hover h-full flex flex-col">
                {/* Card top gradient bar */}
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />

                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${diff.class} shrink-0`}>
                      {diff.label}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {test.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                    {test.description || t("common.free")}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 mb-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{Math.round(test.time_limit_seconds / 60)} {t("common.minutes")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-sm font-medium">{test.max_attempts}x</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-2">
                    <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 text-slate-700 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">
                      {t("student.tests.details")}
                    </span>
                    <span className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-indigo-600 text-white group-hover:bg-indigo-700 transition-colors shadow-sm">
                      {t("student.tests.start")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {(!tests || tests.length === 0) && (
          <div className="col-span-full">
            <Card variant="bordered" padding="lg">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("student.tests.noTests")}</h3>
                <p className="text-slate-600">{t("student.tests.noTestsHint")}</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
