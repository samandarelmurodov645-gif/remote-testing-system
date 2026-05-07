import { getWeeklyLeaderboardAction } from "./actions";
import WeeklyExamRunner from "./WeeklyExamRunner";
import { getServerT } from "@/lib/i18n";

export default async function WeeklyExamPage() {
  const [leaderboard, t] = await Promise.all([
    getWeeklyLeaderboardAction(),
    getServerT(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t("weekly.title")}</h1>
        <p className="text-slate-600 mt-1">{t("weekly.subtitle")}</p>
      </div>
      <WeeklyExamRunner leaderboard={leaderboard} />
    </div>
  );
}
