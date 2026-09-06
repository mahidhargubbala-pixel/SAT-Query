export type AnalysisMode = 'single' | 'bitemporal' | 'optical_sar';

export type AnalysisStatus =
  | 'Queued'
  | 'Validating'
  | 'Understanding'
  | 'Routing'
  | 'Processing'
  | 'Generating Evidence'
  | 'Completed'
  | 'Failed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization?: string;
  createdAt: string;
}

export type UserProfile = User;

export interface ImageMetadata {
  id: string;
  filename: string;
  format: string; // 'GeoTIFF' | 'TIFF' | 'PNG' | 'JPEG'
  width: number;
  height: number;
  resolutionGsd: string; // e.g. "10 m"
  modality: string; // e.g. "Sentinel-2 Multispectral", "Sentinel-1 C-Band SAR"
  bands: string; // e.g. "B2(Blue), B3(Green), B4(Red), B8(NIR)"
  coordinateSystem: string; // e.g. "WGS 84 / UTM zone 44N (EPSG:32644)"
  bounds?: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
  acquisitionDate?: string;
  cloudCover?: string;
  spatialAlignmentOk?: boolean;
  temporalDelta?: string;
  dataUrl: string; // base64 or served URL
  role: 'single' | 't1' | 't2' | 'optical' | 'sar';
}

export interface BoundingBox {
  id: string;
  label: string;
  score: number;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000 or 0-1
  color?: string;
  areaEstimate?: string;
}

export interface VisualEvidence {
  overlayType: 'bbox' | 'change_mask' | 'heatmap' | 'fusion_blend' | 'segmentation';
  boxes?: BoundingBox[];
  maskDataUrl?: string;
  changeMetrics?: {
    builtUpIncreasePercent?: number;
    vegetationChangePercent?: number;
    waterAreaChangePercent?: number;
    totalChangedPixels?: number;
  };
  crossModalHighlights?: {
    sarPenetratedClouds?: boolean;
    waterSpecularConfidence?: string;
    urbanDoubleBounceDetected?: boolean;
    fusionGainFactor?: string;
  };
  description: string;
}

export interface ExecutionStep {
  id: string;
  label: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  timestamp: string;
  durationMs?: number;
}

export interface TechnicalDetails {
  crs: string;
  gsdResolution: string;
  spectralBands: string;
  sensorPlatform: string;
  dimensions: string;
  spatialAlignment: string;
  modelArchitecture: string;
  adaptationDataset: string;
  inferenceTimeMs: number;
  processingDevice: string;
  adapterMode: string; // e.g. "Active LoRA PEFT (r=16)" or "DEMO MODE — simulated model adapter"
}

export interface AnalysisResult {
  id: string;
  analysisId: string;
  answer: string;
  confidence: 'High' | 'Moderate' | 'Low' | 'Estimating...';
  confidenceScore: number; // 0 - 100
  analysisType: string;
  modelsUsed: string[];
  evidence: VisualEvidence;
  executionSummary: ExecutionStep[];
  technicalDetails: TechnicalDetails;
  completedAt: string;
}

export interface Analysis {
  id: string;
  userId: string;
  title: string;
  query: string;
  mode: AnalysisMode;
  status: AnalysisStatus;
  images: ImageMetadata[];
  result?: AnalysisResult;
  isSaved?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModelRegistryItem {
  id: string;
  name: string;
  task: 'VQA' | 'Captioning' | 'Grounding' | 'Change Detection' | 'Change VQA' | 'Optical-SAR Fusion';
  modality: 'Multispectral' | 'Optical RGB' | 'Bi-temporal Pair' | 'Sentinel-1 SAR + Sentinel-2 MSI';
  supportedInput: string;
  version: string;
  status: 'active' | 'ready' | 'standby';
  parameters: string;
  adaptationDataset: string; // e.g. "BigEarthNet.txt", "VRSBench", "RSVQA", "CDVQA"
  architecture: string;
  latencyMs: number;
  benchmarkScore: string;
}

export interface ReportItem {
  id: string;
  analysisId: string;
  userId: string;
  title: string;
  query: string;
  analysisType: string;
  createdAt: string;
  summary: string;
  confidence: string;
  modelsUsed: string[];
  pdfUrl?: string;
}

export interface BenchmarkItem {
  id: string;
  name: string;
  task: string;
  description: string;
  sampleCount: string;
  modalities: string;
  keyMetric: string;
  satQueryScore: string;
  citation: string;
}
