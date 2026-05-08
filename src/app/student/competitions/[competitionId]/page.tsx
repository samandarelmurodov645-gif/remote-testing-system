import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { joinCompetitionAction } from "../actions";
import { Button, Card } from "@/components/ui";
import { JoinButton } from "./JoinButton";
import {
  CompetitionStatusBadge,
  getCompetitionStatus,
  LeaderboardTable,
  type LeaderboardEntry,
} from "@/components/competitions";
import { getServerT } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ competitionId: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function CompetitionDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { competitionId } = await params;
  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const t = await getServerT();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: competition } = await supabase
    .from("competitions")
    .select(
      `
      *,
      test:tests(
        id,
        title,
        description,
        time_limit_seconds,
        questions(count)
      )
    `
    )
    .eq("id", competitionId)
    .eq("published", true)
    .single();

  if (!competition) {
    notFound();
  }

  const { data: participation } = await supabase
    .from("competition_participants")
    .select("*")
    .eq("competition_id", competitionId)
    .eq("student_id", user.id)
    .single();

  const { data: participants } = await supabase
    .from("competition_participants")
    .select(
      `
      student_id,
      score,
      rank,
      time_taken,
      completed_at,
      profiles:student_id(full_name)
    `
    )
    .eq("competition_id", competitionId)
    .not("completed_at", "is", null)
    .order("rank", { ascending: true });

  const leaderboardEntries: LeaderboardEntry[] =
    participants?.map((p) => ({
      rank: p.rank || 0,
      studentName: Array.isArray(p.profiles)
        ? p.profiles[0]?.full_name || "Unknown"
        : (p.profiles as { full_name?: string })?.full_name || "Unknown",
      score: p.score || 0,
      timeTaken: p.time_taken || 0,
      isCurrentUser: p.student_id === user.id,
    })) || [];

  const { count: totalParticipants } = await supabase
    .from("competition_participants")
    .select("*", { count: "exact", head: true })
    .eq("competition_id", competitionId);

  const { data: previousAttempt } = await supabase
    .from("attempts")
    .select("id")
    .eq("test_id", competition.test_id)
    .eq("student_id", user.id)
    .in("status", ["submitted", "expired"])
    .maybeSingle();

  const testInfo = Array.isArray(competition.test)
    ? competition.test[0]
    : competition.test;
  const questionCount = testInfo?.questions?.[0]?.count || 0;
  const status = getCompetitionStatus(competition.start_time, competition.end_time);

  const hasPreviousAttempt = !!previousAttempt;
  const canJoin =
    status === "active" &&
    !participation &&
    !hasPreviousAttempt &&
    (!competition.max_participants ||
      (totalParticipants || 0) < competition.max_participants);

  const canStart = status === "active" && participation && !participation.completed_at;

  return (
    <div>
      <div className="mb-8">
        <Link href="/student/competitions">
          <Button variant="ghost" size="sm" className="mb-4">
            ← {t("comp.backToComps")}
          </Button>
        </Link>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {competition.title}
            </h1>
            <CompetitionStatusBadge
              startTime={competition.start_time}
              endTime={competition.end_time}
            />
          </div>
        </div>
        {competition.description && (
          <p className="text-slate-600 text-lg">{competition.description}</p>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600">{decodeURIComponent(error)}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="bordered" padding="lg">
          <p className="text-sm text-slate-600 mb-1">{t("comp.student.startLabel")}</p>
          <p className="font-semibold text-slate-900">
            {new Date(competition.start_time).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </Card>

        <Card variant="bordered" padding="lg">
          <p className="text-sm text-slate-600 mb-1">{t("comp.student.endLabel")}</p>
          <p className="font-semibold text-slate-900">
            {new Date(competition.end_time).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </Card>

        <Card variant="bordered" padding="lg">
          <p className="text-sm text-slate-600 mb-1">{t("comp.student.participantsLabel")}</p>
          <p className="font-semibold text-slate-900">
            {totalParticipants || 0}
            {competition.max_participants && ` / ${competition.max_participants}`}
          </p>
        </Card>

        <Card variant="bordered" padding="lg">
          <p className="text-sm text-slate-600 mb-1">{t("comp.student.questionsLabel")}</p>
          <p className="font-semibold text-slate-900">{questionCount}</p>
        </Card>
      </div>

      <Card variant="bordered" padding="lg" className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {t("comp.student.testInfoTitle")}
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{t("comp.student.testNameLabel")}</span>
            <span className="font-medium text-slate-900">{testInfo?.title}</span>
          </div>
          {testInfo?.description && (
            <div className="flex items-start justify-between">
              <span className="text-slate-600">{t("common.description")}:</span>
              <span className="font-medium text-slate-900 text-right max-w-md">
                {testInfo.description}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{t("comp.student.timeLimitLabel")}</span>
            <span className="font-medium text-slate-900">
              {Math.floor((testInfo?.time_limit_seconds || 0) / 60)} {t("comp.student.minutes")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{t("comp.student.questionsLabel")}:</span>
            <span className="font-medium text-slate-900">{questionCount}</span>
          </div>
        </div>
      </Card>

      {participation?.completed_at ? (
        <Card variant="bordered" padding="lg" className="mb-8 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">
                {t("comp.student.completedTitle")}
              </h3>
              <p className="text-green-700">
                {t("comp.student.yourScore")} {participation.score || 0} / {questionCount}
              </p>
            </div>
            <Link href={`/student/competitions/${competitionId}/results`}>
              <Button variant="primary">{t("comp.student.viewResults")}</Button>
            </Link>
          </div>
        </Card>
      ) : canJoin ? (
        <Card variant="bordered" padding="lg" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {t("comp.student.joinTitle")}
              </h3>
              <p className="text-slate-600">{t("comp.student.joinDesc")}</p>
            </div>
            <JoinButton competitionId={competitionId} joinAction={joinCompetitionAction} />
          </div>
        </Card>
      ) : canStart ? (
        <Card variant="bordered" padding="lg" className="mb-8 bg-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-1">
                {t("comp.student.startTestTitle")}
              </h3>
              <p className="text-indigo-700">{t("comp.student.startTestDesc")}</p>
            </div>
            <Link href={`/student/competitions/${competitionId}/attempt`}>
              <Button variant="primary" size="lg">
                {t("comp.student.startBtn")}
              </Button>
            </Link>
          </div>
        </Card>
      ) : hasPreviousAttempt ? (
        <Card variant="bordered" padding="lg" className="mb-8 bg-amber-50">
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              {t("comp.student.prevAttemptTitle")}
            </h3>
            <p className="text-amber-700">{t("comp.student.prevAttemptDesc")}</p>
          </div>
        </Card>
      ) : status === "upcoming" ? (
        <Card variant="bordered" padding="lg" className="mb-8 bg-slate-50">
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {t("comp.student.upcomingTitle")}
            </h3>
            <p className="text-slate-600">
              {t("comp.student.comesBackAt")}{" "}
              {new Date(competition.start_time).toLocaleString(undefined, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>
        </Card>
      ) : (
        <Card variant="bordered" padding="lg" className="mb-8 bg-slate-50">
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {t("comp.student.endedTitle")}
            </h3>
            <p className="text-slate-600">{t("comp.student.endedDesc")}</p>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          {t("comp.resultsTable")}
        </h2>
        <LeaderboardTable entries={leaderboardEntries} maxScore={questionCount} />
      </div>
    </div>
  );
}
