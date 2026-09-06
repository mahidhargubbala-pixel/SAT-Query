import React, { useState, useEffect } from 'react';

export type LogoVariant = 'orbital' | 'cube' | 'horizon' | 'spectral' | 'phased-array' | 'constellation';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  darkText?: boolean;
  variant?: LogoVariant;
  interactive?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  darkText = false,
  variant: forcedVariant,
  interactive = true
}) => {
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant>('orbital');
  const [showSwitchTooltip, setShowSwitchTooltip] = useState(false);

  // Sync with localStorage so choice persists across entire application
  useEffect(() => {
    if (forcedVariant) {
      setSelectedVariant(forcedVariant);
      return;
    }

    const saved = localStorage.getItem('satquery_logo_variant') as LogoVariant;
    const validVariants: LogoVariant[] = ['orbital', 'cube', 'horizon', 'spectral', 'phased-array', 'constellation'];
    if (saved && validVariants.includes(saved)) {
      setSelectedVariant(saved);
    }

    const handleStorage = () => {
      const updated = localStorage.getItem('satquery_logo_variant') as LogoVariant;
      if (updated && validVariants.includes(updated)) setSelectedVariant(updated);
    };

    window.addEventListener('satquery_logo_changed', handleStorage);
    return () => window.removeEventListener('satquery_logo_changed', handleStorage);
  }, [forcedVariant]);

  const cycleLogo = (e: React.MouseEvent) => {
    if (!interactive || forcedVariant) return;
    e.stopPropagation();

    const variants: LogoVariant[] = ['orbital', 'cube', 'horizon', 'spectral', 'phased-array', 'constellation'];
    const nextIdx = (variants.indexOf(selectedVariant) + 1) % variants.length;
    const next = variants[nextIdx];
    setSelectedVariant(next);
    localStorage.setItem('satquery_logo_variant', next);
    window.dispatchEvent(new Event('satquery_logo_changed'));

    setShowSwitchTooltip(true);
    setTimeout(() => setShowSwitchTooltip(false), 2200);
  };

  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 38;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  const variantLabels: Record<LogoVariant, string> = {
    orbital: 'Orbital Radar Aperture',
    cube: 'Hex-Sensor Sentinel',
    horizon: 'Quantum Earth Horizon',
    spectral: 'Multispectral Prism Band',
    'phased-array': 'SAR Phased Array Dish',
    constellation: 'Tri-Satellite Constellation'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none relative group ${className}`}>
      {/* Interactive Unique Logo Emblem with Switchable Options */}
      <div
        role={interactive && !forcedVariant ? 'button' : undefined}
        tabIndex={interactive && !forcedVariant ? 0 : undefined}
        onClick={cycleLogo}
        onKeyDown={(e) => {
          if (interactive && !forcedVariant && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            cycleLogo(e as unknown as React.MouseEvent);
          }
        }}
        className="relative flex items-center justify-center shrink-0 cursor-pointer focus:outline-none transition-transform active:scale-95 group-hover:scale-105"
        title="Click to cycle between 6 unique SatQuery logo options"
      >
        {/* OPTION 1: ORBITAL RADAR APERTURE */}
        {selectedVariant === 'orbital' && (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_12px_rgba(14,165,233,0.45)]"
          >
            <circle
              cx="26"
              cy="26"
              r="23"
              stroke="url(#orbitGrad)"
              strokeWidth="1.6"
              strokeDasharray="4 3"
              className="animate-[spin_24s_linear_infinite]"
            />
            <circle cx="26" cy="26" r="16" stroke="#0284c7" strokeWidth="1.2" strokeOpacity="0.5" />
            <circle cx="26" cy="26" r="9" fill="url(#coreGrad)" />
            <circle cx="26" cy="26" r="4" fill="#00f0ff" className="animate-pulse opacity-90" />
            <path d="M12 26H40M26 12V40" stroke="#bae6fd" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2 2" />
            <g transform="translate(37, 13) rotate(32)">
              <rect x="-3" y="-3.5" width="6" height="7" rx="1.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
              <rect x="-10" y="-2" width="6" height="4" rx="0.8" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
              <rect x="4" y="-2" width="6" height="4" rx="0.8" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
              <circle cx="0" cy="4" r="1" fill="#00f0ff" />
            </g>
            <path d="M34 16L27 24" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 2" />
            <circle cx="26" cy="25" r="2" fill="#38bdf8" className="animate-ping opacity-75" />
            <defs>
              <linearGradient id="orbitGrad" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00f0ff" />
                <stop offset="0.5" stopColor="#0284c7" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="coreGrad" x1="17" y1="17" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0284c7" />
                <stop offset="0.7" stopColor="#0369a1" />
                <stop offset="1" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* OPTION 2: 3D HEX-SENSOR SENTINEL CUBE */}
        {selectedVariant === 'cube' && (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_12px_rgba(14,165,233,0.5)]"
          >
            <polygon
              points="26,4 45,15 45,37 26,48 7,37 7,15"
              stroke="url(#hexGrad)"
              strokeWidth="1.5"
              fill="rgba(2, 132, 199, 0.08)"
            />
            <polygon points="26,13 38,20 26,27 14,20" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
            <polygon points="14,20 26,27 26,41 14,34" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
            <polygon points="26,27 38,20 38,34 26,41" fill="#0369a1" stroke="#0c4a6e" strokeWidth="1" />
            <circle cx="26" cy="27" r="3.5" fill="#ffffff" />
            <circle cx="26" cy="27" r="2" fill="#00f0ff" className="animate-pulse" />
            <rect x="3" y="21" width="8" height="10" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="7" y1="21" x2="7" y2="31" stroke="#38bdf8" strokeWidth="0.6" />
            <rect x="41" y="21" width="8" height="10" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="45" y1="21" x2="45" y2="31" stroke="#38bdf8" strokeWidth="0.6" />
            <path d="M26 41L26 48" stroke="#00f0ff" strokeWidth="1.8" strokeLinecap="round" className="animate-pulse" />
            <defs>
              <linearGradient id="hexGrad" x1="7" y1="4" x2="45" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#0284c7" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* OPTION 3: QUANTUM EARTH HORIZON */}
        {selectedVariant === 'horizon' && (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_12px_rgba(56,189,248,0.55)]"
          >
            <path
              d="M4 42C12 23 32 17 48 24"
              stroke="url(#horizonGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M4 40C12 21 32 15 48 22"
              stroke="#00f0ff"
              strokeWidth="1.2"
              strokeOpacity="0.75"
              strokeLinecap="round"
            />
            <g transform="translate(18, 11) rotate(15)">
              <rect x="-3" y="-3" width="6" height="6" rx="1.2" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
              <rect x="-9" y="-2" width="5" height="4" rx="0.6" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />
              <rect x="4" y="-2" width="5" height="4" rx="0.6" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.6" />
            </g>
            <path d="M18 14L28 32" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M18 14L12 36" stroke="#0284c7" strokeWidth="1.2" strokeOpacity="0.6" />
            <circle cx="28" cy="32" r="3" fill="#00f0ff" className="animate-ping opacity-75" />
            <circle cx="28" cy="32" r="2" fill="#0284c7" />
            <defs>
              <linearGradient id="horizonGrad" x1="4" y1="42" x2="48" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0284c7" />
                <stop offset="0.4" stopColor="#0ea5e9" />
                <stop offset="0.8" stopColor="#38bdf8" />
                <stop offset="1" stopColor="#00f0ff" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* OPTION 4: MULTISPECTRAL PRISM BAND (Optical VNIR/SWIR Spectrum) */}
        {selectedVariant === 'spectral' && (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_12px_rgba(14,165,233,0.5)]"
          >
            {/* Outer Geostationary Ring */}
            <circle cx="26" cy="26" r="24" stroke="#0284c7" strokeWidth="1.2" strokeOpacity="0.35" />

            {/* Central Optical Prism Triangle */}
            <polygon
              points="26,8 43,40 9,40"
              fill="url(#prismGrad)"
              stroke="#38bdf8"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Internal Refraction Core */}
            <polygon
              points="26,16 37,36 15,36"
              fill="#0f172a"
              fillOpacity="0.6"
              stroke="#0284c7"
              strokeWidth="1"
            />

            {/* Decomposed Spectral Bands Ray (Blue, Green, Red/NIR) */}
            <path d="M26 8L37 36" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M23 26H46" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M26 30H47" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M29 34H48" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />

            {/* Incoming Solar Incident Beam */}
            <path d="M6 14L22 22" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22" cy="22" r="2" fill="#ffffff" className="animate-ping opacity-80" />

            {/* Micro Focal Plane Array Sensor */}
            <circle cx="26" cy="28" r="3" fill="#ffffff" />
            <circle cx="26" cy="28" r="1.5" fill="#0284c7" />

            <defs>
              <linearGradient id="prismGrad" x1="9" y1="8" x2="43" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="0.5" stopColor="#0284c7" stopOpacity="0.2" />
                <stop offset="1" stopColor="#6366f1" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* OPTION 5: SAR PHASED ARRAY RADAR DISH (Sentinel-1 Microwave Antenna) */}
        {selectedVariant === 'phased-array' && (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_12px_rgba(2,132,199,0.5)]"
          >
            {/* Parabolic Radar Dish Antenna */}
            <path
              d="M10 26C10 14 18 6 30 6"
              stroke="#0284c7"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M10 26C10 15 17 8 28 8"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Feedhorn Stanchion Struts */}
            <line x1="20" y1="16" x2="34" y2="30" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="34" cy="30" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
            <circle cx="34" cy="30" r="1.5" fill="#00f0ff" className="animate-pulse" />

            {/* Emitted Microwave Radar Pulses (C-Band Coherent Fronts) */}
            <path d="M37 33C40 36 43 40 45 45" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
            <path d="M33 37C35 41 38 45 40 49" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
            <path d="M41 29C44 33 47 37 49 42" stroke="#0ea5e9" strokeWidth="1.2" strokeLinecap="round" />

            {/* Ground Radar Target Footprint */}
            <ellipse cx="44" cy="46" rx="5" ry="2.5" fill="rgba(2, 132, 199, 0.25)" stroke="#00f0ff" strokeWidth="1" />

            {/* Satellite Gimbal Support Base */}
            <rect x="7" y="24" width="6" height="9" rx="1.5" fill="#0f172a" stroke="#0284c7" strokeWidth="1.2" />
            <line x1="10" y1="33" x2="10" y2="44" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <line x1="5" y1="44" x2="15" y2="44" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {/* OPTION 6: TRI-SATELLITE CONSTELLATION MESH */}
        {selectedVariant === 'constellation' && (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
          >
            {/* Central Globe Core */}
            <circle cx="26" cy="26" r="11" fill="url(#globeGrad)" stroke="#0284c7" strokeWidth="1.2" />
            {/* Latitude / Longitude Geospatial Grid */}
            <ellipse cx="26" cy="26" rx="11" ry="4.5" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="26" y1="15" x2="26" y2="37" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.6" />

            {/* Triangulation Inter-Satellite Crosslink Beam Network */}
            <polygon
              points="26,7 44,38 8,38"
              stroke="#00f0ff"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              fill="none"
            />

            {/* Satellite Node 1 (Polar Top) */}
            <g transform="translate(26, 7)">
              <circle cx="0" cy="0" r="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
              <rect x="-6" y="-1" width="3" height="2" rx="0.5" fill="#38bdf8" />
              <rect x="3" y="-1" width="3" height="2" rx="0.5" fill="#38bdf8" />
              <circle cx="0" cy="0" r="1.2" fill="#00f0ff" />
            </g>

            {/* Satellite Node 2 (Equatorial Right) */}
            <g transform="translate(44, 38)">
              <circle cx="0" cy="0" r="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
              <rect x="-6" y="-1" width="3" height="2" rx="0.5" fill="#38bdf8" />
              <rect x="3" y="-1" width="3" height="2" rx="0.5" fill="#38bdf8" />
              <circle cx="0" cy="0" r="1.2" fill="#00f0ff" />
            </g>

            {/* Satellite Node 3 (Equatorial Left) */}
            <g transform="translate(8, 38)">
              <circle cx="0" cy="0" r="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
              <rect x="-6" y="-1" width="3" height="2" rx="0.5" fill="#38bdf8" />
              <rect x="3" y="-1" width="3" height="2" rx="0.5" fill="#38bdf8" />
              <circle cx="0" cy="0" r="1.2" fill="#00f0ff" />
            </g>

            {/* Pulse Wave from Central Earth Station */}
            <circle cx="26" cy="26" r="3" fill="#00f0ff" className="animate-ping opacity-75" />

            <defs>
              <radialGradient id="globeGrad" cx="0.4" cy="0.4" r="0.8">
                <stop stopColor="#38bdf8" />
                <stop offset="0.6" stopColor="#0284c7" />
                <stop offset="1" stopColor="#0f172a" />
              </radialGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Switcher Indicator Notification */}
      {showSwitchTooltip && (
        <div className="absolute top-full left-0 mt-2 z-50 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-md shadow-lg border border-sky-500/40 whitespace-nowrap animate-bounce">
          Logo: {variantLabels[selectedVariant]}
        </div>
      )}

      {/* Brand Typography: SAT · QUERY AI with Color Fade */}
      <div className="flex flex-col">
        <div className={`font-black tracking-wider flex items-center gap-1.5 ${textSize}`}>
          {/* "SAT" with high-contrast metallic clarity */}
          <span className={darkText ? 'text-slate-900 font-black tracking-wider' : 'text-white font-black tracking-wider'}>
            SAT
          </span>

          {/* Luminous orbital dot divider */}
          <span className="text-cyan-500 font-bold mx-0.2 animate-pulse text-xs">
            ·
          </span>

          {/* "QUERY" with sophisticated aerospace cyan-blue color fade */}
          <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 dark:from-sky-400 dark:via-cyan-300 dark:to-indigo-300 bg-clip-text text-transparent font-black tracking-wider">
            QUERY
          </span>

          {/* "AI" high-tech illuminated badge */}
          <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-md bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-[0_0_10px_rgba(14,165,233,0.35)] border border-sky-300/40 tracking-widest uppercase ml-0.5">
            AI
          </span>
        </div>

        {/* Subtitle Tagline with refined letter-spacing */}
        {showTagline && (
          <span
            className={`text-[9px] tracking-[0.2em] uppercase font-bold mt-0.5 ${
              darkText
                ? 'bg-gradient-to-r from-slate-600 to-sky-700 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-300 via-sky-200 to-cyan-300 bg-clip-text text-transparent'
            }`}
          >
            Ask · Analyze · Understand Earth
          </span>
        )}
      </div>
    </div>
  );
};
