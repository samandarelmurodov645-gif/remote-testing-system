"use client";

import { Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  score: number;
  timeTaken: number; // in seconds
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  maxScore: number;
}

export function LeaderboardTable({ entries, maxScore }: LeaderboardTableProps) {
  const { t } = useLanguage();

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  if (entries.length === 0) {
    return (
      <Card variant="bordered" padding="lg">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{t("comp.leaderboard.empty")}</h3>
          <p className="text-slate-600">{t("comp.leaderboard.emptyDesc")}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="bordered" padding="none">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("comp.rank")}</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("comp.participant")}</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("comp.score")}</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">{t("comp.timeTaken")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {entries.map((entry) => (
              <tr
                key={`${entry.rank}-${entry.studentName}`}
                className={`transition-colors ${
                  entry.isCurrentUser ? "bg-indigo-50 hover:bg-indigo-100" : "hover:bg-slate-50"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getMedalIcon(entry.rank)}
                    <span className={`text-lg font-bold ${entry.rank <= 3 ? "text-indigo-600" : "text-slate-900"}`}>
                      {entry.rank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${entry.isCurrentUser ? "text-indigo-900" : "text-slate-900"}`}>
                    {entry.studentName}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs px-2 py-1 rounded-full bg-indigo-200 text-indigo-800">
                        {t("comp.you")}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-900">{entry.score}</span>
                  <span className="text-slate-500"> / {maxScore}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{formatTime(entry.timeTaken)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
