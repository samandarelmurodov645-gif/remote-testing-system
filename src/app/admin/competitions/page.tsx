import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCompetitionAction, deleteCompetitionAction } from "./actions";
import { PageHeader } from "@/components/layout";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { CompetitionStatusBadge } from "@/components/competitions";
import { DeleteButton } from "./DeleteButton";
import { getServerT } from "@/lib/i18n";
import { CompetitionExcelUpload } from "./CompetitionExcelUpload";

export default async function AdminCompetitionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const { data: competitions } = await supabase
    .from("competitions")
    .select(
      `
      id,
      title,
      description,
      start_time,
      end_time,
      published,
      max_participants,
      created_at,
      test:tests(id, title),
      participant_count:competition_participants(count)
    `
    )
    .order("start_time", { ascending: false });

  const { data: tests } = await supabase
    .from("tests")
    .select("id, title")
    .eq("published", true)
    .order("title");

  return (
    <div>
      <PageHeader
        title={t("comp.title")}
        description={t("comp.desc")}
      />

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600">{decodeURIComponent(error)}</p>
        </div>
      )}

      <CompetitionExcelUpload />

      <Card variant="bordered" padding="lg" className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {t("comp.admin.createTitle")}
        </h2>
        <form action={createCompetitionAction} className="space-y-4">
          <Input
            name="title"
            label={t("comp.admin.name")}
            placeholder={t("comp.admin.namePlaceholder")}
            required
          />

          <Textarea
            name="description"
            label={t("common.description")}
            placeholder={t("comp.admin.descPlaceholder")}
            rows={3}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="start_date"
              type="datetime-local"
              label={t("comp.admin.startDate")}
              required
            />
            <Input
              name="end_date"
              type="datetime-local"
              label={t("comp.admin.endDate")}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("comp.admin.testLabel")} <span className="text-red-500">*</span>
              </label>
              <select
                name="test_id"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">{t("comp.admin.testPlaceholder")}</option>
                {tests?.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.title}
                  </option>
                ))}
              </select>
            </div>

            <Input
              name="max_participants"
              type="number"
              label={t("comp.admin.maxParticipants")}
              placeholder={t("comp.admin.unlimited")}
              min={1}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              name="published"
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="published" className="text-sm text-slate-700">
              {t("comp.admin.visibility")}
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg">
            {t("comp.admin.createBtn")}
          </Button>
        </form>
      </Card>

      <Card variant="bordered" padding="none">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {t("comp.admin.allTitle")}
          </h2>
          <p className="text-slate-600 mt-1">{t("comp.admin.allDesc")}</p>
        </div>

        {!competitions || competitions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("comp.admin.empty")}</h3>
            <p className="text-slate-600">{t("comp.admin.emptyHint")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    {t("admin.tests.name")}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    {t("comp.admin.testLabel")}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    {t("admin.tests.status")}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    {t("comp.admin.colParticipants")}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                    {t("comp.admin.colDates")}
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                    {t("comp.admin.colActions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {competitions.map((competition) => {
                  const participantCount = competition.participant_count?.[0]?.count || 0;

                  return (
                    <tr key={competition.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-slate-900">{competition.title}</div>
                          {!competition.published && (
                            <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-700">
                              {t("comp.admin.hidden")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {Array.isArray(competition.test)
                          ? competition.test[0]?.title
                          : (competition.test as { title?: string })?.title}
                      </td>
                      <td className="px-6 py-4">
                        <CompetitionStatusBadge
                          startTime={competition.start_time}
                          endTime={competition.end_time}
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {participantCount}
                        {competition.max_participants && ` / ${competition.max_participants}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>
                          {new Date(competition.start_time).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </div>
                        <div className="text-slate-500">
                          {new Date(competition.end_time).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/competitions/${competition.id}`}>
                            <Button variant="outline" size="sm">
                              {t("comp.admin.viewBtn")}
                            </Button>
                          </Link>
                          <DeleteButton
                            competitionId={competition.id}
                            deleteAction={deleteCompetitionAction}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
