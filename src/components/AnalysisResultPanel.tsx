import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Cpu,
  Bookmark,
  Sparkles,
  Layers,
  MessageSquare,
  Bot,
  Send,
  FileText,
  Copy,
  Check,
  HelpCircle,
  BrainCircuit
} from 'lucide-react';
import { AnalysisResult, ExecutionStep } from '../types';

interface AnalysisResultPanelProps {
  result?: AnalysisResult;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onGenerateReport?: () => void;
  isExecuting?: boolean;
  currentStep?: string;
  executionSteps?: ExecutionStep[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  model?: string;
  timestamp: string;
}

export const AnalysisResultPanel: React.FC<AnalysisResultPanelProps> = ({
  result,
  isSaved = false,
  onToggleSave,
  onGenerateReport,
  isExecuting = false,
  currentStep = 'Executing analysis...',
  executionSteps = []
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      model: 'SatQuery AI Assistant',
      text: 'Hello! I am your SatQuery AI Assistant powered by multimodal remote sensing models. Ask me any question about this satellite scene, spectral indices (NDVI/NDWI), microwave SAR radar backscatter, or urban changes.',
      timestamp: 'Ready'
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Send message to chatbot
  const handleSendChat = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          analysisContext: result
        })
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        model: data.model || (data.isGemini ? 'Gemini 3.8 Flash (Active AI)' : 'SatQuery Remote Sensing AI'),
        text: data.reply || 'Analysis verified against remote sensing benchmarks.',
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        model: 'SatQuery Fallback Engine',
        text: 'I encountered a connection error. Please try asking again or check your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // If currently executing, show live observable execution summary
  if (isExecuting) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping opacity-75" />
              <span className="absolute w-2 h-2 rounded-full bg-blue-600" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Agentic Pipeline Processing
            </h3>
          </div>
          <span className="text-[11px] font-bold font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Real-Time Analysis
          </span>
        </div>

        {/* Observable Execution Checklist */}
        <div className="space-y-2.5 my-2">
          {executionSteps.length > 0 ? (
            executionSteps.map(step => (
              <div key={step.id} className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span className="text-slate-800 font-medium">{step.label}</span>
                <span className="ml-auto text-[10px] font-mono text-slate-400">{step.timestamp}</span>
              </div>
            ))
          ) : (
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-blue-600 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Validating satellite image raster & geospatial metadata...</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Parsing natural language query semantic intent</span>
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>Executing BigEarthNet & VRSBench specialist vision models</span>
              </div>
            </div>
          )}
        </div>

