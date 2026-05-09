"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

const startSchema = z.object({ test_id: z.string().uuid() });

export async function startAttemptAction(formData: FormData) {
  await requireRole("student");

  const parsed = startSchema.safeParse({ test_id: formData.get("test_id") });
  if (!parsed.success) redirect("/student/tests?error=invalid_test");

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Ensure published
  const { data: test } = await supabase
    .from("tests")
    .select("id,max_attempts,published")
    .eq("id", parsed.data.test_id)
    .maybeSingle();

  if (!test || !test.published)
    redirect(`/student/tests/${parsed.data.test_id}?error=not_available`);

  // Resume an existing in_progress attempt rather than creating a new one.
  // This fixes the silent failure where repeated clicks or a mid-test
  // navigation-away produced a second orphaned attempt.
  const { data: inProgress } = await supabase
    .from("attempts")
    .select("id")
    .eq("test_id", parsed.data.test_id)
    .eq("student_id", userData.user.id)
    .eq("status", "in_progress")
    .maybeSingle();

  if (inProgress) {
    redirect(`/student/attempts/${inProgress.id}`);
  }

  // Enforce max_attempts (only count finished attempts; in_progress handled above)
  const { count } = await supabase
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("test_id", parsed.data.test_id)
    .eq("student_id", userData.user.id);

  if ((count ?? 0) >= test.max_attempts) {
    redirect(
      `/student/tests/${parsed.data.test_id}?error=no_attempts_remaining`
    );
  }

  const { data: attempt, error } = await supabase
    .from("attempts")
    .insert({
      test_id: parsed.data.test_id,
      student_id: userData.user.id,
      status: "in_progress",
      answers: {},
    })
    .select("id")
    .single();

  if (error)
    redirect(
      `/student/tests/${parsed.data.test_id}?error=${encodeURIComponent(
        error.message
      )}`
    );

  revalidatePath("/student/results");
  redirect(`/student/attempts/${attempt.id}`);
}

const submitSchema = z.object({
  attempt_id: z.string().uuid(),
  answers: z.record(z.string().uuid(), z.string()),
  client_finished_at: z.string().optional(),
  expired: z.coerce.boolean().optional(),
});

export async function submitAttemptAction(payload: unknown) {
  await requireRole("student");

  const parsed = submitSchema.safeParse(payload);
  if (!parsed.success)
    return { ok: false as const, message: "Invalid submission." };

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user)
    return { ok: false as const, message: "Not authenticated." };

  // Get attempt + test info (student can read own attempts)
  const { data: attempt } = await supabase
    .from("attempts")
    .select("id,test_id,status,started_at,student_id")
    .eq("id", parsed.data.attempt_id)
    .maybeSingle();

  if (!attempt || attempt.student_id !== userData.user.id) {
    return { ok: false as const, message: "Attempt not found." };
  }

  if (attempt.status !== "in_progress") {
    return { ok: false as const, message: "Attempt already finished." };
  }

  const service = createSupabaseServiceClient();

  const { data: test, error: testError } = await service
    .from("tests")
    .select("id,time_limit_seconds")
    .eq("id", attempt.test_id)
    .single();

  if (testError) return { ok: false as const, message: testError.message };

  const startedAtMs = new Date(attempt.started_at).getTime();
  const nowMs = Date.now();
  const deadlineMs = startedAtMs + test.time_limit_seconds * 1000;
  const isExpired = (parsed.data.expired ?? false) || nowMs >= deadlineMs;

  const { data: questions, error: qError } = await service
    .from("questions")
    .select("id,question_type,correct_answer_text")
    .eq("test_id", attempt.test_id);

  if (qError) return { ok: false as const, message: qError.message };

  const mcQuestionIds = (questions ?? [])
    .filter((q) => q.question_type !== "open_answer")
    .map((q) => q.id);

  const { data: correctRows, error: cError } = mcQuestionIds.length
    ? await service
        .from("correct_options")
        .select("question_id,option_id")
        .in("question_id", mcQuestionIds)
    : { data: [], error: null };

  if (cError) return { ok: false as const, message: cError.message };

  const correctByQ = new Map<string, string>();
  (correctRows ?? []).forEach((r) =>
    correctByQ.set(r.question_id, r.option_id)
  );

  let score = 0;
  for (const q of (questions ?? [])) {
    const chosen = parsed.data.answers[q.id];
    if (!chosen?.trim()) continue;
    if (q.question_type === "open_answer") {
      if (
        q.correct_answer_text &&
        chosen.trim().toLowerCase() === q.correct_answer_text.trim().toLowerCase()
      ) {
        score += 1;
      }
    } else {
      const correctOpt = correctByQ.get(q.id);
      if (correctOpt && chosen === correctOpt) score += 1;
    }
  }

  // Filter on status = in_progress so concurrent submits are idempotent:
  // the second UPDATE matches 0 rows (status already changed) and returns
  // no error, avoiding a last-writer-wins overwrite with a stale time_taken.
  const { error: updateError } = await service
    .from("attempts")
    .update({
      status: isExpired ? "expired" : "submitted",
      finished_at: new Date(nowMs).toISOString(),
      score,
      answers: parsed.data.answers,
    })
    .eq("id", attempt.id)
    .eq("student_id", userData.user.id)
    .eq("status", "in_progress");

  if (updateError) return { ok: false as const, message: updateError.message };

  revalidatePath("/student/results");
  return { ok: true as const };
}
