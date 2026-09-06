import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { Analysis, AnalysisMode } from '../types';

interface HistoryViewProps {
  onOpenAnalysis: (analysisId: string) => void;
  savedOnly?: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onOpenAnalysis, savedOnly = false }) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<'all' | AnalysisMode>('all');
  const [onlySaved, setOnlySaved] = useState(savedOnly);
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = () => {
    setLoading(true);
    const token = localStorage.getItem('satquery_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/analyses', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.analyses) setAnalyses(data.analyses);
      })
      .catch(err => console.error('Error loading history:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleToggleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/analyses/${id}/save`, { method: 'POST' });
      if (res.ok) fetchAnalyses();
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this analysis record?')) return;
    try {
      const res = await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAnalyses();
    } catch (err) {
      console.error('Error deleting analysis:', err);
    }
  };

  const filtered = analyses.filter(a => {
    if (onlySaved && !a.isSaved) return false;
    if (modeFilter !== 'all' && a.mode !== modeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.query.toLowerCase().includes(q) ||
        a.result?.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {onlySaved ? 'Saved Investigations' : 'Analysis History & Archive'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time record of your executed satellite vision-language queries and spatial evidence.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search queries or results..."
              className="bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 w-48 sm:w-60"
            />
          </div>

          <select
            value={modeFilter}
            onChange={e => setModeFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          >
            <option value="all">All Modes</option>
            <option value="single">Single Image</option>
            <option value="bitemporal">Bi-Temporal</option>
            <option value="optical_sar">Optical + SAR</option>
          </select>

          <button
            onClick={() => setOnlySaved(!onlySaved)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              onlySaved
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Bookmark size={13} className={onlySaved ? 'fill-amber-500 text-amber-500' : ''} />
            <span>Saved Only</span>
          </button>
        </div>
      </div>

      {/* Grid of Analyses */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Inbox size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {onlySaved ? 'No saved investigations yet' : 'No analysis records found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {onlySaved
              ? 'Bookmark any analysis in the workspace or history to access it quickly here.'
              : 'Run a query in the Workspace to produce and store real-time satellite intelligence.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => onOpenAnalysis(item.id)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4 cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Mode badge & Save / Delete */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.mode === 'single'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : item.mode === 'bitemporal'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.mode === 'single'
                      ? 'Single Image'
                      : item.mode === 'bitemporal'
                      ? 'Bi-Temporal'
                      : 'Optical + SAR'}
                  </span>

                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={e => handleToggleSave(item.id, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isSaved
                          ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                      }`}
                      title={item.isSaved ? 'Remove from Saved' : 'Save Investigation'}
                    >
                      <Bookmark size={15} className={item.isSaved ? 'fill-amber-500' : ''} />
                    </button>
                    <button
                      onClick={e => handleDelete(item.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Title and Query */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                    "{item.query}"
                  </p>
                </div>

                {/* AI Answer Preview */}
                {item.result && (
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.result.answer}
                  </p>
                )}
              </div>

              {/* Bottom footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {item.result ? (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    {item.result.confidenceScore}% Confidence
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold text-[11px]">{item.status}</span>
                )}

                <div className="flex items-center text-sky-600 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ArrowRight size={13} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
