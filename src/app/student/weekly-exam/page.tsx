import { getWeeklyLeaderboardAction } from "./actions";
import WeeklyExamRunner from "./WeeklyExamRunner";
import { getServerT } from "@/lib/i18n";
import { PageHeader } from "@/components/layout";

export default async function WeeklyExamPage() {
  const [leaderboard, t] = await Promise.all([
    getWeeklyLeaderboardAction(),
    getServerT(),
  ]);

  return (
    <div>
      <PageHeader
        title={t("weekly.title")}
        description={t("weekly.subtitle")}
      />
      <WeeklyExamRunner leaderboard={leaderboard} />
    </div>
  );
}
