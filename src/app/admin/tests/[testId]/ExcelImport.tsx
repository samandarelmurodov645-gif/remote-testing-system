"use client";

import { useState, useRef } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { bulkImportQuestionsAction, type ParsedQuestion } from "./bulkImportAction";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateBatch } from "@/lib/translate";

export function ExcelImport({ testId }: { testId: string }) {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setQuestions([]);
    setImportedCount(null);

    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });

      const parsed: ParsedQuestion[] = [];

      for (const rawRow of rows) {
        const row = rawRow as unknown[];
        if (!row || row.length < 6) continue;

        const prompt = String(row[0] ?? "").trim();
        const opt1 = String(row[1] ?? "").trim();
        const opt2 = String(row[2] ?? "").trim();
        const opt3 = String(row[3] ?? "").trim();
        const opt4 = String(row[4] ?? "").trim();
        const correctNum = parseInt(String(row[5]), 10);

        if (!prompt || !opt1 || !opt2 || !opt3 || !opt4) continue;
        if (isNaN(correctNum) || correctNum < 1 || correctNum > 4) continue;

        parsed.push({
          prompt,
          options: [opt1, opt2, opt3, opt4],
          correctIndex: correctNum - 1,
        });
      }

      if (parsed.length === 0) {
        setError(t("excel.noData"));
        return;
      }

      // Translate all prompts and options in parallel for all 3 target languages
      setTranslating(true);
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
      setTranslating(false);

      setQuestions(translated);
    } catch {
      setTranslating(false);
      setError(t("excel.errorParsing"));
    }

    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleImport() {
    if (!questions.length || importing) return;
    setImporting(true);
    setError(null);

    try {
      const result = await bulkImportQuestionsAction(testId, questions);
      if (result.ok) {
        setImportedCount(result.count);
        setQuestions([]);
        window.location.reload();
      } else {
        setError(result.error ?? t("common.error"));
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setImporting(false);
    }
  }

  async function downloadTemplate() {
    const XLSX = await import("xlsx");
    const data = [
      [
        t("excel.colA").replace("A: ", ""),
        t("excel.colB").replace("B: ", ""),
        t("excel.colC").replace("C: ", ""),
        t("excel.colD").replace("D: ", ""),
        t("excel.colE").replace("E: ", ""),
        t("excel.colF").replace("F: ", ""),
      ],
      ["2 + 2 = ?", "3", "4", "5", "6", "2"],
      ["O'zbekiston poytaxti?", "Samarqand", "Toshkent", "Buxoro", "Namangan", "2"],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [{ wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, "questions-template.xlsx");
  }

  return (
    <Card variant="bordered" padding="lg" className="mb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">{t("excel.title")}</h2>
          </div>
          <p className="text-sm text-slate-600">{t("excel.desc")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t("excel.downloadTemplate")}
        </Button>
      </div>

      {/* Format instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
        <h3 className="font-semibold text-blue-900 mb-3 text-sm">{t("excel.formatTitle")}</h3>
        <p className="text-xs text-blue-700 mb-3">{t("excel.formatDesc")}</p>
        <div className="overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr>
                {["A", "B", "C", "D", "E", "F"].map((col) => (
                  <th key={col} className="border border-blue-300 px-3 py-1.5 bg-blue-100 text-blue-800 font-semibold text-center w-16">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-blue-300 px-3 py-1.5 text-blue-700">{t("excel.colA").replace("A: ", "")}</td>
                <td className="border border-blue-300 px-3 py-1.5 text-blue-700">{t("excel.colB").replace("B: ", "")}</td>
                <td className="border border-blue-300 px-3 py-1.5 text-blue-700">{t("excel.colC").replace("C: ", "")}</td>
                <td className="border border-blue-300 px-3 py-1.5 text-blue-700">{t("excel.colD").replace("D: ", "")}</td>
                <td className="border border-blue-300 px-3 py-1.5 text-blue-700">{t("excel.colE").replace("E: ", "")}</td>
                <td className="border border-blue-300 px-3 py-1.5 text-blue-700">{t("excel.colF").replace("F: ", "")}</td>
              </tr>
              <tr className="italic text-blue-500">
                <td className="border border-blue-300 px-3 py-1.5">2+2=?</td>
                <td className="border border-blue-300 px-3 py-1.5">3</td>
                <td className="border border-blue-300 px-3 py-1.5">4</td>
                <td className="border border-blue-300 px-3 py-1.5">5</td>
                <td className="border border-blue-300 px-3 py-1.5">6</td>
                <td className="border border-blue-300 px-3 py-1.5 text-center font-semibold text-blue-700">2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* File upload */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button variant="secondary" onClick={() => !translating && fileRef.current?.click()} disabled={translating}>
          {translating ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("excel.translating")}
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {t("excel.uploadBtn")}
            </>
          )}
        </Button>
        {questions.length > 0 && (
          <Badge variant="info">
            {questions.length} {t("excel.questionsFound")}
          </Badge>
        )}
      </div>

      {/* Status messages */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      {importedCount !== null && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-4">
          <p className="text-emerald-700 text-sm font-medium">
            ✓ {importedCount} {t("excel.success")}
          </p>
        </div>
      )}

      {/* Preview table */}
      {questions.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-medium text-slate-900 text-sm">
              {t("excel.previewTitle")} — {questions.length} {t("excel.questionsFound")}
            </h3>
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
                      <span className="line-clamp-2">{q.prompt}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {q.options.map((o, j) => (
                          <span
                            key={j}
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              j === q.correctIndex
                                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-400"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {String.fromCharCode(65 + j)}: {o.length > 15 ? o.slice(0, 15) + "…" : o}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="success" size="sm">
                        {q.correctIndex + 1}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm import */}
      {questions.length > 0 && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleImport}
          disabled={importing || translating}
        >
          {importing ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("excel.importing")}
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              {t("excel.confirmImport")} ({questions.length})
            </>
          )}
        </Button>
      )}
    </Card>
  );
}
