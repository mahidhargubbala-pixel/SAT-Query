import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Key,
  Server,
  Database,
  Sliders,
  CheckCircle2,
  Cpu,
  Info,
  Trash2,
  Compass,
  Sparkles,
  MousePointer2,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { Logo, LogoVariant } from './Logo';
import { CursorStyle, CURSOR_THEMES } from './SpaceCursor';

interface SettingsViewProps {
  user: UserProfile | null;
  onClearHistory?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onClearHistory }) => {
  const [name, setName] = useState(user?.name || 'Guest Analyst');
  const [email, setEmail] = useState(user?.email || 'analyst@satquery.local');
  const [org, setOrg] = useState(user?.organization || 'National Remote Sensing Lab');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [currentLogoVariant, setCurrentLogoVariant] = useState<LogoVariant>('orbital');
  const [currentCursorStyle, setCurrentCursorStyle] = useState<CursorStyle>('azure-fluid');

  useEffect(() => {
    const savedLogo = localStorage.getItem('satquery_logo_variant') as LogoVariant;
    const validLogos: LogoVariant[] = ['orbital', 'cube', 'horizon', 'spectral', 'phased-array', 'constellation'];
    if (savedLogo && validLogos.includes(savedLogo)) {
      setCurrentLogoVariant(savedLogo);
    }

    const savedCursor = localStorage.getItem('satquery_cursor_style') as CursorStyle;
    if (savedCursor && CURSOR_THEMES[savedCursor]) {
      setCurrentCursorStyle(savedCursor);
    }

    const handleLogoChange = () => {
      const updated = localStorage.getItem('satquery_logo_variant') as LogoVariant;
      if (updated && validLogos.includes(updated)) setCurrentLogoVariant(updated);
    };

    const handleCursorChange = () => {
      const updated = localStorage.getItem('satquery_cursor_style') as CursorStyle;
      if (updated && CURSOR_THEMES[updated]) setCurrentCursorStyle(updated);
    };

    window.addEventListener('satquery_logo_changed', handleLogoChange);
    window.addEventListener('satquery_cursor_changed', handleCursorChange);

    return () => {
      window.removeEventListener('satquery_logo_changed', handleLogoChange);
      window.removeEventListener('satquery_cursor_changed', handleCursorChange);
    };
  }, []);

  const handleSelectLogo = (variant: LogoVariant) => {
    setCurrentLogoVariant(variant);
    localStorage.setItem('satquery_logo_variant', variant);
    window.dispatchEvent(new Event('satquery_logo_changed'));
  };

  const handleSelectCursor = (style: CursorStyle) => {
    setCurrentCursorStyle(style);
    localStorage.setItem('satquery_cursor_style', style);
    window.dispatchEvent(new Event('satquery_cursor_changed'));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your local query history and cached inference masks?')) {
      setClearing(true);
      if (onClearHistory) onClearHistory();
      setTimeout(() => {
        setClearing(false);
      }, 500);
    }
  };

  const logoOptions: { id: LogoVariant; title: string; desc: string }[] = [
    {
      id: 'orbital',
      title: 'Orbital Radar Aperture',
      desc: 'Concentric synthetic radar rings with orbital satellite transceiver'
    },
    {
      id: 'cube',
      title: 'Hex-Sensor Sentinel',
      desc: '3D isometric faceted satellite cube with solar wings & laser target'
    },
    {
      id: 'horizon',
      title: 'Quantum Earth Horizon',
      desc: 'Curved planetary limb with ionospheric arc & cross-modal sensor ray'
    },
    {
      id: 'spectral',
      title: 'Multispectral Prism Band',
      desc: 'Optical prism refraction splitting incident light into VNIR/SWIR bands'
    },
    {
      id: 'phased-array',
      title: 'SAR Phased Array Dish',
      desc: 'Microwave radar parabolic dish with C-band coherent ground pulses'
    },
    {
      id: 'constellation',
      title: 'Tri-Satellite Constellation',
      desc: 'Triangulated orbital mesh with cross-link optical interconnects'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Analyst Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure satellite telemetry parameters, branding, 3D cursor styling, and model inference profiles.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <User size={18} className="text-sky-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Analyst Profile
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Identifier
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Research Lab
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={14} /> Profile updated
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 3D Cursor Customization Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MousePointer2 size={18} className="text-sky-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3D Kinetic Cursor Themes
              </h2>
              <p className="text-[11px] text-slate-500">
                Select your preferred single-color 3D animated kinetic trail. Optimized with contrast shadows for 100% clarity across both dark and light modes.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
            4 Custom Styles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {Object.values(CURSOR_THEMES).map((theme) => {
            const isSelected = currentCursorStyle === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => handleSelectCursor(theme.id)}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between group relative overflow-hidden ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/40 shadow-xs ring-2 ring-sky-400/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                {/* Visual Kinetic Preview Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-4 h-4 rounded-full shadow-xs border border-white flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">
                    {theme.category}
                  </span>
                </div>

                {/* Animated Simulation Preview Bar */}
                <div className="h-10 w-full rounded-lg bg-slate-900 p-2 flex items-center justify-between px-3 relative overflow-hidden mb-3">
                  {/* Contrast shadow and kinetic beads */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full opacity-40 animate-pulse"
                      style={{ backgroundColor: theme.highlight }}
                    />
                    <span
                      className="w-2 h-2 rounded-full opacity-70"
                      style={{ backgroundColor: theme.highlight }}
                    />
                    <span
                      className="w-3 h-3 rounded-full shadow-md"
                      style={{
                        backgroundColor: theme.primary,
                        boxShadow: `0 0 8px ${theme.primary}`
                      }}
                    />
                  </div>
                  {/* Reticle circle preview */}
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: theme.primary }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.highlight }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">{theme.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Single refined tone with 3D specular beads and click ripple.
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className="text-[10px] font-semibold flex items-center gap-1"
                    style={{ color: theme.primary }}
                  >
                    ● {theme.id}
                  </span>
                  {isSelected ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-600 font-medium">
                      Click to activate
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unique Logo & Brand Identity Selection (6 Options) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-sky-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Branding & Unique Logo Variants
              </h2>
              <p className="text-[11px] text-slate-500">
                Choose between 6 scientific insignia designs. (You can also click the logo emblem in the top navbar at any time to cycle).
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
            6 Unique Designs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {logoOptions.map((opt) => {
            const isSelected = currentLogoVariant === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelectLogo(opt.id)}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col items-center text-center gap-2 ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-2 ring-sky-400/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 w-full flex items-center justify-center">
                  <Logo size="md" variant={opt.id} interactive={false} darkText={true} />
                </div>
                <div className="mt-1">
                  <span className="text-xs font-bold text-slate-900 block">{opt.title}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                    {opt.desc}
                  </span>
                </div>
                {isSelected ? (
                  <span className="mt-auto text-[10px] font-bold text-sky-700 bg-sky-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={11} /> Active
                  </span>
                ) : (
                  <span className="mt-auto text-[10px] font-medium text-slate-400 hover:text-slate-600">
                    Click to select
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Engine Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Cpu size={18} className="text-sky-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Agentic Remote Sensing Inference
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Deep Multimodal Vision Reasoning (Gemini 2.5 Flash)
              </span>
              <span className="text-[11px] text-slate-500 block">
                Provides sub-meter semantic grounding, bounding coordinates, and biophysical index calculation.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Synthetic Aperture Radar (SAR) Speckle Filtering
              </span>
              <span className="text-[11px] text-slate-500 block">
                Enhances backscatter coherence for all-weather flood detection and maritime vessel tracking.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold border border-sky-200">
              ENABLED
            </span>
          </div>
        </div>
      </div>

      {/* Data Management & Cache Clearing */}
      <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-rose-100 pb-3">
          <Trash2 size={18} className="text-rose-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Data Management
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Clear all cached analysis results, bounding box overlays, and uploaded query session records stored in your browser.
        </p>
        <button
          onClick={handleClear}
          disabled={clearing}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={13} />
          <span>{clearing ? 'Clearing Storage...' : 'Clear Query History & Cache'}</span>
        </button>
      </div>
    </div>
  );
};
