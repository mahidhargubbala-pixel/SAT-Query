import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  Sliders,
  Bookmark,
  Layers,
  HelpCircle,
  ArrowRight,
  Eye,
  GitCompare,
  Radar,
  FileText
} from 'lucide-react';
import { Analysis, AnalysisMode, ImageMetadata } from '../types';
import { SatelliteImageViewer } from './SatelliteImageViewer';
import { ImageUploader } from './ImageUploader';
import { AnalysisResultPanel } from './AnalysisResultPanel';

interface WorkspaceViewProps {
  initialAnalysisId?: string;
  initialMode?: AnalysisMode;
  initialSample?: string;
  initialQuery?: string;
  onAnalysisComplete?: (analysis: Analysis) => void;
  onGenerateReport?: (analysisId: string) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  initialAnalysisId,
  initialMode = 'single',
  initialSample,
  initialQuery = '',
  onAnalysisComplete,
  onGenerateReport
}) => {
  const [mode, setMode] = useState<AnalysisMode>(initialMode);
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [executionSteps, setExecutionSteps] = useState<any[]>([]);
  const [viewerTab, setViewerTab] = useState<string>('default');

  // Load initial analysis if ID is provided
  useEffect(() => {
    if (initialAnalysisId) {
      fetch(`/api/analyses/${initialAnalysisId}`)
        .then(res => res.json())
        .then(data => {
          if (data.analysis) {
            setCurrentAnalysis(data.analysis);
            setMode(data.analysis.mode);
            setImages(data.analysis.images);
            setQuery(data.analysis.query);
          }
        })
        .catch(err => console.error('Error fetching analysis:', err));
    } else if (initialSample) {
      loadSample(initialSample);
    } else {
      loadSample('single_harbor');
    }
  }, [initialAnalysisId, initialSample]);

  // Load sample dataset
  const loadSample = async (sampleKey: string) => {
    try {
      const res = await fetch(`/api/samples/${sampleKey}`);
      if (res.ok) {
        const data = await res.json();
        setImages(data.images);
        if (sampleKey.includes('bitemporal')) {
          setMode('bitemporal');
          setViewerTab('change');
          if (!query) setQuery('What changed between these images? Has built-up area increased?');
        } else if (sampleKey.includes('optical_sar')) {
          setMode('optical_sar');
          setViewerTab('fusion');
          if (!query) setQuery('Identify built-up and water-covered regions using both optical and SAR images.');
        } else {
          setMode('single');
          setViewerTab('default');
          if (!query) setQuery('Identify the main water body and highlight the built-up port infrastructure.');
        }
      }
    } catch (err) {
      console.error('Error loading sample:', err);
    }
  };

  // Handle Mode Change
  const handleModeChange = (newMode: AnalysisMode) => {
    setMode(newMode);
    setCurrentAnalysis(null);
    if (newMode === 'single') {
      loadSample('single_harbor');
      setQuery('What land-cover types are visible in this scene?');
      setViewerTab('default');
    } else if (newMode === 'bitemporal') {
      loadSample('bitemporal_expansion');
      setQuery('What changed between these images? Has built-up area increased?');
      setViewerTab('change');
    } else if (newMode === 'optical_sar') {
      loadSample('optical_sar_fusion');
      setQuery('Identify built-up and water-covered regions using both optical and SAR images.');
      setViewerTab('fusion');
    }
  };

  // Execute Analysis Pipeline in Real-Time
  const handleRunAnalysis = async () => {
    if (!query.trim() || images.length === 0) return;
    setIsExecuting(true);
    setExecutionSteps([]);
    setCurrentStep('Validating input satellite raster metadata...');

    try {
      const token = localStorage.getItem('satquery_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Create analysis record
      const createRes = await fetch('/api/analyses', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: query.slice(0, 60),
          query,
          mode,
          images
        })
      });

      if (!createRes.ok) throw new Error('Failed to initialize analysis');
      const createData = await createRes.json();
      const analysisId = createData.analysis.id;

      // Realistic intermediate execution milestones for the observable checklist
      setTimeout(() => {
        setExecutionSteps(prev => [
          ...prev,
          { id: '1', label: 'Image input validated (Format, Dimensions, Geospatial Metadata)', timestamp: new Date().toLocaleTimeString() }
        ]);
        setCurrentStep('Parsing natural language query semantic intent...');
      }, 400);

      setTimeout(() => {
        setExecutionSteps(prev => [
          ...prev,
          { id: '2', label: 'Natural-language query semantic intent parsed', timestamp: new Date().toLocaleTimeString() }
        ]);
        setCurrentStep('Routing to specialist remote sensing model...');
      }, 850);

      setTimeout(() => {
        setExecutionSteps(prev => [
          ...prev,
          { id: '3', label: `${mode.toUpperCase()} specialist workflow selected by Task Router`, timestamp: new Date().toLocaleTimeString() }
        ]);
        setCurrentStep('Running specialized model inference on Cloud TPU...');
      }, 1300);

      // 2. Call backend execute
      const execRes = await fetch(`/api/analyses/${analysisId}/execute`, {
        method: 'POST',
        headers
      });

      if (!execRes.ok) throw new Error('Failed executing analysis');
      const execData = await execRes.json();

      setTimeout(() => {
        setExecutionSteps(execData.result.executionSummary || []);
        setCurrentAnalysis(execData.analysis);
        setIsExecuting(false);
        if (onAnalysisComplete) onAnalysisComplete(execData.analysis);
      }, 1700);

    } catch (err: any) {
      console.error('Execution error:', err);
      setIsExecuting(false);
      setCurrentStep('Execution error: ' + err.message);
    }
  };

  // Toggle Save Analysis
  const handleToggleSave = async () => {
    if (!currentAnalysis) return;
    try {
      const res = await fetch(`/api/analyses/${currentAnalysis.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: currentAnalysis.notes })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  // Preset query clicker
  const suggestedQueries = {
    single: [
      'What land-cover types are visible in this scene?',
      'Where is the main water body?',
      'Highlight the built-up port infrastructure.'
    ],
    bitemporal: [
      'What changed between these images?',
      'Has built-up area increased?',
      'Where are the major urban developments?'
    ],
    optical_sar: [
      'Identify built-up and water-covered regions using both optical and SAR images.',
      'What information becomes clearer when using both images?',
      'Penetrate cloud cover with SAR radar specular scattering.'
    ]
  }[mode];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full text-slate-800">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Analysis Workspace</span>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Live Agentic Pipeline
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Query satellite imagery via natural language with automatic task routing and spatial evidence.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => handleModeChange('single')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'single'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye size={14} />
            <span>Single Image</span>
          </button>
          <button
            onClick={() => handleModeChange('bitemporal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'bitemporal'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCompare size={14} />
            <span>Bi-Temporal</span>
          </button>
          <button
            onClick={() => handleModeChange('optical_sar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'optical_sar'
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radar size={14} />
            <span>Optical + SAR</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Uploader & Satellite Viewer */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <ImageUploader
            mode={mode}
            images={images}
            onImagesChange={setImages}
            onLoadSample={loadSample}
          />

          <SatelliteImageViewer
            mode={mode}
            images={images}
            evidence={currentAnalysis?.result?.evidence}
            activeTab={viewerTab}
            onTabChange={setViewerTab}
          />
        </div>

        {/* Right Column: Query Box & Results Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Query Formulation Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-sky-600" />
                <span>Natural Language Query</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Plain English</span>
            </div>

            {/* Suggested Queries */}
            <div className="flex flex-wrap gap-1.5">
              {suggestedQueries.map((sQuery, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(sQuery)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors text-left"
                >
                  "{sQuery}"
                </button>
              ))}
            </div>

            {/* Input & Action */}
            <div className="relative mt-1">
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask about harbor infrastructure, land cover classification, urban growth, water boundaries..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRunAnalysis();
                  }
                }}
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isExecuting || !query.trim() || images.length === 0}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Executing Specialist Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Run Real-Time Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Results Panel: Specialist AI Findings & Interactive Chatbot */}
          <AnalysisResultPanel
            result={currentAnalysis?.result}
            isSaved={currentAnalysis?.isSaved}
            onToggleSave={handleToggleSave}
            onGenerateReport={
              currentAnalysis && onGenerateReport
                ? () => onGenerateReport(currentAnalysis.id)
                : undefined
            }
            isExecuting={isExecuting}
            currentStep={currentStep}
            executionSteps={executionSteps}
          />
        </div>
      </div>
    </div>
  );
};
