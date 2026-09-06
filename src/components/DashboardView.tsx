import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  GitCompare,
  Radar,
  FileText,
  Clock,
  CheckCircle2,
  Bookmark,
  Cpu,
  Layers,
  BarChart3,
  Trash2,
  PlusCircle,
  FolderOpen
} from 'lucide-react';
import { Analysis } from '../types';

interface DashboardViewProps {
  onOpenAnalysis: (analysisId: string) => void;
  onNewAnalysis: (mode: 'single' | 'bitemporal' | 'optical_sar') => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAnalysis,
  onNewAnalysis,
  onNavigate
}) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [reportsCount, setReportsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    const token = localStorage.getItem('satquery_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    Promise.all([
      fetch('/api/analyses', { headers }).then(r => r.json()),
      fetch('/api/reports', { headers }).then(r => r.json())
    ])
      .then(([analysesData, reportsData]) => {
        if (analysesData.analyses) setAnalyses(analysesData.analyses);
        if (reportsData.reports) setReportsCount(reportsData.reports.length);
      })
      .catch(err => console.error('Error loading dashboard:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all analysis history and saved reports?')) {
      return;
    }
    try {
      await fetch('/api/analyses/clear/all', { method: 'DELETE' });
      setAnalyses([]);
      setReportsCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const savedCount = analyses.filter(a => a.isSaved).length;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Crisp White Header Card */}
      <div className="rounded-2xl bg-white p-6 sm:p-7 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-700">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>Real-Time Earth Observation AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Satellite Intelligence Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Ask natural language queries over multispectral optical and radar (SAR) imagery.
              Run real-time vision-language models, track visual evidence, and export technical dossiers.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNewAnalysis('single')}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Sparkles size={14} />
              <span>Launch Workspace</span>
            </button>
            {analyses.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Clear all history and start fresh"
              >
                <Trash2 size={14} />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Live Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Queries Run</span>
            <Layers size={18} className="text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{analyses.length}</span>
            <span className="text-xs text-slate-500 font-medium">real-time</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Saved Investigations</span>
            <Bookmark size={18} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{savedCount}</span>
            <span className="text-xs text-slate-500 font-medium">bookmarked</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Generated Reports</span>
            <FileText size={18} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{reportsCount}</span>
            <span className="text-xs text-slate-500 font-medium">dossiers</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Inference Latency</span>
            <Cpu size={18} className="text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">0.45s</span>
            <span className="text-xs text-emerald-600 font-bold">Cloud TPU</span>
          </div>
        </div>
      </div>

      {/* 3 Quick Launch Workflows */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Start an Analysis Workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Single Image */}
          <div
            onClick={() => onNewAnalysis('single')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Eye size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Single-Image Vision QA & Grounding</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analyze a single satellite scene. Ask to locate harbor infrastructure, count vessels, identify water bodies, or classify land-use.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-sky-600 group-hover:text-sky-700">
              <span>Open in Workspace</span>
              <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bi-Temporal */}
          <div
            onClick={() => onNewAnalysis('bitemporal')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GitCompare size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Bi-Temporal Change Detection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare imagery across time (e.g. 2021 vs 2024). Calculate urban expansion, deforestation rates, and new construction with side-by-side swipe.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
              <span>Open in Workspace</span>
              <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Optical + SAR */}
          <div
            onClick={() => onNewAnalysis('optical_sar')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Radar size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Optical + Radar (SAR) Fusion</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Penetrate dense cloud cover using Sentinel-1 C-Band synthetic aperture radar microwave backscatter combined with Sentinel-2 optical imagery.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
              <span>Open in Workspace</span>
              <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Recent Analyses or Friendly Clean Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Real-Time Queries</h3>
            <p className="text-xs text-slate-500">Your processed satellite vision-language investigations</p>
          </div>
          {analyses.length > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <span>View Full Archive</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>

        {analyses.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">No analyses run yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Launch the workspace to upload a GeoTIFF or select a sample dataset, ask any question in plain English, and see real-time vision-language results here!
              </p>
            </div>
            <button
              onClick={() => onNewAnalysis('single')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2"
            >
              <PlusCircle size={14} />
              <span>Run Your First Analysis</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {analyses.slice(0, 5).map(analysis => (
              <div
                key={analysis.id}
                onClick={() => onOpenAnalysis(analysis.id)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        analysis.mode === 'single'
                          ? 'bg-sky-100 text-sky-800'
                          : analysis.mode === 'bitemporal'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {analysis.mode === 'single'
                        ? 'Single Image'
                        : analysis.mode === 'bitemporal'
                        ? 'Bi-Temporal'
                        : 'Optical + SAR'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {analysis.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{analysis.query}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {analysis.result && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {analysis.result.confidenceScore}% Confidence
                    </span>
                  )}
                  <span className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                    Open <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3-Step Clear User Guide */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          How SatQuery AI Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h4 className="font-bold text-slate-900">Upload or Select Image</h4>
            <p className="text-slate-500 leading-relaxed">
              Upload any GeoTIFF, PNG, or select pre-aligned Sentinel-2 or Sentinel-1 sample imagery.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h4 className="font-bold text-slate-900">Ask Natural Language Query</h4>
            <p className="text-slate-500 leading-relaxed">
              Ask to detect vessels, assess urban expansion, or penetrate clouds using radar backscatter.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h4 className="font-bold text-slate-900">Specialist AI Result & Chat</h4>
            <p className="text-slate-500 leading-relaxed">
              View official vision model metrics and bounding boxes, or chat with the interactive AI assistant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
