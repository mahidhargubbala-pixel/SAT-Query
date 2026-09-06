import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Database,
  Cpu,
  Globe2,
  GitCompare,
  Radar,
  Eye,
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';
import { SatelliteHero3D } from './SatelliteHero3D';
import { Logo } from './Logo';

interface LandingPageProps {
  onStartAnalysis: (mode?: string, sampleKey?: string, initialQuery?: string) => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#070D18] text-slate-100 overflow-x-hidden selection:bg-sky-500/30">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden border-b border-slate-800/80">
        {/* Subtle Background Cosmic Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-600/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[110px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B172B] border border-sky-500/30 text-xs font-semibold text-sky-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>Smart India Hackathon • Vision-Language Remote Sensing AI</span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-wider text-white leading-[1.12]">
                  <span>SAT</span>
                  <span className="text-cyan-400 font-light mx-1 animate-pulse">·</span>
                  <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">QUERY</span>
                  {" "}
                  <span className="text-xs sm:text-sm font-mono font-black align-middle px-2.5 py-1 rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 text-white border border-cyan-300/40 shadow-[0_0_16px_rgba(14,165,233,0.5)] tracking-widest uppercase ml-1">
                    AI
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold tracking-wide bg-gradient-to-r from-sky-200 via-cyan-100 to-slate-200 bg-clip-text text-transparent">
                  “Ask · Analyze · Understand Earth.”
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  An interactive vision-language assistant for multimodal remote sensing image analysis.
                  Query satellite imagery in plain English — without complicated GIS tools, manual projection setup, or band arithmetic.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onStartAnalysis()}
                  className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide shadow-md transition-all flex items-center gap-2 group"
                >
                  <Sparkles size={16} />
                  <span>START REAL-TIME ANALYSIS</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('architecture-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 transition-all flex items-center gap-2"
                >
                  <span>EXPLORE ARCHITECTURE</span>
                </button>
              </div>

              {/* Quick Proof Badges */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 w-full max-w-lg text-left">
                <div>
                  <span className="block text-xl sm:text-2xl font-extrabold text-white font-mono">Real-Time</span>
                  <span className="text-xs text-slate-400">Live Agent Pipeline</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-extrabold text-sky-400 font-mono">BigEarthNet</span>
                  <span className="text-xs text-slate-400">LoRA PEFT Adapted</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-extrabold text-white font-mono">Optical + SAR</span>
                  <span className="text-xs text-slate-400">Dual-Stream Fusion</span>
                </div>
              </div>
            </div>

            {/* Right 3D Interactive Satellite */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[480px] bg-gradient-to-b from-sky-500/10 to-transparent rounded-2xl border border-slate-800/80 p-2 overflow-hidden shadow-2xl">
                <SatelliteHero3D />
                <div className="absolute bottom-3 left-4 right-4 bg-white/90 backdrop-blur rounded-xl px-3 py-2 border border-slate-200 text-xs text-slate-800 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold">Sentinel-2 MSI Orbit Simulation</span>
                  </div>
                  <span className="font-mono text-sky-700 font-bold">10m GSD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section with Crisp White Cards */}
      <section className="py-16 bg-[#09101E] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Analysis Modalities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Three Specialized Remote Sensing Pipelines
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Domain-adapted vision-language architectures trained for single-scene question answering, bi-temporal change detection, and cloud-penetrating radar fusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mode 1 - Single Image */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm text-slate-800">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Eye size={22} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">A. Single Image Analysis</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Natural-language Visual Question Answering (VQA), land-cover captioning, and visual grounding with spatial bounding boxes.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-sky-600 shrink-0" />
                    <span>“What land-cover types are visible?”</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-sky-600 shrink-0" />
                    <span>“Where is the main water body?”</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-sky-600 shrink-0" />
                    <span>“Highlight the port container berths.”</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onStartAnalysis('single', 'single_harbor', 'What land-cover types are visible in this port?')}
                className="mt-6 w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-bold text-xs border border-sky-200 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch Single-Image VQA</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Mode 2 - Bi-Temporal */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm text-slate-800">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <GitCompare size={22} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">B. Bi-Temporal Change</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compare co-registered T1 and T2 satellite timestamps. Calculate built-up expansion percentages and generate pixel difference heatmaps.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-600 shrink-0" />
                    <span>“What changed between these images?”</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-600 shrink-0" />
                    <span>“Has built-up area increased?”</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-indigo-600 shrink-0" />
                    <span>“Where are the major urban developments?”</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onStartAnalysis('bitemporal', 'bitemporal_expansion', 'What changed between these images? Has built-up area increased?')}
                className="mt-6 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs border border-indigo-200 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch Change Detection</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Mode 3 - Optical + SAR */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm text-slate-800">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Radar size={22} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">C. Optical + SAR Fusion</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Physical cross-modal synthesis. Overcome thick cloud cover using Sentinel-1 radar microwave backscatter combined with Sentinel-2 optical imagery.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 pt-2 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>“Penetrate cloud layer to verify flood extent”</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>“Identify built-up via SAR double-bounce”</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>“Complementary cross-sensor evidence”</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onStartAnalysis('optical_sar', 'optical_sar_fusion', 'Identify built-up and water-covered regions using both optical and SAR images.')}
                className="mt-6 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs border border-emerald-200 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch Optical-SAR Fusion</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section in Crisp White Light Card */}
      <section id="architecture-section" className="py-16 bg-[#070D18] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              End-to-End Agentic Vision-Language Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Complexity is solved automatically. Natural-language intent is validated, routed, executed on Cloud TPU accelerators, and synthesized into visual evidence.
            </p>
          </div>

          {/* Architecture Visual Diagram Flow */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 text-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
              {/* Stage 1: Input */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <span className="text-[10px] font-mono text-sky-700 font-bold uppercase">Stage 1</span>
                <h4 className="text-xs font-bold text-slate-900">User Input & Upload</h4>
                <p className="text-[11px] text-slate-500">GeoTIFF, Multispectral MSI, SAR, or Natural Language Query</p>
                <div className="text-[10px] text-sky-700 bg-white font-bold py-1 rounded-lg border border-slate-200">
                  Plain English
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex justify-center text-slate-400">
                <ArrowRight size={22} />
              </div>

              {/* Stage 2: Agentic Controller */}
              <div className="bg-sky-50 p-5 rounded-2xl border border-sky-200 text-center space-y-2 shadow-xs">
                <span className="text-[10px] font-mono text-sky-700 font-bold uppercase">Stage 2: Core</span>
                <h4 className="text-xs font-bold text-sky-900">Agentic Task Router</h4>
                <p className="text-[11px] text-slate-600">Automatic raster validation, intent parsing & model dispatch</p>
                <div className="text-[10px] text-emerald-800 bg-white font-bold py-1 rounded-lg border border-emerald-200">
                  Auto-Selects Model
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex justify-center text-slate-400">
                <ArrowRight size={22} />
              </div>

              {/* Stage 3: Specialized Remote Sensing Models */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                <span className="text-[10px] font-mono text-sky-700 font-bold uppercase">Stage 3</span>
                <h4 className="text-xs font-bold text-slate-900">Specialist Adapters</h4>
                <p className="text-[11px] text-slate-500">VRSBench Grounder, BIT-Net Siamese, Optical-SAR Fuser</p>
                <div className="text-[10px] text-indigo-700 bg-white font-bold py-1 rounded-lg border border-slate-200 font-mono">
                  BigEarthNet PEFT
                </div>
              </div>
            </div>

            {/* Bottom Output Synthesis Row */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">✓ Observable Execution</span>
                <span className="text-slate-500 text-[11px]">Validating → Routing → Executed on TPU</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">✓ Grounded Evidence</span>
                <span className="text-slate-500 text-[11px]">Bounding boxes, difference masks, radar specular maps</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">✓ Calibrated Confidence</span>
                <span className="text-slate-500 text-[11px]">High statistical score estimations (88%–96%)</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">✓ Exportable Reports</span>
                <span className="text-slate-500 text-[11px]">Instant PDF generation with sensor specifications</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clickable Example Queries Section */}
      <section className="py-16 bg-[#09101E] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Interactive Demos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Try Common Remote Sensing Queries
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any benchmark query below to automatically load the sample imagery into the Workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                mode: 'single',
                sample: 'single_harbor',
                query: 'What land-cover types are visible in this port?',
                label: 'Single-Image Land-Cover VQA'
              },
              {
                mode: 'single',
                sample: 'single_harbor',
                query: 'Where is the main water body? Delineate the harbor fairway.',
                label: 'Visual Grounding & Localization'
              },
              {
                mode: 'single',
                sample: 'single_harbor',
                query: 'Highlight the built-up container terminals and berths.',
                label: 'Built-Up Infrastructure Detection'
              },
              {
                mode: 'bitemporal',
                sample: 'bitemporal_expansion',
                query: 'What changed between these images? Has built-up area increased?',
                label: 'Bi-Temporal Urban Expansion'
              },
              {
                mode: 'bitemporal',
                sample: 'bitemporal_expansion',
                query: 'Where are the major land-cover changes between 2021 and 2024?',
                label: 'Spatial Change Grounding'
              },
              {
                mode: 'optical_sar',
                sample: 'optical_sar_fusion',
                query: 'Identify built-up and water-covered regions using both optical and SAR images.',
                label: 'Optical + SAR Dual-Stream Fusion'
              }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => onStartAnalysis(item.mode, item.sample, item.query)}
                className="bg-white hover:bg-slate-50 text-left p-4 rounded-2xl border border-slate-200 hover:border-sky-400 transition-all flex flex-col justify-between gap-3 group shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-mono text-sky-700 uppercase font-bold block mb-1">
                    {item.label}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    “{item.query}”
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="capitalize">{item.mode.replace('_', ' + ')} Mode</span>
                  <span className="text-sky-600 flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-transform">
                    Run in Workspace <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#070D18] text-xs text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline={true} />
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('models')} className="hover:text-sky-300 transition-colors font-medium">
              Model Registry
            </button>
            <button onClick={() => onNavigate('reports')} className="hover:text-sky-300 transition-colors font-medium">
              Reports
            </button>
            <button onClick={() => onNavigate('workspace')} className="hover:text-sky-300 transition-colors font-medium">
              Workspace
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Smart India Hackathon Solution • Automated Remote Sensing Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};
