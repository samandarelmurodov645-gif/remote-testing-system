"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { ParsedQuestion } from "../tests/[testId]/bulkImportAction";

export type { ParsedQuestion };

export async function bulkCreateCompetitionWithQuestionsAction(
  competitionTitle: string,
  startTime: string,
  endTime: string,
  maxParticipants: number | null,
  subject: string,
  questions: ParsedQuestion[]
): Promise<{ ok: true; competitionId: string } | { ok: false; error: string }> {
  try {
    await requireRole("admin");
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  if (!competitionTitle.trim()) return { ok: false, error: "Competition title is required" };
  if (!startTime) return { ok: false, error: "Start time is required" };
  if (!endTime) return { ok: false, error: "End time is required" };
  if (new Date(endTime) <= new Date(startTime))
    return { ok: false, error: "End time must be after start time" };
  if (!questions.length) return { ok: false, error: "No questions provided" };
  if (questions.length > 25) return { ok: false, error: "Maximum 25 questions allowed" };

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Not authenticated" };

  const durationSeconds = Math.floor(
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
  );

  // 1. Create the linked test (unpublished, 1 attempt since it's a competition)
  const { data: testRow, error: testErr } = await supabase
    .from("tests")
    .insert({
      title: `${competitionTitle.trim()} — Test`,
      time_limit_seconds: Math.max(1800, durationSeconds),
      max_attempts: 1,
      subject,
      created_by: userData.user.id,
      published: false,
    })
    .select("id")
    .single();

  if (testErr || !testRow) {
    return { ok: false, error: testErr?.message ?? "Failed to create test" };
  }

  const testId = testRow.id;

  // 2. Insert questions and options
  for (let pos = 0; pos < questions.length; pos++) {
    const q = questions[pos];

    if (q.question_type === "open_answer") {
      await supabase.from("questions").insert({
        test_id: testId,
        prompt: q.prompt,
        position: pos,
        question_text_ru: q.prompt_ru ?? null,
        question_text_en: q.prompt_en ?? null,
        question_text_fr: q.prompt_fr ?? null,
        question_type: "open_answer",
        correct_answer_text: q.correct_answer_text ?? null,
      });
      continue;
    }

    const { data: qRow, error: qErr } = await supabase
      .from("questions")
      .insert({
        test_id: testId,
        prompt: q.prompt,
        position: pos,
        question_text_ru: q.prompt_ru ?? null,
        question_text_en: q.prompt_en ?? null,
        question_text_fr: q.prompt_fr ?? null,
      })
      .select("id")
      .single();

    if (qErr || !qRow) continue;

    const optionRows = q.options.map((text, i) => ({
      question_id: qRow.id,
      text,
      position: i,
      option_text_ru: q.options_ru?.[i] ?? null,
      option_text_en: q.options_en?.[i] ?? null,
      option_text_fr: q.options_fr?.[i] ?? null,
    }));

    const { data: insertedOptions, error: optErr } = await supabase
      .from("options")
      .insert(optionRows)
      .select("id,position");

    if (optErr || !insertedOptions) continue;

    const correctOption = insertedOptions.find((o) => o.position === q.correctIndex);
    if (correctOption) {
      await supabase.from("correct_options").upsert({
        question_id: qRow.id,
        option_id: correctOption.id,
      });
    }
  }

  // 3. Create the competition linked to the test
  const { data: compRow, error: compErr } = await supabase
    .from("competitions")
    .insert({
      title: competitionTitle.trim(),
      test_id: testId,
      start_time: startTime,
      end_time: endTime,
      max_participants: maxParticipants,
      published: false,
    })
    .select("id")
    .single();

  if (compErr || !compRow) {
    return { ok: false, error: compErr?.message ?? "Failed to create competition" };
  }

  revalidatePath("/admin/competitions");

  return { ok: true, competitionId: compRow.id };
}
