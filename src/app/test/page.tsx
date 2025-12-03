'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
} from 'lucide-react';

type QuestionKind = 'qcm' | 'problemes' | 'etudes_de_cas';

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

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionKind>('qcm');
  const [qcmCount, setQcmCount] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(media.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
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
    if (!file) return setError('Veuillez sélectionner un fichier');

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', questionType);
    if (questionType === 'qcm') formData.append('count', qcmCount.toString());

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Réponse serveur non JSON: ${text.slice(0, 800)}...`);
      }

      if (!res.ok) {
        // Surface Gemini error details (from API route) to the UI
        const details =
          typeof json.details === 'string'
            ? json.details
            : typeof json.error === 'string'
            ? json.error
            : JSON.stringify(json, null, 2);
        throw new Error(details);
      }

      setResult(json.data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
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
  };

  const copyResults = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If we have results, render the exercise page
  if (result) {
    const isQCM = result.type === 'qcm';
    const qcmContent: QCMItem[] =
      isQCM && Array.isArray(result.content) ? (result.content as QCMItem[]) : [];
    const computedCount = isQCM ? result.questionCount ?? qcmContent.length : undefined;

    return (
      <>
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div
            className={`absolute inset-0 transition-all duration-1000 ${
              isDarkMode
                ? 'bg-gradient-to-br from-[#0a0e17] via-[#0f1419] to-[#0a0e17]'
                : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100'
            } animate-gradient-xy`}
          />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 animate-float"
              style={{
                background: isDarkMode
                  ? i % 2 === 0
                    ? 'radial-gradient(circle, #06b6d4, transparent)'
                    : 'radial-gradient(circle, #60a5fa, transparent)'
                  : i % 2 === 0
                  ? 'radial-gradient(circle, #7dd3fc, transparent)'
                  : 'radial-gradient(circle, #93c5fd, transparent)',
                top: `${10 + i * 20}%`,
                left: i % 2 === 0 ? '10%' : '60%',
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 backdrop-blur-xl">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button
                onClick={reset}
                className="flex items-center gap-3 text-cyan-300 hover:text-cyan-200 transition"
              >
                <ChevronLeft className="w-6 h-6" />
                <span className="font-medium">Nouvelle génération</span>
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
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
                  {isQCM && `${computedCount} questions générées`}
                  {result.type === 'problemes' && 'Problèmes corrigés'}
                  {result.type === 'etudes_de_cas' && 'Étude de cas complète'}
                </p>
              </div>

              <div
                className={`backdrop-blur-2xl rounded-3xl border ${
                  isDarkMode
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/70 border-blue-200'
                } p-8`}
              >
                {isQCM && (
                  <div className="space-y-8">
                    {qcmContent.map((item: QCMItem, idx: number) => (
                      <div
                        key={idx}
                        className={`p-6 rounded-2xl border ${
                          isDarkMode
                            ? 'border-white/20 bg-white/5'
                            : 'border-blue-200 bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-cyan-300">
                            Question {idx + 1}
                          </h3>
                          <span className="text-sm text-gray-500">Choisissez une réponse</span>
                        </div>
                        <p className="text-lg mb-6">{item.question}</p>
                        <div className="grid gap-3">
                          {Object.entries(item.options).map(([letter, text]) => {
                            const isSelected = selectedAnswers[idx] === letter;
                            const isCorrect = letter === item.answer;
                            const showCorrect = showExplanations[idx] || isSelected;

                            return (
                              <button
                                key={letter}
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [idx]: letter }))
                                }
                                disabled={!!showExplanations[idx]}
                                className={`p-4 rounded-xl text-left transition-all ${
                                  showCorrect && isCorrect
                                    ? 'bg-green-500/20 border-2 border-green-400 text-green-300'
                                    : showCorrect && isSelected && !isCorrect
                                    ? 'bg-red-500/20 border-2 border-red-400 text-red-300'
                                    : isSelected
                                    ? 'bg-cyan-500/20 border-2 border-cyan-400'
                                    : isDarkMode
                                    ? 'bg-white/10 hover:bg-white/20 border border-white/20'
                                    : 'bg-white hover:bg-blue-50 border border-blue-300'
                                }`}
                              >
                                <span className="font-medium">{letter}. </span>
                                {text}
                              </button>
                            );
                          })}
                        </div>
                        {(showExplanations[idx] || selectedAnswers[idx]) && (
                          <div className="mt-6 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                            <p className="text-cyan-300 font-medium mb-2">Explication</p>
                            <p className="text-sm">{item.explanation}</p>
                          </div>
                        )}
                        {!showExplanations[idx] && selectedAnswers[idx] && (
                          <button
                            onClick={() =>
                              setShowExplanations((prev) => ({ ...prev, [idx]: true }))
                            }
                            className="mt-4 text-sm text-cyan-400 hover:text-cyan-300"
                          >
                            Voir l&apos;explication
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {result.type === 'problemes' && Array.isArray(result.content) && (
                  <div className="space-y-8">
                    {result.content.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-6 rounded-2xl border ${
                          isDarkMode
                            ? 'border-white/20 bg-white/5'
                            : 'border-blue-200 bg-blue-50/50'
                        }`}
                      >
                        <h3 className="text-xl font-bold text-cyan-300 mb-4">
                          Problème {idx + 1}
                        </h3>
                        <div className="prose prose-invert max-w-none mb-6">
                          <pre className="whitespace-pre-wrap font-sans">{item.problem}</pre>
                        </div>
                        <details className="mt-6">
                          <summary className="cursor-pointer text-cyan-400 font-medium">
                            Voir la solution
                          </summary>
                          <div className="mt-4 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                            <pre className="whitespace-pre-wrap font-sans text-sm">
                              {item.solution}
                            </pre>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                )}

                {result.type === 'etudes_de_cas' && result.content && (
                  <div className="space-y-8">
                    <div
                      className={`p-8 rounded-2xl border ${
                        isDarkMode
                          ? 'border-cyan-500/30 bg-cyan-500/10'
                          : 'border-cyan-300 bg-cyan-50'
                      }`}
                    >
                      <h3 className="text-2xl font-bold text-cyan-300 mb-6">Étude de cas</h3>
                      <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans">
                          {result.content.case}
                        </pre>
                      </div>
                    </div>
                    {Array.isArray(result.content.questions) &&
                      result.content.questions.map((q: any, idx: number) => (
                        <details
                          key={idx}
                          className={`p-6 rounded-2xl border ${
                            isDarkMode
                              ? 'border-white/20 bg-white/5'
                              : 'border-blue-200 bg-blue-50/50'
                          }`}
                        >
                          <summary className="cursor-pointer text-lg font-semibold text-cyan-300">
                            Question {idx + 1}: {q.question}
                          </summary>
                          <div className="mt-4 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                            <pre className="whitespace-pre-wrap font-sans text-sm">
                              {q.answer}
                            </pre>
                          </div>
                        </details>
                      ))}
                  </div>
                )}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={copyResults}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all hover:scale-105 shadow-xl"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copié !' : 'Copier au format JSON'}
                </button>
              </div>
            </div>
          </div>
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
          .animate-gradient-xy {
            background-size: 400% 400%;
            animation: gradient-xy 25s ease infinite;
          }
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        `}</style>
      </>
    );
  }

  // Otherwise, render the form
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            isDarkMode
              ? 'bg-gradient-to-br from-[#0a0e17] via-[#0f1419] to-[#0a0e17]'
              : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100'
          } animate-gradient-xy`}
        />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 animate-float"
            style={{
              background: isDarkMode
                ? i % 2 === 0
                  ? 'radial-gradient(circle, #06b6d4, transparent)'
                  : 'radial-gradient(circle, #60a5fa, transparent)'
                : i % 2 === 0
                ? 'radial-gradient(circle, #7dd3fc, transparent)'
                : 'radial-gradient(circle, #93c5fd, transparent)',
              top: `${10 + i * 20}%`,
              left: i % 2 === 0 ? '10%' : '60%',
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      <main className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`fixed top-6 right-6 z-50 p-3 rounded-2xl transition-all duration-300 shadow-lg ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/20 text-yellow-400'
              : 'bg-white/80 hover:bg-white text-blue-600 shadow-xl'
          } backdrop-blur-xl`}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 shadow-2xl shadow-cyan-400/30 mb-6">
              <Sparkles className="w-9 h-9 text-white animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-shimmer">
              Générateur d’exercices
            </h1>
            <p
              className={`mt-4 text-lg max-w-2xl mx-auto ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Génération d’exemples: Crée des exercices corrigés basés sur le cours (QCM,
              problèmes, études de cas).
            </p>
          </div>

          <div
            className={`backdrop-blur-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-500 ${
              isDarkMode
                ? 'bg-white/5 border-white/10'
                : 'bg-white/70 border-blue-200 shadow-blue-200/20'
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
                    isDragging
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : isDarkMode
                      ? 'border-white/20 bg-white/5'
                      : 'border-blue-300 bg-blue-50/50'
                  } hover:border-cyan-400 hover:bg-cyan-500/10`}
                >
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-cyan-400/30 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p
                        className={`text-lg font-medium ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        {file ? file.name : 'Glissez-déposez votre fichier ici'}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-600'
                        }`}
                      >
                        PDF, TXT, image • Cliquez pour sélectionner
                      </p>
                    </div>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={onFileInputChange}
                    accept=".pdf,.txt,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label
                    className={`text-sm font-semibold ${
                      isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                    }`}
                  >
                    Type d’exercice
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as QuestionKind)}
                    className={`w-full px-5 py-4 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-cyan-400/20 ${
                      isDarkMode
                        ? 'bg-white/10 border-white/20 text-gray-100 focus:border-cyan-400'
                        : 'bg-white/80 border-blue-300 text-gray-900 focus:border-cyan-500'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '12px',
                    }}
                  >
                    <option value="qcm">QCM</option>
                    <option value="problemes">Problèmes corrigés</option>
                    <option value="etudes_de_cas">Études de cas</option>
                  </select>
                </div>

                {questionType === 'qcm' && (
                  <div className="space-y-3">
                    <label
                      className={`text-sm font-semibold ${
                        isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                      }`}
                    >
                      Nombre de questions
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={qcmCount}
                      onChange={(e) => setQcmCount(Number(e.target.value))}
                      className={`w-full px-5 py-4 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-cyan-400/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode
                          ? 'bg-white/10 border-white/20 text-gray-100 focus:border-cyan-400'
                          : 'bg-white/80 border-blue-300 text-gray-900 focus:border-cyan-500'
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
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  )}
                  {loading ? 'Génération en cours...' : 'Générer les exercices'}
                </button>

                <button
                  onClick={reset}
                  className={`flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 hover:border-cyan-400'
                      : 'bg-white/80 border border-blue-300 text-gray-700 hover:bg-blue-50 hover:border-cyan-500'
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                  Réinitialiser
                </button>
              </div>

              {error && (
                <div
                  className={`flex items-start gap-3 p-5 rounded-xl border text-sm font-medium whitespace-pre-wrap break-words ${
                    isDarkMode
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          <p
            className={`text-center mt-8 text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}
          >
            Les exercices sont générés par IA à partir de votre document • Résultats instantanés
          </p>
        </div>
      </main>

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
      `}</style>
    </>
  );
}