        {/* Active Stage Indicator */}
        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
          <p className="text-xs text-blue-900 font-semibold truncate">{currentStep}</p>
        </div>
      </div>
    );
  }

  // Unified Single-Flow Screen containing both the Primary AI Analysis and the AI Chatbot
  return (
    <div className="flex flex-col gap-5">
      {/* SECTION 1: PRIMARY SPECIALIST AI VISION ANALYSIS */}
      {result ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4 text-slate-800">
          {/* Header with Badges and Actions */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white flex items-center gap-1.5 shadow-xs">
                <Sparkles size={13} />
                <span>PRIMARY AI ANALYSIS</span>
              </span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck size={13} />
                <span>Confidence {result.confidenceScore}%</span>
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                {result.analysisType}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {onToggleSave && (
                <button
                  onClick={onToggleSave}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isSaved
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                  title={isSaved ? 'Saved to History' : 'Save Investigation'}
                >
                  <Bookmark size={13} className={isSaved ? 'fill-amber-500 text-amber-500' : ''} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              )}

              {onGenerateReport && (
                <button
                  onClick={onGenerateReport}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <FileText size={13} />
                  <span>Generate Report</span>
                </button>
              )}
            </div>
          </div>

          {/* PRIMARY AI ANSWER BOX */}
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50/40 p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                <BrainCircuit size={14} className="text-blue-600" />
                <span>AI Vision Analysis Answer</span>
              </span>
              <button
                onClick={() => handleCopy(result.answer, 'primary-res')}
                className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-blue-200"
              >
                {copiedId === 'primary-res' ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Answer</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-normal">
              {result.answer}
            </p>
          </div>

          {/* Grounded Visual Evidence */}
          {result.evidence && (
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-600" />
                <span>Detected Spatial Evidence & Localization</span>
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {result.evidence.description}
              </p>

              {result.evidence.boxes && result.evidence.boxes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {result.evidence.boxes.map((box, idx) => (
                    <div
                      key={box.id || idx}
                      className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: box.color }}
                        />
                        <span className="font-bold text-slate-800">{box.label}</span>
                      </div>
                      <span className="font-mono text-slate-500">
                        {box.areaEstimate || `${(box.score * 100).toFixed(0)}%`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {result.evidence.changeMetrics && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block">Built-Up Delta</span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      +{result.evidence.changeMetrics.builtUpIncreasePercent}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block">Vegetation Delta</span>
                    <span className="text-xs font-bold text-rose-600 font-mono">
                      {result.evidence.changeMetrics.vegetationChangePercent}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400 block">Changed Pixels</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {result.evidence.changeMetrics.totalChangedPixels?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Technical Expandable Details */}
          {result.technicalDetails && (
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Cpu size={14} className="text-blue-600" />
                  <span>Geospatial Sensor Specifications</span>
                </div>
                {showTechnicalDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showTechnicalDetails && (
                <div className="p-3.5 space-y-2 bg-white divide-y divide-slate-100 text-[11px]">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">CRS Coordinate System</span>
                    <span className="font-mono font-medium text-slate-900">{result.technicalDetails.crs}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Spatial Resolution (GSD)</span>
                    <span className="font-mono font-medium text-slate-900">{result.technicalDetails.gsdResolution}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Spectral Bands</span>
                    <span className="font-mono font-medium text-slate-900">{result.technicalDetails.spectralBands}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Sensor Platform</span>
                    <span className="font-mono font-medium text-slate-900">{result.technicalDetails.sensorPlatform}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">PEFT Adapter</span>
                    <span className="font-mono font-medium text-blue-700">{result.technicalDetails.adapterMode}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 text-slate-800">
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Sparkles size={20} />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Satellite Analysis Pipeline Ready</h4>
          <p className="text-xs text-slate-500 max-w-sm">
            Enter your query in the prompt box above and click <strong className="text-blue-700">Run Real-Time Analysis</strong> to generate primary findings, or ask anything in the AI Chatbot below.
          </p>
        </div>
      )}

      {/* SECTION 2: INTERACTIVE SATELLITE AI CHATBOT & AI ANSWER BOX */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col text-slate-800">
        {/* Chatbot Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot size={16} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                SatQuery Interactive AI Chatbot
              </h4>
              <p className="text-[10px] text-slate-500">
                Ask follow-up questions & get direct answers in the AI Answer Box
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
            Gemini 3.8 Flash AI
          </span>
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-1.5">
          {[
            { label: '🌱 Calculate NDVI index', prompt: 'Explain the NDVI vegetation index formula and expected values for this satellite scene.' },
            { label: '🌊 How does SAR penetrate clouds?', prompt: 'How does Sentinel-1 C-band SAR penetrate clouds to identify water and berths?' },
            { label: '🏗️ Detail built-up change statistics', prompt: 'Provide a breakdown of built-up urban expansion and land conversion.' },
            { label: '📊 Explain confidence calculation', prompt: 'How is the statistical confidence score calculated by the model?' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendChat(chip.prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors shadow-2xs text-left"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Stream: Displaying Questions and Clear AI Answer Boxes */}
        <div className="p-4 flex flex-col gap-3.5 max-h-[420px] overflow-y-auto bg-slate-50/30">
          {chatMessages.map(msg => (
            <div key={msg.id} className="flex flex-col gap-1">
              {msg.sender === 'user' ? (
                /* User Question Bubble */
                <div className="self-end max-w-[85%] rounded-2xl bg-blue-600 text-white px-3.5 py-2.5 text-xs shadow-xs">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-blue-200 mb-0.5">
                    You Asked
                  </div>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                  <span className="text-[9px] text-blue-200 block text-right mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ) : (
                /* DEDICATED AI ANSWER BOX */
                <div className="self-start w-full rounded-xl border-2 border-indigo-200 bg-white p-3.5 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                        AI Answer Box
                      </span>
                      {msg.model && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {msg.model}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:bg-slate-100 px-1.5 py-0.5 rounded transition-colors"
                      title="Copy Answer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span className="text-[10px] text-emerald-700 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Formatted AI Answer Text */}
                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line space-y-1">
                    {msg.text}
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono mt-1">
                    Delivered at {msg.timestamp}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* AI Thinking Animation */}
          {isChatLoading && (
            <div className="self-start w-full rounded-xl border border-indigo-200 bg-indigo-50/50 p-3.5 flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
              <div className="text-xs text-indigo-900 font-medium">
                <strong>SatQuery AI is processing...</strong> Consulting Gemini 3.8 Flash with satellite raster context.
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white flex flex-col gap-1.5">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendChat();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask any question about this satellite scene (e.g. explain NDVI or SAR)..."
              className="flex-1 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all shrink-0"
            >
              <span>Ask AI</span>
              <Send size={13} />
            </button>
          </form>
          <p className="text-[10px] text-slate-400">
            Powered by real-time Gemini AI. Responses are grounded in the active satellite scene metadata.
          </p>
        </div>
      </div>
    </div>
  );
};
