"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Badge } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { bulkCreateTestWithQuestionsAction } from "./bulkImportAction";
import type { ParsedQuestion } from "./[testId]/bulkImportAction";
import { SUBJECTS, SUBJECT_EMOJI } from "@/lib/subjects";
import { translateBatch } from "@/lib/translate";

type PreviewLang = "uz" | "ru" | "en" | "fr";

const PREVIEW_LANGS: Array<{ code: PreviewLang; label: string; flag: string }> = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export function ExcelUploadAndCreate() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [subject, setSubject] = useState("General");
  const [previewLang, setPreviewLang] = useState<PreviewLang>("uz");
  const fileRef = useRef<HTMLInputElement>(null);

  const parseFile = useCallback(
    async (file: File) => {
      setError(null);
      setQuestions([]);
      setFileName(file.name);
      setPreviewLang("uz");

      try {
        const XLSX = await import("xlsx");
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });

        const parsed: ParsedQuestion[] = [];

        for (const rawRow of rows) {
          const row = rawRow as unknown[];
          if (!row || row.length < 2) continue;

          const prompt = String(row[0] ?? "").trim();
          if (!prompt) continue;

          const typeRaw = row.length > 6 ? String(row[6] ?? "").trim().toUpperCase() : "";
          const isOA = typeRaw === "OA" || typeRaw === "OPEN";

          if (isOA) {
            const correctAnswerText = String(row[5] ?? "").trim();
            if (!correctAnswerText) continue;
            parsed.push({
              prompt,
              options: ["", "", "", ""],
              correctIndex: -1,
              question_type: "open_answer",
              correct_answer_text: correctAnswerText,
            });
          } else {
            if (row.length < 6) continue;
            const opt1 = String(row[1] ?? "").trim();
            const opt2 = String(row[2] ?? "").trim();
            const opt3 = String(row[3] ?? "").trim();
            const opt4 = String(row[4] ?? "").trim();
            const correctNum = parseInt(String(row[5]), 10);
            if (!opt1 || !opt2 || !opt3 || !opt4) continue;
            if (isNaN(correctNum) || correctNum < 1 || correctNum > 4) continue;
            parsed.push({
              prompt,
              options: [opt1, opt2, opt3, opt4],
              correctIndex: correctNum - 1,
            });
          }

          if (parsed.length >= 25) break;
        }

        if (parsed.length === 0) {
          setError(t("excel.noData"));
          return;
        }

        // Start translation
        setTranslating(true);

        // Flatten: [q0.prompt, q0.opt1, q0.opt2, q0.opt3, q0.opt4, q1.prompt, ...]
        const flat = parsed.flatMap((q) => [q.prompt, ...q.options]);

        const [flatRu, flatEn, flatFr] = await Promise.all([
          translateBatch(flat, "uz", "ru"),
          translateBatch(flat, "uz", "en"),
          translateBatch(flat, "uz", "fr"),
        ]);

        const translated = parsed.map((q, i) => {
          const base = i * 5;
          return {
            ...q,
            prompt_ru: flatRu[base],
            options_ru: [flatRu[base + 1], flatRu[base + 2], flatRu[base + 3], flatRu[base + 4]] as [string, string, string, string],
            prompt_en: flatEn[base],
            options_en: [flatEn[base + 1], flatEn[base + 2], flatEn[base + 3], flatEn[base + 4]] as [string, string, string, string],
            prompt_fr: flatFr[base],
            options_fr: [flatFr[base + 1], flatFr[base + 2], flatFr[base + 3], flatFr[base + 4]] as [string, string, string, string],
          };
        });

        setQuestions(translated);
        setTranslating(false);
      } catch {
        setTranslating(false);
        setError(t("excel.errorParsing"));
      }
    },
    [t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) parseFile(file);
    },
    [parseFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCreate = async () => {
    if (!questions.length || creating || !fileName) return;
    setCreating(true);
    setError(null);

    const title = fileName.replace(/\.(xlsx|csv)$/i, "");

    try {
      const result = await bulkCreateTestWithQuestionsAction(title, questions, subject);
      if (result.ok) {
        router.push(`/admin/tests/${result.testId}`);
      } else {
        setError(result.error);
        setCreating(false);
      }
    } catch {
      setError(t("common.error"));
      setCreating(false);
    }
  };

  const getQuestionText = (q: ParsedQuestion, lang: PreviewLang): string => {
    if (lang === "ru") return q.prompt_ru ?? q.prompt;
    if (lang === "en") return q.prompt_en ?? q.prompt;
    if (lang === "fr") return q.prompt_fr ?? q.prompt;
    return q.prompt;
  };

  const getOptionText = (q: ParsedQuestion, lang: PreviewLang, idx: number): string => {
    if (lang === "ru") return q.options_ru?.[idx] ?? q.options[idx];
    if (lang === "en") return q.options_en?.[idx] ?? q.options[idx];
    if (lang === "fr") return q.options_fr?.[idx] ?? q.options[idx];
    return q.options[idx];
  };

  return (
    <Card variant="bordered" padding="lg" className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{t("excel.create.title")}</h2>
      </div>
      <p className="text-sm text-slate-600 mb-6">{t("excel.create.desc")}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Drag & Drop Zone */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            onClick={() => !translating && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); if (!translating) setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
              translating
                ? "border-indigo-300 bg-indigo-50 cursor-wait"
                : isDragging
                ? "border-indigo-400 bg-indigo-50 cursor-pointer"
                : fileName && questions.length > 0
                ? "border-emerald-400 bg-emerald-50 cursor-pointer"
                : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50 cursor-pointer"
            }`}
          >
            {translating ? (
              <>
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-indigo-700">{t("excel.translating")}</p>
                <p className="text-xs text-slate-500 mt-1">{fileName}</p>
              </>
            ) : fileName && questions.length > 0 ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-emerald-700 break-all">{fileName}</p>
                <p className="text-xs text-slate-500 mt-1">{t("excel.create.clickToChange")}</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700">{t("excel.create.dropZone")}</p>
                <p className="text-xs text-slate-500 mt-1">{t("excel.create.dropHint")}</p>
              </>
            )}
          </div>
        </div>

        {/* Guide Panel */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">{t("excel.create.guideTitle")}</h3>
          <div className="overflow-x-auto mb-4">
            <table className="text-xs w-full border-collapse">
              <thead>
                <tr>
                  {[t("excel.create.colQ"), "Option1", "Option2", "Option3", "Option4", t("excel.create.colC")].map((col, i) => (
                    <th
                      key={i}
                      className="border border-slate-200 px-2 py-1.5 bg-slate-100 text-slate-700 font-semibold text-center whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="italic text-slate-400">
                  <td className="border border-slate-200 px-2 py-1.5">2+2=?</td>
                  <td className="border border-slate-200 px-2 py-1.5">3</td>
                  <td className="border border-slate-200 px-2 py-1.5">4</td>
                  <td className="border border-slate-200 px-2 py-1.5">5</td>
                  <td className="border border-slate-200 px-2 py-1.5">6</td>
                  <td className="border border-slate-200 px-2 py-1.5 text-center font-semibold text-slate-600">2</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="space-y-1.5">
            {[
              t("excel.create.rule1"),
              t("excel.create.rule2"),
              t("excel.create.rule3"),
              t("excel.create.rule4"),
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Preview */}
      {questions.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-medium text-slate-900 text-sm">
              {t("excel.previewTitle")} — {questions.length} {t("excel.questionsFound")}
            </h3>
            {/* Language tabs */}
            <div className="flex items-center gap-1">
              {PREVIEW_LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setPreviewLang(lang.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    previewLang === lang.code
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-slate-600 font-medium w-10">#</th>
                  <th className="px-4 py-2 text-left text-slate-600 font-medium">{t("excel.question")}</th>
                  <th className="px-4 py-2 text-left text-slate-600 font-medium">{t("excel.options")}</th>
                  <th className="px-4 py-2 text-left text-slate-600 font-medium w-20">{t("excel.correctAnswer")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-2 text-slate-900 max-w-xs">
                      <span className="line-clamp-2">{getQuestionText(q, previewLang)}</span>
                    </td>
                    <td className="px-4 py-2">
                      {q.question_type === "open_answer" ? (
                        <Badge variant="default" size="sm">Open Answer</Badge>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {q.options.map((_, j) => {
                            const optText = getOptionText(q, previewLang, j);
                            return (
                              <span
                                key={j}
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                  j === q.correctIndex
                                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-400"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {String.fromCharCode(65 + j)}: {optText.length > 15 ? optText.slice(0, 15) + "…" : optText}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {q.question_type === "open_answer" ? (
                        <span className="text-xs text-slate-600 italic line-clamp-1" title={q.correct_answer_text}>
                          {q.correct_answer_text && q.correct_answer_text.length > 12
                            ? q.correct_answer_text.slice(0, 12) + "…"
                            : q.correct_answer_text}
                        </span>
                      ) : (
                        <Badge variant="success" size="sm">
                          {q.correctIndex + 1}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subject picker */}
      {questions.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {t("subject.label")} <span className="text-red-500">*</span>
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white text-slate-900"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {SUBJECT_EMOJI[s]} {t(`subject.${s}`)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Confirm button */}
      {questions.length > 0 && (
        <Button variant="primary" size="lg" onClick={handleCreate} disabled={creating}>
          {creating ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("excel.create.creating")}
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("excel.create.confirmBtn")} ({questions.length})
            </>
          )}
        </Button>
      )}
    </Card>
  );
}
