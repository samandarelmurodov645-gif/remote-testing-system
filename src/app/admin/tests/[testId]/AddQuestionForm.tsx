"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { addQuestionAction } from "./actions";
import { useLanguage } from "@/contexts/LanguageContext";

export function AddQuestionForm({ testId }: { testId: string }) {
  const { t } = useLanguage();
  const [questionType, setQuestionType] = useState<"multiple_choice" | "open_answer">("multiple_choice");

  return (
    <form action={addQuestionAction} className="space-y-3">
      <input type="hidden" name="test_id" value={testId} />
      <input type="hidden" name="question_type" value={questionType} />

      {/* Type toggle */}
      <div className="flex gap-2 mb-1">
        <button
          type="button"
          onClick={() => setQuestionType("multiple_choice")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
            questionType === "multiple_choice"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
          }`}
        >
          {t("admin.testDetail.multipleChoice")}
        </button>
        <button
          type="button"
          onClick={() => setQuestionType("open_answer")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
            questionType === "open_answer"
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
          }`}
        >
          {t("admin.testDetail.openAnswer")}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          name="prompt"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
          placeholder={t("admin.testDetail.questionPlaceholder")}
          required
        />
        <Button type="submit" variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("admin.testDetail.addQuestion")}
        </Button>
      </div>

      {questionType === "open_answer" && (
        <input
          name="correct_answer_text"
          className="w-full px-4 py-2.5 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-sm"
          placeholder={t("admin.testDetail.correctAnswerPlaceholder")}
          required
        />
      )}
    </form>
  );
}
