"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const addQuestionSchema = z.object({
  test_id: z.string().uuid(),
  prompt: z.string().min(1),
  question_type: z.enum(["multiple_choice", "open_answer"]).default("multiple_choice"),
  correct_answer_text: z.string().optional(),
});

export async function addQuestionAction(formData: FormData) {
  await requireRole("admin");

  const parsed = addQuestionSchema.safeParse({
    test_id: formData.get("test_id"),
    prompt: formData.get("prompt"),
    question_type: formData.get("question_type") ?? "multiple_choice",
    correct_answer_text: (formData.get("correct_answer_text") as string) || undefined,
  });
  if (!parsed.success) redirect("/admin/tests?error=invalid_input");

  const supabase = await createSupabaseServerClient();

  // Atomic insert: the DB function acquires an advisory lock so concurrent
  // requests for the same test cannot compute the same MAX(position).
  const { error } = await supabase.rpc("insert_question_atomic", {
    p_test_id: parsed.data.test_id,
    p_prompt: parsed.data.prompt,
  });

  if (error)
    redirect(
      `/admin/tests/${parsed.data.test_id}?error=${encodeURIComponent(
        error.message
      )}`
    );

  // For open-ended questions, update question_type and correct_answer_text on the
  // freshly inserted row (identified by highest position for this test).
  if (parsed.data.question_type === "open_answer" || parsed.data.correct_answer_text) {
    const { data: latestQ } = await supabase
      .from("questions")
      .select("id")
      .eq("test_id", parsed.data.test_id)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestQ) {
      await supabase
        .from("questions")
        .update({
          question_type: parsed.data.question_type,
          correct_answer_text: parsed.data.correct_answer_text ?? null,
        })
        .eq("id", latestQ.id);
    }
  }

  revalidatePath(`/admin/tests/${parsed.data.test_id}`);
  redirect(`/admin/tests/${parsed.data.test_id}`);
}

const deleteQuestionSchema = z.object({
  test_id: z.string().uuid(),
  question_id: z.string().uuid(),
});

export async function deleteQuestionAction(formData: FormData) {
  await requireRole("admin");

  const parsed = deleteQuestionSchema.safeParse({
    test_id: formData.get("test_id"),
    question_id: formData.get("question_id"),
  });
  if (!parsed.success) redirect("/admin/tests?error=invalid_input");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", parsed.data.question_id);
  if (error)
    redirect(
      `/admin/tests/${parsed.data.test_id}?error=${encodeURIComponent(
        error.message
      )}`
    );

  revalidatePath(`/admin/tests/${parsed.data.test_id}`);
  redirect(`/admin/tests/${parsed.data.test_id}`);
}

const addOptionSchema = z.object({
  test_id: z.string().uuid(),
  question_id: z.string().uuid(),
  text: z.string().min(1),
});

export async function addOptionAction(formData: FormData) {
  await requireRole("admin");

  const parsed = addOptionSchema.safeParse({
    test_id: formData.get("test_id"),
    question_id: formData.get("question_id"),
    text: formData.get("text"),
  });

  if (!parsed.success) redirect("/admin/tests?error=invalid_input");

  const supabase = await createSupabaseServerClient();

  // Atomic insert: the DB function acquires an advisory lock so concurrent
  // requests for the same question cannot compute the same MAX(position).
  const { error } = await supabase.rpc("insert_option_atomic", {
    p_question_id: parsed.data.question_id,
    p_text: parsed.data.text,
  });

  if (error)
    redirect(
      `/admin/tests/${parsed.data.test_id}?error=${encodeURIComponent(
        error.message
      )}`
    );

  revalidatePath(`/admin/tests/${parsed.data.test_id}`);
  redirect(`/admin/tests/${parsed.data.test_id}`);
}

const deleteOptionSchema = z.object({
  test_id: z.string().uuid(),
  option_id: z.string().uuid(),
});

export async function deleteOptionAction(formData: FormData) {
  await requireRole("admin");

  const parsed = deleteOptionSchema.safeParse({
    test_id: formData.get("test_id"),
    option_id: formData.get("option_id"),
  });

  if (!parsed.success) redirect("/admin/tests?error=invalid_input");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("options")
    .delete()
    .eq("id", parsed.data.option_id);
  if (error)
    redirect(
      `/admin/tests/${parsed.data.test_id}?error=${encodeURIComponent(
        error.message
      )}`
    );

  revalidatePath(`/admin/tests/${parsed.data.test_id}`);
  redirect(`/admin/tests/${parsed.data.test_id}`);
}

const setCorrectSchema = z.object({
  test_id: z.string().uuid(),
  question_id: z.string().uuid(),
  option_id: z.string().uuid(),
});

export async function setCorrectOptionAction(formData: FormData) {
  await requireRole("admin");

  const parsed = setCorrectSchema.safeParse({
    test_id: formData.get("test_id"),
    question_id: formData.get("question_id"),
    option_id: formData.get("option_id"),
  });

  if (!parsed.success) redirect("/admin/tests?error=invalid_input");

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("correct_options").upsert({
    question_id: parsed.data.question_id,
    option_id: parsed.data.option_id,
  });

  if (error)
    redirect(
      `/admin/tests/${parsed.data.test_id}?error=${encodeURIComponent(
        error.message
      )}`
    );

  revalidatePath(`/admin/tests/${parsed.data.test_id}`);
  redirect(`/admin/tests/${parsed.data.test_id}`);
}

const setCorrectAnswerTextSchema = z.object({
  test_id: z.string().uuid(),
  question_id: z.string().uuid(),
  correct_answer_text: z.string().min(1),
});

export async function setCorrectAnswerTextAction(formData: FormData) {
  await requireRole("admin");

  const parsed = setCorrectAnswerTextSchema.safeParse({
    test_id: formData.get("test_id"),
    question_id: formData.get("question_id"),
    correct_answer_text: formData.get("correct_answer_text"),
  });
  if (!parsed.success) redirect("/admin/tests?error=invalid_input");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("questions")
    .update({ correct_answer_text: parsed.data.correct_answer_text })
    .eq("id", parsed.data.question_id);

  if (error)
    redirect(
      `/admin/tests/${parsed.data.test_id}?error=${encodeURIComponent(error.message)}`
    );

  revalidatePath(`/admin/tests/${parsed.data.test_id}`);
  redirect(`/admin/tests/${parsed.data.test_id}`);
}

const resetAttemptsSchema = z.object({ test_id: z.string().uuid() });

export async function resetAttemptsAction(formData: FormData) {
  await requireRole("admin");

  const parsed = resetAttemptsSchema.safeParse({ test_id: formData.get("test_id") });
  if (!parsed.success) redirect("/admin/tests?error=invalid_input");

  // Service client bypasses student-scoped RLS on the attempts table.
  const service = createSupabaseServiceClient();
  const { error } = await service
    .from("attempts")
    .delete()
    .eq("test_id", parsed.data.test_id);

  if (error)
    redirect(
      `/admin/tests/${parsed.data.test_id}?error=${encodeURIComponent(error.message)}`
    );

  revalidatePath(`/admin/tests/${parsed.data.test_id}`);
  redirect(`/admin/tests/${parsed.data.test_id}?reset=success`);
}
