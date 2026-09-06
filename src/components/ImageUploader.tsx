import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Database,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { AnalysisMode, ImageMetadata } from '../types';

interface ImageUploaderProps {
  mode: AnalysisMode;
  images: ImageMetadata[];
  onImagesChange: (images: ImageMetadata[]) => void;
  onLoadSample: (sampleKey: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  mode,
  images,
  onImagesChange,
  onLoadSample
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null, targetRole?: 'single' | 't1' | 't2' | 'optical' | 'sar') => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = async e => {
        const dataUrl = e.target?.result as string;

        // Call backend automatic inspector
        const res = await fetch('/api/images/inspect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            format: file.name.endsWith('.tif') ? 'GeoTIFF' : 'PNG',
            dataUrl,
            role: targetRole || (mode === 'bitemporal' ? 't1' : mode === 'optical_sar' ? 'optical' : 'single')
          })
        });

        if (res.ok) {
          const data = await res.json();
          const newImg: ImageMetadata = data.metadata;

          if (mode === 'single') {
            onImagesChange([newImg]);
          } else {
            // Replace matching role or add
            const updated = images.filter(img => img.role !== newImg.role);
            onImagesChange([...updated, newImg]);
          }
        }
        setIsProcessing(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File inspect error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3.5 text-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <UploadCloud size={18} className="text-sky-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {mode === 'single'
              ? 'Satellite Imagery Input'
              : mode === 'bitemporal'
              ? 'Bi-temporal Imagery (T1 & T2)'
              : 'Co-registered Multimodal Inputs (Optical + SAR)'}
          </h4>
        </div>

        {/* 1-Click Sample Preset Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Benchmark Scenes:</span>
          <select
            onChange={e => {
              if (e.target.value) onLoadSample(e.target.value);
            }}
            defaultValue=""
            className="text-xs bg-slate-50 border border-slate-300 text-slate-800 font-semibold rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-sky-500"
          >
            <option value="" disabled>Load Curated Dataset ▾</option>
            {mode === 'single' && (
              <>
                <option value="single_harbor">Visakhapatnam Harbor (Sentinel-2 10m)</option>
                <option value="single_suburban">Hyderabad Peri-Urban (BigEarthNet-S2)</option>
              </>
            )}
            {mode === 'bitemporal' && (
              <option value="bitemporal_expansion">Urban Fringe Expansion 2021 vs 2024</option>
            )}
            {mode === 'optical_sar' && (
              <option value="optical_sar_fusion">Cloud-Resilient Flood Inundation (Optical + SAR)</option>
            )}
          </select>
        </div>
      </div>

      {/* Upload Drag-and-Drop Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-sky-500 bg-sky-50'
            : 'border-slate-300 hover:border-sky-400 bg-slate-50/70 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".tif,.tiff,.png,.jpg,.jpeg"
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
            {isProcessing ? (
              <div className="w-5 h-5 rounded-full border-2 border-sky-600 border-t-transparent animate-spin" />
            ) : (
              <UploadCloud size={20} />
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">
              Drag and drop GeoTIFF / TIFF or click to browse
            </p>
            <p className="text-[11px] text-slate-500">
              Compatible with Sentinel-1/2, Landsat-8/9, High-Res Pleiades, PNG or JPEG
            </p>
          </div>
        </div>
      </div>

      {/* Automatic Validation Chips */}
      {images.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Input Validated & Spatial Metadata Detected</span>
            </div>
            <button
              onClick={() => setShowTechDetails(!showTechDetails)}
              className="text-[11px] text-sky-700 hover:text-sky-900 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>{showTechDetails ? 'Hide technical details' : 'View technical details'}</span>
              {showTechDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>

          {/* Simple Human-Friendly Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold shadow-xs">
              ✓ {images[0].modality}
            </span>
            <span className="text-[11px] bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold shadow-xs">
              ✓ {images[0].resolutionGsd}
            </span>
            <span className="text-[11px] bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold shadow-xs">
              ✓ Geographic Location Detected
            </span>
            <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold shadow-xs">
              ✓ Ready for Real-Time Analysis
            </span>
          </div>

          {/* Technical Metadata Drawer */}
          {showTechDetails && (
            <div className="mt-1 pt-2 border-t border-slate-200 text-[10.5px] font-mono text-slate-600 space-y-1 animate-in fade-in duration-150">
              {images.map((img, i) => (
                <div key={img.id || i} className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="text-sky-700 font-bold mb-1 truncate">
                    {img.role.toUpperCase()}: {img.filename}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-slate-700">
                    <div>CRS: {img.coordinateSystem}</div>
                    <div>Format: {img.format} ({img.width}×{img.height})</div>
                    <div className="col-span-2 truncate">Bands: {img.bands}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
