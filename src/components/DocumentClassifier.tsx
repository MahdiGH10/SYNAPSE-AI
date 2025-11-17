'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import { classifyDocument, getModelInfo, type ClassificationResult, type ModelInfo } from '@/lib/classifier';

export default function DocumentClassifier() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Load model info on mount
  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    const info = await getModelInfo();
    setModelInfo(info);
  };

  const handleClassify = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    const classification = await classifyDocument(text, true);
    setResult(classification);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#060913] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Document Classifier
          </h1>
          <p className="text-gray-400">
            Classify documents using your trained ML model
          </p>

          {/* Model Status */}
          {modelInfo && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-sm">
              {modelInfo.success ? (
                <>
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-green-400">Model Ready</span>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-red-400" />
                  <span className="text-red-400">Service Unavailable</span>
                </>
              )}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
              >
                <Info size={16} />
              </button>
            </div>
          )}

          {/* Model Info Panel */}
          {showInfo && modelInfo?.success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700 text-left"
            >
              <h3 className="text-sm font-semibold text-white mb-2">Model Information</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <p><strong>Type:</strong> {modelInfo.model_type}</p>
                {modelInfo.num_classes && <p><strong>Classes:</strong> {modelInfo.num_classes}</p>}
                {modelInfo.classes && (
                  <p><strong>Categories:</strong> {modelInfo.classes.join(', ')}</p>
                )}
                <p><strong>Probabilities:</strong> {modelInfo.supports_probabilities ? 'Yes' : 'No'}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors w-fit">
                <Upload size={18} className="text-blue-400" />
                <span className="text-sm text-gray-300">Upload Text File</span>
                <input
                  type="file"
                  accept=".txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Text Area */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Document Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter or paste your document text here..."
                className="w-full h-48 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="mt-2 text-sm text-gray-500">
                {text.length} characters
              </div>
            </div>

            {/* Classify Button */}
            <button
              onClick={handleClassify}
              disabled={loading || !text.trim() || !modelInfo?.success}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Classifying...</span>
                </>
              ) : (
                <>
                  <FileText size={20} />
                  <span>Classify Document</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckCircle size={24} className="text-green-400" />
                  Classification Result
                </>
              ) : (
                <>
                  <XCircle size={24} className="text-red-400" />
                  Classification Failed
                </>
              )}
            </h2>

            {result.success ? (
              <div className="space-y-4">
                {/* Prediction */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Predicted Category</p>
                  <p className="text-2xl font-bold text-blue-400">{result.prediction}</p>
                </div>

                {/* Confidence */}
                {result.confidence !== undefined && (
                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Confidence</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        />
                      </div>
                      <span className="text-lg font-semibold text-white">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Probabilities */}
                {result.probabilities && (
                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <p className="text-sm text-gray-400 mb-3">All Probabilities</p>
                    <div className="space-y-2">
                      {Object.entries(result.probabilities)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, probability]) => (
                          <div key={category} className="flex items-center gap-3">
                            <span className="text-sm text-gray-300 w-32 truncate">
                              {category}
                            </span>
                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${probability * 100}%` }}
                                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-12 text-right">
                              {(probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400">{result.error}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
