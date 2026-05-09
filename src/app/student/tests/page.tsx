import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, Button } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { getServerT } from "@/lib/i18n";
import { SUBJECTS, SUBJECT_EMOJI, SUBJECT_GRADIENT } from "@/lib/subjects";

function getDifficultyFromTime(seconds: number) {
  if (seconds <= 300) return "hard";
  if (seconds <= 600) return "medium";
  return "easy";
}

export default async function StudentTestsPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject: selectedSubject } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: tests } = await supabase
    .from("tests")
    .select("id,title,description,time_limit_seconds,max_attempts,subject")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const allTests = tests ?? [];

  const difficultyConfig = {
    easy: { label: t("student.tests.difficulty.easy"), class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    medium: { label: t("student.tests.difficulty.medium"), class: "bg-amber-100 text-amber-700 border-amber-200" },
    hard: { label: t("student.tests.difficulty.hard"), class: "bg-red-100 text-red-700 border-red-200" },
  };

  // ── Subject filtered view ──────────────────────────────────────────────────
  if (selectedSubject) {
    const filteredTests = allTests.filter(
      (test) => (test.subject ?? "General") === selectedSubject
    );
    const gradient = SUBJECT_GRADIENT[selectedSubject] ?? "from-indigo-500 to-purple-600";
    const emoji = SUBJECT_EMOJI[selectedSubject] ?? "📝";

    return (
      <div>
        {/* Back button */}
        <div className="mb-6">
          <Link href="/student/tests">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("subject.backToSubjects")}
            </Button>
          </Link>
        </div>

        {/* Subject header */}
        <div className="flex items-center gap-4 mb-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md shrink-0`}>
            <span className="text-3xl">{emoji}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t(`subject.${selectedSubject}`)}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {filteredTests.length} {t("subject.testsCount")}
            </p>
          </div>
        </div>

        {/* Tests grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => {
            const difficulty = getDifficultyFromTime(test.time_limit_seconds);
            const diff = difficultyConfig[difficulty];

            return (
              <Link key={test.id} href={`/student/tests/${test.id}`} className="group block">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden card-hover h-full flex flex-col">
                  <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl">{emoji}</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${diff.class} shrink-0`}>
                        {diff.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">
                      {test.description || t("common.free")}
                    </p>
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
                    <div className="flex gap-2">
                      <span className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-indigo-600 text-white group-hover:bg-indigo-700 transition-colors shadow-sm">
                        {t("student.tests.start")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {filteredTests.length === 0 && (
            <div className="col-span-full">
              <Card variant="bordered" padding="lg">
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">{emoji}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("subject.noTests")}</h3>
                  <p className="text-slate-600 mb-6">{t("student.tests.noTestsHint")}</p>
                  <Link href="/student/tests">
                    <Button variant="outline">{t("subject.backToSubjects")}</Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Subject cards (home view) ──────────────────────────────────────────────
  const subjectCounts = new Map<string, number>();
  allTests.forEach((test) => {
    const subj = test.subject ?? "General";
    subjectCounts.set(subj, (subjectCounts.get(subj) ?? 0) + 1);
  });

  // Order by SUBJECTS list, only show subjects that have at least 1 test
  const activeSubjects = SUBJECTS.filter((s) => subjectCounts.has(s));

  // Subjects not in the list (shouldn't normally happen but handle gracefully)
  const extraSubjects = Array.from(subjectCounts.keys()).filter(
    (s) => !SUBJECTS.includes(s as (typeof SUBJECTS)[number])
  );

  const allActiveSubjects = [...activeSubjects, ...extraSubjects];

  return (
    <div>
      <PageHeader
        title={t("student.tests.title")}
        description={t("student.tests.desc")}
      />

      {allActiveSubjects.length === 0 ? (
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
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allActiveSubjects.map((subject) => {
            const count = subjectCounts.get(subject) ?? 0;
            const gradient = SUBJECT_GRADIENT[subject] ?? "from-indigo-500 to-purple-600";
            const emoji = SUBJECT_EMOJI[subject] ?? "📝";

            return (
              <Link
                key={subject}
                href={`/student/tests?subject=${encodeURIComponent(subject)}`}
                className="group block"
              >
                <div className="relative bg-white border-2 border-slate-200 rounded-2xl overflow-hidden card-hover h-full flex flex-col items-center text-center p-6 group-hover:border-indigo-200 transition-colors">
                  {/* Top gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

                  {/* Emoji icon */}
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform mt-2`}
                  >
                    <span className="text-4xl">{emoji}</span>
                  </div>

                  {/* Subject name */}
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {t(`subject.${subject}`)}
                  </h3>

                  {/* Count */}
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient} text-white shadow-sm`}>
                    {count} {t("subject.testsCount")}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
