'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, FileText, Folder, Search, BarChart3, Filter, 
  Download, Trash2, Eye, Tag, Calendar, TrendingUp 
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  content: string;
  classification: {
    category: string;
    confidence: number;
    probabilities: Record<string, number>;
  };
  createdAt: Date;
  tags: string[];
}

interface Workspace {
  id: string;
  name: string;
  category: string;
  documentCount: number;
  stats: {
    totalDocuments: number;
    categoryDistribution: Record<string, number>;
    averageConfidence: number;
  };
}

export default function DocumentWorkspace() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action: 'get-workspaces' }),
      });
      const data = await response.json();
      if (data.success) {
        setWorkspaces(data.workspaces);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  };

  const uploadDocument = async (file: File) => {
    setIsUploading(true);
    try {
      const content = await file.text();
      const response = await fetch('/api/workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action: 'add-document',
          documentName: file.name,
          documentContent: content,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadWorkspaces();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const loadWorkspaceDocuments = async (workspaceId: string) => {
    try {
      const response = await fetch('/api/workspace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          action: 'get-workspace',
          workspaceId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setDocuments(data.workspace.documents);
        setSelectedWorkspace(workspaceId);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Smart Document Workspace
          </h1>
          <p className="text-gray-400">Automatically organized by AI classification</p>
        </div>

        {/* Upload Zone */}
        <div className="mb-8">
          <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-gray-900/30">
            <div className="text-center">
              <Upload className="mx-auto mb-3 text-gray-400" size={40} />
              <p className="text-lg font-medium">Drop documents here or click to upload</p>
              <p className="text-sm text-gray-500">Documents are automatically classified and organized</p>
            </div>
            <input
              type="file"
              multiple
              accept=".txt,.md,.doc,.docx,.pdf"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(uploadDocument);
              }}
            />
          </label>
        </div>

        {/* Stats Overview */}
        {workspaces.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-6 rounded-xl border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Total Workspaces</span>
                <Folder className="text-blue-400" size={20} />
              </div>
              <p className="text-3xl font-bold">{workspaces.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Total Documents</span>
                <FileText className="text-purple-400" size={20} />
              </div>
              <p className="text-3xl font-bold">
                {workspaces.reduce((sum, w) => sum + w.documentCount, 0)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-6 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Avg Confidence</span>
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <p className="text-3xl font-bold">
                {(workspaces.reduce((sum, w) => sum + w.stats.averageConfidence, 0) / workspaces.length * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 p-6 rounded-xl border border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Categories</span>
                <BarChart3 className="text-orange-400" size={20} />
              </div>
              <p className="text-3xl font-bold">
                {new Set(workspaces.map(w => w.category)).size}
              </p>
            </div>
          </div>
        )}

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => loadWorkspaceDocuments(workspace.id)}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-xl border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                  <Folder className="text-blue-400" size={24} />
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                  {workspace.documentCount} docs
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{workspace.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{workspace.category}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Avg confidence: {(workspace.stats.averageConfidence * 100).toFixed(1)}%</span>
                <Eye size={14} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {workspaces.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <FileText size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl mb-2">No documents yet</p>
            <p className="text-sm">Upload your first document to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
