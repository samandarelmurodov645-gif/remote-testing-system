"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUBJECTS, SUBJECT_EMOJI } from "@/lib/subjects";

type Tab = "open-ended" | "excel" | "subjects";

export function AdminGuide() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("open-ended");

  const tabs = [
    { id: "open-ended" as Tab, label: t("guide.tab.openEnded"), icon: "✏️" },
    { id: "excel" as Tab, label: t("guide.tab.excel"), icon: "📊" },
    { id: "subjects" as Tab, label: t("guide.tab.subjects"), icon: "🏷️" },
  ];

  const oeSteps = [
    { step: 1, text: t("guide.oe.step1") },
    { step: 2, text: t("guide.oe.step2"), highlight: true },
    { step: 3, text: t("guide.oe.step3") },
    { step: 4, text: t("guide.oe.step4") },
    { step: 5, text: t("guide.oe.step5") },
    { step: 6, text: t("guide.oe.step6") },
  ];

  const colHeaders = [
    t("guide.excel.colA"),
    t("guide.excel.colB"),
    t("guide.excel.colC"),
    t("guide.excel.colD"),
    t("guide.excel.colE"),
    t("guide.excel.colF"),
    t("guide.excel.colG"),
  ];

  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700 shadow-sm w-full"
      >
        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="flex-1 text-left">{t("guide.toggle")}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <Card variant="bordered" padding="none" className="mt-2 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  tab === tabItem.id
                    ? "border-indigo-600 text-indigo-700 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{tabItem.icon}</span>
                <span className="hidden sm:inline">{tabItem.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ── Tab 1: Open-ended questions ── */}
            {tab === "open-ended" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t("guide.oe.title")}</h3>
                  <p className="text-sm text-slate-600">{t("guide.oe.desc")}</p>
                </div>

                <ol className="space-y-3">
                  {oeSteps.map((item) => (
                    <li key={item.step} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {item.step}
                      </span>
                      <p className={`text-sm ${item.highlight ? "font-medium text-slate-900" : "text-slate-700"}`}>
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ol>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">{t("guide.oe.tipLabel")}</span>{" "}
                    {t("guide.oe.tip")}
                  </p>
                </div>
              </div>
            )}

            {/* ── Tab 2: Excel format ── */}
            {tab === "excel" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t("guide.excel.title")}</h3>
                  <p className="text-sm text-slate-600">
                    {t("guide.excel.colDesc").split("MC").map((part, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>{part}<code className="bg-slate-100 px-1 rounded">MC</code></span>
                      ) : part
                    )}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="text-xs w-full border-collapse rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-slate-100">
                        {colHeaders.map((h, i) => (
                          <th
                            key={i}
                            className={`border border-slate-200 px-2.5 py-2 text-left font-semibold whitespace-nowrap ${
                              i === 6 ? "text-purple-700 bg-purple-50" : "text-slate-700"
                            }`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-800">2 + 2 = ?</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-600">3</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-600">4</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-600">5</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-600">6</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-center font-semibold text-emerald-700">2</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-center text-slate-400 bg-purple-50">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">MC</span>
                        </td>
                      </tr>
                      <tr className="bg-purple-50/40">
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-800">Capital of France?</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-400 italic">(empty)</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-400 italic">(empty)</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-400 italic">(empty)</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-400 italic">(empty)</td>
                        <td className="border border-slate-200 px-2.5 py-2 font-semibold text-purple-700">Paris</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-center bg-purple-50">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-mono font-semibold">OA</span>
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-800">Speed of light (m/s)?</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-600">1,000</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-600">300,000</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-600">150,000</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-slate-600">500,000</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-center font-semibold text-emerald-700">2</td>
                        <td className="border border-slate-200 px-2.5 py-2 text-center text-slate-400 bg-purple-50">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">MC</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">{t("guide.excel.mcTitle")}</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• {t("guide.excel.mcRule1")}</li>
                      <li>• {t("guide.excel.mcRule2")}</li>
                      <li>• {t("guide.excel.mcRule3")}</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-purple-900 mb-2">{t("guide.excel.oaTitle")}</p>
                    <ul className="text-xs text-purple-800 space-y-1">
                      <li>• {t("guide.excel.oaRule1")}</li>
                      <li>• {t("guide.excel.oaRule2")}</li>
                      <li>• {t("guide.excel.oaRule3")}</li>
                      <li>• {t("guide.excel.oaRule4")}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-700">{t("guide.excel.colGNote")}</p>
                </div>
              </div>
            )}

            {/* ── Tab 3: Subjects ── */}
            {tab === "subjects" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t("guide.sub.title")}</h3>
                  <p className="text-sm text-slate-600">{t("guide.sub.desc")}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center shrink-0 font-bold text-emerald-800 text-sm">1</div>
                    <div>
                      <p className="font-semibold text-emerald-900 text-sm mb-1">{t("guide.sub.way1Title")}</p>
                      <p className="text-xs text-emerald-800">{t("guide.sub.way1Desc")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-indigo-200 flex items-center justify-center shrink-0 font-bold text-indigo-800 text-sm">2</div>
                    <div>
                      <p className="font-semibold text-indigo-900 text-sm mb-1">{t("guide.sub.way2Title")}</p>
                      <p className="text-xs text-indigo-800">{t("guide.sub.way2Desc")}</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="text-xs w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">{t("guide.sub.colSubject")}</th>
                        <th className="border border-slate-200 px-3 py-2 text-center text-slate-700 font-semibold">{t("guide.sub.colIcon")}</th>
                        <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">{t("subject.label")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SUBJECTS.map((name) => (
                        <tr key={name} className="bg-white hover:bg-slate-50">
                          <td className="border border-slate-200 px-3 py-1.5 font-mono text-xs text-slate-700">{name}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-center">{SUBJECT_EMOJI[name]}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-slate-600">{t(`subject.${name}`)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500">{t("guide.sub.footer")}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
