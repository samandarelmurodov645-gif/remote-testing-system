"use client";

import { useState } from "react";
import { Card } from "@/components/ui";

type Tab = "open-ended" | "excel" | "subjects";

export function AdminGuide() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("open-ended");

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
        <span className="flex-1 text-left">Admin Guide — Excel format, open-ended questions, subjects</span>
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
            {([
              { id: "open-ended" as Tab, label: "Open-Ended Questions", icon: "✏️" },
              { id: "excel" as Tab, label: "Excel Format", icon: "📊" },
              { id: "subjects" as Tab, label: "Subjects", icon: "🏷️" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  tab === t.id
                    ? "border-indigo-600 text-indigo-700 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ── Tab 1: Open-ended questions ── */}
            {tab === "open-ended" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Creating open-ended questions manually</h3>
                  <p className="text-sm text-slate-600">
                    Open-answer questions require the student to type a text response. The system checks it
                    case-insensitively (so "Paris" and "paris" both count as correct).
                  </p>
                </div>

                <ol className="space-y-3">
                  {[
                    { step: 1, text: "Go to the test detail page (click Edit on any test)." },
                    {
                      step: 2,
                      text: 'In the Questions section, click the "Open Answer" toggle next to the question input.',
                      highlight: true,
                    },
                    { step: 3, text: "Type the question prompt in the text field." },
                    { step: 4, text: 'Type the expected correct answer in the field that appears below (purple border).' },
                    { step: 5, text: 'Click "Add Question". No answer options are needed.' },
                    {
                      step: 6,
                      text: "To update the correct answer later, use the \"Save Correct Answer\" button on the question card.",
                    },
                  ].map((item) => (
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
                    <span className="font-semibold">Tip:</span> Open-ended questions work best for single-word or short-phrase answers (e.g. country capitals, chemical formulas, historical dates). For longer answers, multiple-choice is more reliable.
                  </p>
                </div>
              </div>
            )}

            {/* ── Tab 2: Excel format ── */}
            {tab === "excel" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Excel / CSV column format</h3>
                  <p className="text-sm text-slate-600">
                    Column <span className="font-mono font-semibold">G</span> controls the question type.
                    Leave it blank or write <code className="bg-slate-100 px-1 rounded">MC</code> for multiple-choice,
                    or write <code className="bg-slate-100 px-1 rounded">OA</code> for open-answer.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="text-xs w-full border-collapse rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-slate-100">
                        {["A — Question", "B — Option 1", "C — Option 2", "D — Option 3", "E — Option 4", "F — Correct / Answer", "G — Type"].map((h, i) => (
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
                    <p className="text-sm font-semibold text-blue-900 mb-2">Multiple Choice (MC)</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Column G: <code className="bg-blue-100 px-1 rounded">MC</code> or leave blank</li>
                      <li>• Columns B–E: four answer options</li>
                      <li>• Column F: correct option number (1, 2, 3 or 4)</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-purple-900 mb-2">Open Answer (OA)</p>
                    <ul className="text-xs text-purple-800 space-y-1">
                      <li>• Column G: <code className="bg-purple-100 px-1 rounded">OA</code></li>
                      <li>• Columns B–E: leave empty</li>
                      <li>• Column F: the expected correct answer text</li>
                      <li>• Matching is case-insensitive</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Accepted values for column G:</span>{" "}
                    <code className="bg-slate-200 px-1 rounded font-mono">MC</code>,{" "}
                    <code className="bg-slate-200 px-1 rounded font-mono">OA</code>,{" "}
                    <code className="bg-slate-200 px-1 rounded font-mono">OPEN</code>, or blank (defaults to MC).
                    Both flows support OA — "Create from Excel" and "Add to existing test".
                  </p>
                </div>
              </div>
            )}

            {/* ── Tab 3: Subjects ── */}
            {tab === "subjects" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Assigning subjects when uploading Excel</h3>
                  <p className="text-sm text-slate-600">
                    Subjects are assigned at the <span className="font-medium">test level</span>, not per-question.
                    There are two ways to assign a subject:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center shrink-0 font-bold text-emerald-800 text-sm">1</div>
                    <div>
                      <p className="font-semibold text-emerald-900 text-sm mb-1">During Excel upload (create new test)</p>
                      <p className="text-xs text-emerald-800">
                        After selecting your Excel file and previewing the questions, a{" "}
                        <span className="font-semibold">Subject dropdown</span> appears above the "Create Test" button.
                        Select the subject before clicking confirm — it applies to the entire test.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-indigo-200 flex items-center justify-center shrink-0 font-bold text-indigo-800 text-sm">2</div>
                    <div>
                      <p className="font-semibold text-indigo-900 text-sm mb-1">From the manual Create Test form</p>
                      <p className="text-xs text-indigo-800">
                        Scroll down past the Excel upload section to the <span className="font-semibold">Create New Test</span> form.
                        It has a Subject dropdown — choose the subject before clicking "Create Test".
                        You can also change the subject later from the Test Settings panel inside the test.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="text-xs w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">Subject</th>
                        <th className="border border-slate-200 px-3 py-2 text-center text-slate-700 font-semibold">Icon</th>
                        <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">Uz</th>
                        <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">En</th>
                        <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">Ru</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        ["Mathematics", "📐", "Matematika", "Mathematics", "Математика"],
                        ["Physics", "⚡", "Fizika", "Physics", "Физика"],
                        ["Chemistry", "⚗️", "Kimyo", "Chemistry", "Химия"],
                        ["Biology", "🔬", "Biologiya", "Biology", "Биология"],
                        ["History", "📚", "Tarix", "History", "История"],
                        ["Geography", "🌍", "Geografiya", "Geography", "География"],
                        ["Literature", "📖", "Adabiyot", "Literature", "Литература"],
                        ["English", "🇬🇧", "Ingliz tili", "English", "Английский"],
                        ["Computer Science", "💻", "Informatika", "Computer Science", "Информатика"],
                        ["General", "📝", "Umumiy", "General", "Общее"],
                      ].map(([name, icon, uz, en, ru]) => (
                        <tr key={name} className="bg-white hover:bg-slate-50">
                          <td className="border border-slate-200 px-3 py-1.5 font-mono text-xs text-slate-700">{name}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-center">{icon}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-slate-600">{uz}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-slate-600">{en}</td>
                          <td className="border border-slate-200 px-3 py-1.5 text-slate-600">{ru}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500">
                  Subjects are used to group tests on the student-facing tests page and help students find relevant content faster.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
