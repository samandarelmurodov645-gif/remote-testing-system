"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ParsedQuestion = {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  question_type?: "multiple_choice" | "open_answer";
  correct_answer_text?: string;
  prompt_ru?: string;
  prompt_en?: string;
  prompt_fr?: string;
  options_ru?: [string, string, string, string];
  options_en?: [string, string, string, string];
  options_fr?: [string, string, string, string];
};

export async function bulkImportQuestionsAction(
  testId: string,
  questions: ParsedQuestion[]
): Promise<{ ok: boolean; count: number; error?: string }> {
  if (!questions.length) return { ok: false, count: 0, error: "No questions" };

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("questions")
    .select("position")
    .eq("test_id", testId)
    .order("position", { ascending: false })
    .limit(1);

  let nextPos = (existing?.[0]?.position ?? -1) + 1;
  let imported = 0;

  for (const q of questions) {
    if (q.question_type === "open_answer") {
      const { error: qErr } = await supabase
        .from("questions")
        .insert({
          test_id: testId,
          prompt: q.prompt,
          position: nextPos++,
          question_text_ru: q.prompt_ru ?? null,
          question_text_en: q.prompt_en ?? null,
          question_text_fr: q.prompt_fr ?? null,
          question_type: "open_answer",
          correct_answer_text: q.correct_answer_text ?? null,
        });
      if (!qErr) imported++;
      continue;
    }

    const { data: qRow, error: qErr } = await supabase
      .from("questions")
      .insert({
        test_id: testId,
        prompt: q.prompt,
        position: nextPos++,
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

    const correctOption = insertedOptions.find(
      (o) => o.position === q.correctIndex
    );
    if (correctOption) {
      await supabase.from("correct_options").upsert({
        question_id: qRow.id,
        option_id: correctOption.id,
      });
    }

    imported++;
  }

  return { ok: true, count: imported };
}
