"use client";

import { Badge } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";

type CompetitionStatus = "upcoming" | "active" | "ended";

interface CompetitionStatusBadgeProps {
  startTime: string;
  endTime: string;
}

export function getCompetitionStatus(
  startTime: string,
  endTime: string
): CompetitionStatus {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return "upcoming";
  if (now > end) return "ended";
  return "active";
}

export function CompetitionStatusBadge({ startTime, endTime }: CompetitionStatusBadgeProps) {
  const { t } = useLanguage();
  const status = getCompetitionStatus(startTime, endTime);

  const variants: Record<CompetitionStatus, { variant: "info" | "success" | "default"; labelKey: string }> = {
    upcoming: { variant: "info", labelKey: "comp.upcoming" },
    active: { variant: "success", labelKey: "comp.active" },
    ended: { variant: "default", labelKey: "comp.ended" },
  };

  const { variant, labelKey } = variants[status];

  return <Badge variant={variant}>{t(labelKey)}</Badge>;
}
