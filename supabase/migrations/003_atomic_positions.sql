-- 003_atomic_positions.sql
-- Atomic position assignment for questions and options.
-- Replaces the read-then-insert pattern in server actions which is
-- vulnerable to a TOCTOU race: two concurrent inserts can read the
-- same MAX(position) before either commits, causing a unique-constraint
-- violation on (test_id, position) or (question_id, position).
--
-- Both functions use pg_advisory_xact_lock() to serialise concurrent
-- callers for the same parent id. The lock is released automatically
-- when the surrounding transaction commits or rolls back.

-- -------------------------------------------------------
-- insert_question_atomic(p_test_id, p_prompt) → uuid
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.insert_question_atomic(
  p_test_id uuid,
  p_prompt  text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_position int;
  v_id       uuid;
BEGIN
  -- Serialise concurrent inserts for the same test.
  PERFORM pg_advisory_xact_lock(hashtext('q:' || p_test_id::text));

  SELECT COALESCE(MAX(position) + 1, 0)
    INTO v_position
    FROM public.questions
   WHERE test_id = p_test_id;

  INSERT INTO public.questions (test_id, prompt, position)
  VALUES (p_test_id, p_prompt, v_position)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- -------------------------------------------------------
-- insert_option_atomic(p_question_id, p_text) → uuid
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.insert_option_atomic(
  p_question_id uuid,
  p_text        text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_position int;
  v_id       uuid;
BEGIN
  -- Serialise concurrent inserts for the same question.
  PERFORM pg_advisory_xact_lock(hashtext('o:' || p_question_id::text));

  SELECT COALESCE(MAX(position) + 1, 0)
    INTO v_position
    FROM public.options
   WHERE question_id = p_question_id;

  INSERT INTO public.options (question_id, text, position)
  VALUES (p_question_id, p_text, v_position)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
