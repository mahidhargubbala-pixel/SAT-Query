import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  Eye,
  EyeOff,
  Sliders,
  Crosshair,
  Info
} from 'lucide-react';
import { AnalysisMode, BoundingBox, ImageMetadata, VisualEvidence } from '../types';

interface SatelliteImageViewerProps {
  mode: AnalysisMode;
  images: ImageMetadata[];
  evidence?: VisualEvidence;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const SatelliteImageViewer: React.FC<SatelliteImageViewerProps> = ({
  mode,
  images,
  evidence,
  activeTab: externalTab,
  onTabChange
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; lat?: number; lon?: number } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'default' | 't1' | 't2' | 'change' | 'optical' | 'sar' | 'fusion'>(
    mode === 'bitemporal' ? 'change' : mode === 'optical_sar' ? 'fusion' : 'default'
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with external tab if provided
  useEffect(() => {
    if (externalTab) {
      setActiveSubTab(externalTab as any);
    }
  }, [externalTab]);

  const handleSubTabChange = (tab: any) => {
    setActiveSubTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      setHoverCoord({ x, y });
    }

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Swipe slider for bi-temporal comparison
  const [swipePosition, setSwipePosition] = useState(50);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSwipeMove = (e: React.MouseEvent) => {
    if (!isSwiping || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSwipePosition((x / rect.width) * 100);
  };

  // Determine current image to render based on sub-tab
  const getCurrentImage = (): ImageMetadata | undefined => {
    if (!images || images.length === 0) return undefined;

    if (mode === 'bitemporal') {
      if (activeSubTab === 't1') return images.find(img => img.role === 't1') || images[0];
      if (activeSubTab === 't2') return images.find(img => img.role === 't2') || images[1] || images[0];
      return images.find(img => img.role === 't2') || images[0];
    }
    if (mode === 'optical_sar') {
      if (activeSubTab === 'optical') return images.find(img => img.role === 'optical') || images[0];
      if (activeSubTab === 'sar') return images.find(img => img.role === 'sar') || images[1] || images[0];
      return images.find(img => img.role === 'optical') || images[0];
    }
    return images[0];
  };

  const currentImage = getCurrentImage();

  return (
    <div
      ref={containerRef}
      id="satellite-viewer-container"
      data-radar="true"
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md flex flex-col ${
        isFullscreen ? 'h-screen' : 'h-[500px] lg:h-[580px]'
      }`}
    >
      {/* Top Controls Bar */}
      <div className="z-20 flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur border-b border-slate-200">
        {/* Mode-Specific Navigation Tabs */}
        <div className="flex items-center gap-1.5">
          {mode === 'bitemporal' && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => handleSubTabChange('t1')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 't1' ? 'bg-white text-sky-700 font-bold border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                T1 (2021)
              </button>
              <button
                onClick={() => handleSubTabChange('t2')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 't2' ? 'bg-white text-sky-700 font-bold border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                T2 (2024)
              </button>
              <button
                onClick={() => handleSubTabChange('change')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'change' ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CHANGE MAP
              </button>
            </div>
          )}

          {mode === 'optical_sar' && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => handleSubTabChange('optical')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'optical' ? 'bg-white text-sky-700 font-bold border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                OPTICAL (S2)
              </button>
              <button
                onClick={() => handleSubTabChange('sar')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'sar' ? 'bg-white text-sky-700 font-bold border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SAR (S1 RADAR)
              </button>
              <button
                onClick={() => handleSubTabChange('fusion')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === 'fusion' ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                JOINT EVIDENCE
              </button>
            </div>
          )}

          {mode === 'single' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                {currentImage?.modality || 'Multispectral Sensor'}
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline font-medium">
                {currentImage?.resolutionGsd || '10m GSD'}
              </span>
            </div>
          )}
        </div>

        {/* Viewport Action Controls */}
        <div className="flex items-center gap-2">
          {/* Overlay Visibility Toggle */}
          {evidence && (
            <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setShowOverlays(!showOverlays)}
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  showOverlays ? 'text-sky-700' : 'text-slate-500 hover:text-slate-800'
                }`}
                title={showOverlays ? 'Hide Evidence Overlay' : 'Show Evidence Overlay'}
              >
                {showOverlays ? <Eye size={14} /> : <EyeOff size={14} />}
                <span className="hidden md:inline">Evidence</span>
              </button>

              {showOverlays && (
                <div className="flex items-center gap-1 pl-1.5 border-l border-slate-300">
                  <Sliders size={12} className="text-slate-500" />
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={overlayOpacity}
                    onChange={e => setOverlayOpacity(parseFloat(e.target.value))}
                    className="w-14 h-1 bg-slate-300 rounded appearance-none cursor-pointer accent-sky-600"
                    title={`Overlay Opacity: ${Math.round(overlayOpacity * 100)}%`}
                  />
                </div>
              )}
            </div>
          )}

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-700 hover:text-sky-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <span className="text-[11px] font-mono font-bold px-1 text-slate-700 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-700 hover:text-sky-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-700 hover:text-sky-700 hover:bg-slate-200 rounded-lg transition-colors ml-0.5"
              title="Reset View"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Viewport & Canvas Area */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          handleMouseMove(e);
          handleSwipeMove(e);
        }}
        onMouseUp={() => {
          handleMouseUp();
          setIsSwiping(false);
        }}
        onMouseLeave={() => {
          handleMouseUp();
          setIsSwiping(false);
          setHoverCoord(null);
        }}
      >
        {/* Bi-Temporal Swipe Mode */}
        {mode === 'bitemporal' && activeSubTab === 'change' && images.length >= 2 ? (
          <div
            className="relative w-full h-full"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {/* T2 (Underneath / Right) */}
            <img
              src={images[1]?.dataUrl || images[0]?.dataUrl}
              alt="T2 2024"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* T1 (Top clipped by swipe position) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${swipePosition}%` }}
            >
              <img
                src={images[0]?.dataUrl}
                alt="T1 2021"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current?.clientWidth || '100%', height: '100%' }}
              />
            </div>

            {/* Evidence Heatmap Overlay on top */}
            {evidence && showOverlays && evidence.maskDataUrl && (
              <img
                src={evidence.maskDataUrl}
                alt="Change mask"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen"
                style={{ opacity: overlayOpacity }}
              />
            )}

            {/* Swipe Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize pointer-events-auto z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              style={{ left: `${swipePosition}%` }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsSwiping(true);
              }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-lg flex items-center justify-center text-[10px] font-bold">
                ⬄
              </div>
            </div>
          </div>
        ) : (
          /* Standard / Optical-SAR / Single View */
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {currentImage ? (
              <img
                src={currentImage.dataUrl}
                alt={currentImage.filename}
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
              />
            ) : (
              <div className="text-slate-400 text-xs">No satellite raster loaded</div>
            )}

            {/* Bounding Boxes / Spatial Visual Evidence Layer */}
            {evidence && showOverlays && evidence.boxes && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {evidence.boxes.map((box: BoundingBox, idx: number) => {
                  const [rawYmin, rawXmin, rawYmax, rawXmax] = box.box2d;
                  // If coordinates are in 600px canvas scale, convert to percentage (0-100)
                  const scale = rawYmax > 1 ? 6 : 0.01;
                  const ymin = rawYmin / scale;
                  const xmin = rawXmin / scale;
                  const ymax = rawYmax / scale;
                  const xmax = rawXmax / scale;
                  const width = xmax - xmin;
                  const height = ymax - ymin;

                  return (
                    <g key={box.id || idx} style={{ opacity: overlayOpacity }}>
                      <rect
                        x={xmin}
                        y={ymin}
                        width={width}
                        height={height}
                        fill={box.color || '#38bdf8'}
                        fillOpacity="0.2"
                        stroke={box.color || '#38bdf8'}
                        strokeWidth="1"
                        strokeDasharray="2 1"
                        className="animate-pulse"
                      />
                      <foreignObject
                        x={xmin}
                        y={Math.max(0, ymin - 8)}
                        width="35"
                        height="8"
                      >
                        <div
                          className="px-1 py-0.2 text-[3px] font-bold rounded truncate inline-block text-white shadow"
                          style={{ backgroundColor: box.color || '#0284c7' }}
                        >
                          {box.label} ({Math.round(box.score * 100)}%)
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        )}

        {/* Bottom Metadata & Coordinate HUD */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-3 text-[11px] text-slate-700 shadow-sm">
            <div className="flex items-center gap-1.5 font-medium">
              <Crosshair size={13} className="text-sky-600" />
              <span>
                Pixel: <span className="font-mono text-slate-900 font-bold">{hoverCoord?.x ?? 300}, {hoverCoord?.y ?? 300}</span>
              </span>
            </div>
            <div className="h-3 w-[1px] bg-slate-200" />
            <div className="font-mono text-slate-500 hidden sm:block">
              {currentImage?.coordinateSystem || 'WGS 84 / UTM 44N'}
            </div>
          </div>

          {evidence && (
            <div className="bg-white/90 backdrop-blur border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] text-emerald-800 font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Spatial Grounding Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
