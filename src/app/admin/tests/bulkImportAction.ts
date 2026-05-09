"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { ParsedQuestion } from "./[testId]/bulkImportAction";

export type { ParsedQuestion };

export async function bulkCreateTestWithQuestionsAction(
  title: string,
  questions: ParsedQuestion[],
  subject: string = "General"
): Promise<{ ok: true; testId: string } | { ok: false; error: string }> {
  try {
    await requireRole("admin");
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  if (!title.trim()) return { ok: false, error: "Title is required" };
  if (!questions.length) return { ok: false, error: "No questions provided" };
  if (questions.length > 25) return { ok: false, error: "Maximum 25 questions allowed" };

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Not authenticated" };

  const { data: testRow, error: testErr } = await supabase
    .from("tests")
    .insert({
      title: title.trim(),
      time_limit_seconds: 1800,
      max_attempts: 3,
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

  for (let pos = 0; pos < questions.length; pos++) {
    const q = questions[pos];

    const { data: qRow, error: qErr } = await supabase
      .from("questions")
      .insert({ test_id: testId, prompt: q.prompt, position: pos })
      .select("id")
      .single();

    if (qErr || !qRow) continue;

    const optionRows = q.options.map((text, i) => ({
      question_id: qRow.id,
      text,
      position: i,
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

  revalidatePath("/admin/tests");

  return { ok: true, testId };
}
