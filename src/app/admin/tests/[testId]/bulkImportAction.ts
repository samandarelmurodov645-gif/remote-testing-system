"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ParsedQuestion = {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
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
    const { data: qRow, error: qErr } = await supabase
      .from("questions")
      .insert({ test_id: testId, prompt: q.prompt, position: nextPos++ })
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
