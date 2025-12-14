"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Sparkles,
  RotateCw,
  AlertCircle,
  Sun,
  Moon,
  ChevronLeft,
  Copy,
  Check,
} from "lucide-react";
import { useExercice } from "@/hooks/ExerciceHook";
import SidebarExercices, {
  SidebarExercicesHandle,
} from "@/app/exercice/components/SidebarExercices";
import { useRouter } from "next/navigation";

type QuestionKind = "qcm" | "problemes" | "etudes_de_cas";

interface QCMItem {
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation: string;
}

interface GeneratedData {
  type: QuestionKind;
  title: string;
  questionCount?: number;
  content: QCMItem[] | any;
}

/*
  Custom dropdown TypeSelect (fully stylable & accessible).
  Note: to avoid clipping by parent containers with overflow:hidden,
  we changed the main card wrapper to overflow-visible.
*/
function TypeSelect({
  value,
  onChange,
  isDarkMode,
}: {
  value: QuestionKind;
  onChange: (v: QuestionKind) => void;
  isDarkMode: boolean;
}) {
  const OPTIONS: { value: QuestionKind; label: string }[] = [
    { value: "qcm", label: "MCQ (Multiple Choice)" },
    { value: "problemes", label: "Solved Problems" },
    { value: "etudes_de_cas", label: "Case Studies" },
  ];

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(
    OPTIONS.findIndex((o) => o.value === value)
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
      useEffect(() => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (!token) {
            router.replace("/login");
          }
        }
      }, [router]);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  useEffect(() => {
    setHighlight(OPTIONS.findIndex((o) => o.value === value));
  }, [value]);

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, OPTIONS.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open) {
        const opt = OPTIONS[highlight];
        if (opt) onChange(opt.value);
        setOpen(false);
      } else {
        setOpen(true);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={`w-full text-left px-5 py-4 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-cyan-400/20 flex items-center justify-between ${
          isDarkMode
            ? "bg-[#0b0f12] border-white/20 text-white"
            : "bg-white/80 border-blue-300 text-gray-900"
        }`}
      >
        <span className="truncate">
          {OPTIONS.find((o) => o.value === value)?.label ?? "Type"}
        </span>
        <svg
          className="ml-3 w-4 h-4 text-gray-300"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={`type-option-${highlight}`}
          tabIndex={-1}
          className={`absolute z-50 mt-2 w-full rounded-lg shadow-lg overflow-auto max-h-56 divide-y ${
            isDarkMode ? "bg-[#0b0f12] divide-gray-800" : "bg-white"
          }`}
        >
          {OPTIONS.map((opt, idx) => {
            const isHighlighted = idx === highlight;
            const isSelected = opt.value === value;
            return (
              <li
                id={`type-option-${idx}`}
                role="option"
                aria-selected={isSelected}
                key={opt.value}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`cursor-pointer px-4 py-3 flex items-center gap-3 ${
                  isHighlighted ? (isDarkMode ? "bg-cyan-700/20" : "bg-blue-100") : ""
                } ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ml-auto ${isDarkMode ? "text-cyan-300" : "text-blue-600"}`}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function Page() {
  const { createExercice } = useExercice();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionKind>("qcm");
  const [qcmCount, setQcmCount] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [activeExerciceId, setActiveExerciceId] = useState<string | null>(null);

  // ref vers la sidebar
  const sidebarRef = useRef<SidebarExercicesHandle | null>(null);

  const Userid =
    (typeof window !== "undefined" && localStorage.getItem("userId")) || "";

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(media.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const onDrop = useCallback((droppedFile: File) => {
    setFile(droppedFile);
    setError(null);
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onDrop(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onDrop(f);
  };

  const handleGenerate = async () => {
    if (!file) return setError("Please select a PDF file");

    setLoading(true);
    setError(null);
    setResult(null);
    setActiveExerciceId(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", questionType);
    if (questionType === "qcm") formData.append("count", qcmCount.toString());

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Non-JSON server response: ${text.slice(0, 800)}...`);
      }

      if (!res.ok) {
        const details =
          typeof json.details === "string"
            ? json.details
            : typeof json.error === "string"
            ? json.error
            : JSON.stringify(json, null, 2);
        throw new Error(details);
      }

      setResult(json.data as GeneratedData);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setSelectedAnswers({});
    setShowExplanations({});
    setActiveExerciceId(null);
  };

  const copyResults = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // IMPORTANT: modification ici pour que le dernier exercice sauvegardé
  // apparaisse en premier dans la sidebar immédiatement après le "save".
  const save = () => {
    if (!result) return;
    if (!Userid) {
      console.error("User ID is not available. Cannot save exercice.");
      return;
    }
    createExercice({
      userID: Userid,
      title: result.title,
      type: result.type,
      questions: result.content,
      correctAnswers:
        result.content instanceof Array
          ? result.content.map((item: QCMItem) => item.answer)
          : [],
    })
      .then((res) => {
        console.log("Exercise saved:", res);

        // Robust handling: some APIs return { data: savedObject } while others return the object directly
        const savedExercice = res?.data ?? res;

        // Add the saved exercice at the top of the sidebar without waiting for a full reload
        // SidebarExercices exposes addExerciceAtTop via ref (see SidebarExercices component)
        if (savedExercice) {
          sidebarRef.current?.addExerciceAtTop(savedExercice);
          // mark as active so it appears selected
          setActiveExerciceId(savedExercice._id ?? null);
        } else {
          // fallback: if we didn't get the created object, refresh the list
          sidebarRef.current?.reloadExercices();
        }

        // Faire défiler la page principale en haut pour "mettre la conversation en haut"
        if (typeof window !== "undefined" && window.scrollTo) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        // addExerciceAtTop already scrolls the aside to top, so no need to do it again here
      })
      .catch((err) => {
        console.error("Error saving exercise:", err);
      });
  };

  const handleSelectExercice = (exercice: any) => {
    setActiveExerciceId(exercice._id || null);
    setResult({
      type: exercice.type,
      title: exercice.title,
      questionCount: exercice.questions?.length,
      content: exercice.questions,
    });
    setSelectedAnswers({});
    setShowExplanations({});
  };

  const Background = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isDarkMode
            ? "bg-gradient-to-br from-[#0a0e17] via-[#0f1419] to-[#0a0e17]"
            : "bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100"
        } animate-gradient-xy`}
      />
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 animate-float"
          style={{
            background: isDarkMode
              ? i % 2 === 0
                ? "radial-gradient(circle, #06b6d4, transparent)"
                : "radial-gradient(circle, #60a5fa, transparent)"
              : i % 2 === 0
              ? "radial-gradient(circle, #7dd3fc, transparent)"
              : "radial-gradient(circle, #93c5fd, transparent)",
            top: `${10 + i * 20}%`,
            left: i % 2 === 0 ? "10%" : "60%",
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  );

  const DarkModeToggle = () => (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`fixed top-6 right-6 z-50 p-3 rounded-2xl transition-all duration-300 shadow-lg ${
        isDarkMode
          ? "bg-white/10 hover:bg-white/20 text-yellow-400"
          : "bg-white/80 hover:bg-white text-blue-600 shadow-xl"
      } backdrop-blur-xl`}
    >
      {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  );

  const ResultView = () => {
    if (!result) return null;

    const isQCM = result.type === "qcm";
    const qcmContent: QCMItem[] =
      isQCM && Array.isArray(result.content) ? (result.content as QCMItem[]) : [];
    const computedCount = isQCM ? result.questionCount ?? qcmContent.length : undefined;

    return (
      <>
        <div className="p-6 border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={reset}
              className="flex items-center gap-3 text-cyan-300 hover:text-cyan-200 transition"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="font-medium">New Generation</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {result.title}
              </h1>
              <p className="mt-4 text-lg text-gray-400">
                {isQCM && `${computedCount} questions generated`}
                {result.type === "problemes" && "Problèmes corrigés"}
                {result.type === "etudes_de_cas" && "Étude de cas complète"}
              </p>
            </div>

            <div
              className={`backdrop-blur-2xl rounded-3xl border ${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-blue-200"
              } p-8`}
            >
              {isQCM && (
                <div className="space-y-8">
                  {qcmContent.map((item: QCMItem, idx: number) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border ${
                        isDarkMode ? "border-white/20 bg-white/5" : "border-blue-200 bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-cyan-300">
                          Question {idx + 1}
                        </h3>
                        <span className="text-sm text-gray-500">Choose an answer</span>
                      </div>
                      {/* Question text: force black in light mode */}
                      <p className={`text-lg mb-6 ${isDarkMode ? "text-white" : "text-black"}`}>
                        {item.question}
                      </p>
                      <div className="grid gap-3">
                        {Object.entries(item.options).map(([letter, text]) => {
                          const isSelected = selectedAnswers[idx] === letter;
                          const isCorrect = letter === item.answer;
                          const showCorrect = showExplanations[idx] || isSelected;

                          return (
                            <button
                              key={letter}
                              onClick={() =>
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [idx]: letter,
                                }))
                              }
                              disabled={!!showExplanations[idx]}
                              className={`p-4 rounded-xl text-left transition-all ${
                                showCorrect && isCorrect
                                  ? "bg-green-500/20 border-2 border-green-400 text-green-300"
                                  : showCorrect && isSelected && !isCorrect
                                  ? "bg-red-500/20 border-2 border-red-400 text-red-300"
                                  : isSelected
                                  ? `bg-cyan-500/20 border-2 border-cyan-400 ${isDarkMode ? "text-white" : "text-black"}`
                                  : isDarkMode
                                  ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                                  : "bg-white hover:bg-blue-50 border border-blue-300 text-black"
                              }`}
                            >
                              <span className="font-medium">{letter}. </span>
                              <span className={`${isDarkMode ? "text-white" : "text-black"}`}>{text}</span>
                            </button>
                          );
                        })}
                      </div>
                      {(showExplanations[idx] || selectedAnswers[idx]) && (
                        <div className="mt-6 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                          <p className="text-cyan-300 font-medium mb-2">Explanation</p>
                          <p className={`text-sm ${isDarkMode ? "text-white" : "text-black"}`}>{item.explanation}</p>
                        </div>
                      )}
                      {!showExplanations[idx] && selectedAnswers[idx] && (
                        <button
                          onClick={() =>
                            setShowExplanations((prev) => ({
                              ...prev,
                              [idx]: true,
                            }))
                          }
                          className="mt-4 text-sm text-cyan-400 hover:text-cyan-300"
                        >
                          Show explanation
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {result.type === "problemes" && Array.isArray(result.content) && (
                <div className="space-y-8">
                  {result.content.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border ${
                        isDarkMode ? "border-white/20 bg-white/5" : "border-blue-200 bg-blue-50/50"
                      }`}
                    >
                      <h3 className="text-xl font-bold text-cyan-300 mb-4">Problème {idx + 1}</h3>
                      <div className="prose prose-invert max-w-none mb-6">
                        <pre className={`whitespace-pre-wrap font-sans ${isDarkMode ? "text-white" : "text-black"}`}>{item.problem}</pre>
                      </div>
                      <details className="mt-6">
                        <summary className="cursor-pointer text-cyan-400 font-medium">Voir la solution</summary>
                        <div className="mt-4 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                          <pre className={`whitespace-pre-wrap font-sans text-sm ${isDarkMode ? "text-white" : "text-black"}`}>{item.solution}</pre>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}

              {result.type === "etudes_de_cas" && result.content && (
                <div className="space-y-8">
                  <div
                    className={`p-8 rounded-2xl border ${
                      isDarkMode ? "border-cyan-500/30 bg-cyan-500/10" : "border-cyan-300 bg-cyan-50"
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-cyan-300 mb-6">Étude de cas</h3>
                    <div className="prose prose-invert max-w-none">
                      <pre className={`whitespace-pre-wrap font-sans ${isDarkMode ? "text-white" : "text-black"}`}>{result.content.case}</pre>
                    </div>
                  </div>
                  {Array.isArray(result.content.questions) &&
                    result.content.questions.map((q: any, idx: number) => (
                      <details
                        key={idx}
                        className={`p-6 rounded-2xl border ${
                          isDarkMode ? "border-white/20 bg-white/5" : "border-blue-200 bg-blue-50/50"
                        }`}
                      >
                        <summary className="cursor-pointer text-lg font-semibold text-cyan-300">
                          Question {idx + 1}: {q.question}
                        </summary>
                        <div className="mt-4 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                          <pre className={`whitespace-pre-wrap font-sans text-sm ${isDarkMode ? "text-white" : "text-black"}`}>{q.answer}</pre>
                        </div>
                      </details>
                    ))}
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <button
                onClick={save}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all hover:scale-105 shadow-xl"
              >
                Save Exercise
              </button>

              <button
                onClick={copyResults}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-cyan-400/60 bg-transparent hover:bg-cyan-500/10 text-cyan-300 font-medium transition-all hover:scale-105 shadow-xl"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const FormView = () => (
    <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-all duration-300 group border border-gray-700/50 backdrop-blur-sm"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium">Back</span>
      </button>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 shadow-2xl shadow-cyan-400/30 mb-6">
            <Sparkles className="w-9 h-9 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-shimmer">
            Exercise Generator
          </h1>
          <p className={`mt-4 text-lg max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Create corrected exercises based on your course (MCQs, problems, case studies) from a PDF.
          </p>
        </div>

        {/* IMPORTANT: overflow-visible so our custom dropdown can extend outside the card */}
        <div
          className={`backdrop-blur-2xl rounded-3xl border shadow-2xl overflow-visible transition-all duration-500 ${
            isDarkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-blue-200 shadow-blue-200/20"
          }`}
        >
          <div className="p-8 space-y-8">
            <div>
              <label
                htmlFor="file-input"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative block p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center group ${
                  isDragging ? "border-cyan-400 bg-cyan-500/10" : isDarkMode ? "border-white/20 bg-white/5" : "border-blue-300 bg-blue-50/50"
                } hover:border-cyan-400 hover:bg-cyan-500/10`}
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-cyan-400/30 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className={`text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {file ? file.name : "Drag and drop your PDF here"}
                    </p>
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>Only PDF files are supported</p>
                  </div>
                </div>
                <input id="file-input" type="file" className="hidden" onChange={onFileInputChange} accept=".pdf" />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className={`text-sm font-semibold ${isDarkMode ? "text-cyan-300" : "text-cyan-600"}`}>Exercise Type</label>

                <TypeSelect value={questionType} onChange={(v) => setQuestionType(v)} isDarkMode={isDarkMode} />
              </div>

              {questionType === "qcm" && (
                <div className="space-y-3">
                  <label className={`text-sm font-semibold ${isDarkMode ? "text-cyan-300" : "text-cyan-600"}`}>Number of Questions</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={qcmCount}
                    onChange={(e) => setQcmCount(Number(e.target.value))}
                    className={`w-full px-5 py-4 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-cyan-400/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      isDarkMode ? "bg-white/10 border-white/20 text-gray-100 focus:border-cyan-400" : "bg-white/80 border-blue-300 text-gray-900 focus:border-cyan-500"
                    }`}
                    placeholder="10"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerate}
                disabled={!file || loading}
                className="flex-1 group relative inline-flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 hover:from-blue-600 hover:via-cyan-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-cyan-400/50 hover:scale-105 disabled:scale-100"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                {loading ? "Generating..." : "Generate Exercises"}
              </button>

              <button
                onClick={reset}
                className={`flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-medium transition-all duration-300 ${
                  isDarkMode ? "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 hover:border-cyan-400" : "bg-white/80 border border-blue-300 text-gray-700 hover:bg-blue-50 hover:border-cyan-500"
                }`}
              >
                <RotateCw className="w-5 h-5" />
                Reset
              </button>
            </div>

            {error && (
              <div className={`flex items-start gap-3 p-5 rounded-xl border text-sm font-medium whitespace-pre-wrap break-words ${isDarkMode ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-200 text-red-700"}`}>
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <p className={`text-center mt-8 text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
          Exercises are AI-generated from your PDF document • Instant results
        </p>
      </div>
    </main>
  );

  return (
    <>
      <Background />
      <DarkModeToggle />

      <div className="min-h-screen flex">
        {Userid && (
          <SidebarExercices ref={sidebarRef} userId={Userid} isDarkMode={isDarkMode} onNewExercice={reset} onSelectExercice={handleSelectExercice} activeExerciceId={activeExerciceId} />
        )}

        <div className={`flex-1 flex flex-col ${Userid ? 'ml-80' : ''}`}>{result ? <ResultView /> : <FormView />}</div>
      </div>

      <style jsx>{`
        @keyframes gradient-xy {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(6deg);
          }
        }
        @keyframes shimmer {
          0%,
          100% {
            background-position: -200% 0;
          }
          50% {
            background-position: 200% 0;
          }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 25s ease infinite;
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
        /* small scrollbar for the dropdown */
        .max-h-56::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .max-h-56::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 6px;
        }
      `}</style>
    </>
  );
}