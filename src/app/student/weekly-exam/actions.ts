"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export type WeeklyQuestion = {
  id: string;
  prompt: string;
  options: Array<{ id: string; text: string }>;
};

export type WeeklyExamData = {
  questions: WeeklyQuestion[];
  hasHistory: boolean;
  wrongCount: number;
  mode: "smart" | "random";
};

export type LeaderboardEntry = {
  studentId: string;
  name: string;
  totalScore: number;
  attempts: number;
};

export async function getWeeklyExamDataAction(): Promise<WeeklyExamData | null> {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: tests } = await supabase
    .from("tests")
    .select("id")
    .eq("published", true);

  if (!tests || tests.length === 0) {
    return { questions: [], hasHistory: false, wrongCount: 0, mode: "random" };
  }

  const testIds = tests.map((t) => t.id);

  const { data: allQuestions } = await supabase
    .from("questions")
    .select("id,prompt,test_id")
    .in("test_id", testIds);

  if (!allQuestions || allQuestions.length === 0) {
    return { questions: [], hasHistory: false, wrongCount: 0, mode: "random" };
  }

  const questionIds = allQuestions.map((q) => q.id);

  const { data: allOptions } = await supabase
    .from("options")
    .select("id,question_id,text,position")
    .in("question_id", questionIds)
    .order("position");

  const { data: attempts } = await supabase
    .from("attempts")
    .select("answers,test_id,status")
    .eq("student_id", user.id)
    .in("test_id", testIds)
    .in("status", ["submitted", "expired"]);

  const { data: correctOptions } = await supabase
    .from("correct_options")
    .select("question_id,option_id")
    .in("question_id", questionIds);

  const correctMap = new Map<string, string>();
  correctOptions?.forEach((c) => correctMap.set(c.question_id, c.option_id));

  const wrongQuestionIds = new Set<string>();
  const answeredQuestionIds = new Set<string>();

  attempts?.forEach((attempt) => {
    const answers = attempt.answers as Record<string, string> | null;
    if (!answers) return;
    Object.entries(answers).forEach(([qId, oId]) => {
      if (!questionIds.includes(qId)) return;
      answeredQuestionIds.add(qId);
      const correct = correctMap.get(qId);
      if (correct && correct !== oId) {
        wrongQuestionIds.add(qId);
      }
    });
  });

  const hasHistory = answeredQuestionIds.size > 0;
  const TOTAL = 20;
  const wrongArr = [...wrongQuestionIds].sort(() => Math.random() - 0.5);
  const wrongToUse = wrongArr.slice(0, Math.floor(TOTAL * 0.7));
  const usedIds = new Set(wrongToUse);

  const newQuestions = questionIds
    .filter((id) => !answeredQuestionIds.has(id))
    .sort(() => Math.random() - 0.5)
    .slice(0, TOTAL - wrongToUse.length);

  const selectedIds = [...wrongToUse, ...newQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, TOTAL);

  const optionsByQuestion = new Map<string, Array<{ id: string; text: string }>>();
  allOptions?.forEach((o) => {
    const arr = optionsByQuestion.get(o.question_id) ?? [];
    arr.push({ id: o.id, text: o.text });
    optionsByQuestion.set(o.question_id, arr);
  });

  const questions: WeeklyQuestion[] = selectedIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q))
    .map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: optionsByQuestion.get(q.id) ?? [],
    }))
    .filter((q) => q.options.length >= 2);

  return {
    questions,
    hasHistory,
    wrongCount: wrongToUse.length,
    mode: hasHistory && wrongToUse.length > 0 ? "smart" : "random",
  };
}

export async function submitWeeklyExamAction(
  answers: Record<string, string>
): Promise<{ score: number; total: number }> {
  const questionIds = Object.keys(answers);
  const total = questionIds.length;
  if (total === 0) return { score: 0, total: 0 };

  const user = await getCurrentUser();
  if (!user) return { score: 0, total };

  const supabase = await createSupabaseServerClient();
  const { data: correctRows } = await supabase
    .from("correct_options")
    .select("question_id,option_id")
    .in("question_id", questionIds);

  let score = 0;
  correctRows?.forEach((row) => {
    if (answers[row.question_id] === row.option_id) score++;
  });

  return { score, total };
}

export async function getWeeklyLeaderboardAction(): Promise<LeaderboardEntry[]> {
  const supabase = await createSupabaseServerClient();

  const now = new Date();
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const { data: attempts } = await supabase
    .from("attempts")
    .select("student_id,score,status")
    .gte("started_at", monday.toISOString())
    .in("status", ["submitted", "expired"]);

  if (!attempts || attempts.length === 0) return [];

  const studentScores = new Map<string, { total: number; count: number }>();
  attempts.forEach((a) => {
    if (a.score === null) return;
    const cur = studentScores.get(a.student_id) ?? { total: 0, count: 0 };
    studentScores.set(a.student_id, { total: cur.total + a.score, count: cur.count + 1 });
  });

  const studentIds = [...studentScores.keys()];
  if (studentIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id,email,full_name")
    .in("user_id", studentIds);

  const profileMap = new Map<string, string>();
  profiles?.forEach((p) =>
    profileMap.set(p.user_id, p.full_name || p.email || p.user_id.slice(0, 8))
  );

  return [...studentScores.entries()]
    .map(([studentId, data]) => ({
      studentId,
      name: profileMap.get(studentId) ?? studentId.slice(0, 8),
      totalScore: data.total,
      attempts: data.count,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);
}
