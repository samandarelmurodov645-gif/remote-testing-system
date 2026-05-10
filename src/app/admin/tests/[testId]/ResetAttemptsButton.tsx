"use client";

import { Button } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

export function ResetAttemptsButton({
  testId,
  resetAction,
}: {
  testId: string;
  resetAction: (formData: FormData) => Promise<void>;
}) {
  const { t } = useLanguage();

  return (
    <form action={resetAction} className="shrink-0">
      <input type="hidden" name="test_id" value={testId} />
      <Button
        type="submit"
        variant="danger"
        size="sm"
        onClick={(e) => {
          if (!confirm(t("admin.testDetail.resetAttemptsConfirm"))) e.preventDefault();
        }}
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {t("admin.testDetail.resetAttempts")}
      </Button>
    </form>
  );
}
