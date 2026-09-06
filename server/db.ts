import fs from 'fs';
import path from 'path';
import { Analysis, User, ModelRegistryItem, ReportItem, BenchmarkItem } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'satquery_db.json');

interface DatabaseSchema {
  users: User[];
  analyses: Analysis[];
  models: ModelRegistryItem[];
  reports: ReportItem[];
  benchmarks: BenchmarkItem[];
}

// Initial Model Registry according to SIH SatQuery AI specifications
const DEFAULT_MODELS: ModelRegistryItem[] = [
  {
    id: 'mod-vqa-1',
    name: 'SatQuery-VQA-Pro',
    task: 'VQA',
    modality: 'Multispectral',
    supportedInput: 'Sentinel-2 (12-Band GeoTIFF), Landsat 8/9, RGB TIFF/PNG',
    version: 'v2.4.1',
    status: 'active',
    parameters: '340M (RS-ViT-B/16 + Decoupled Cross-Attention)',
    adaptationDataset: 'BigEarthNet.txt + RSVQA-LR/HR',
    architecture: 'Vision-Language Remote Sensing Transformer with LoRA (r=16, alpha=32)',
    latencyMs: 380,
    benchmarkScore: '89.4% Accuracy (RSVQA Benchmark)'
  },
  {
    id: 'mod-cap-1',
    name: 'SatQuery-Captioner-Earth',
    task: 'Captioning',
    modality: 'Optical RGB',
    supportedInput: 'High-Res Optical GeoTIFF/TIFF, Multispectral Composites',
    version: 'v1.8.0',
    status: 'active',
    parameters: '410M (RS-BLIP2 encoder with prefix projection)',
    adaptationDataset: 'BigEarthNet.txt (Multi-label textual annotations)',
    architecture: 'Hierarchical Spatial Attention Captioning Network',
    latencyMs: 420,
    benchmarkScore: '78.2 BLEU-4 / 1.34 CIDEr (VRSBench)'
  },
  {
    id: 'mod-grd-1',
    name: 'SatQuery-Grounder-Loc',
    task: 'Grounding',
    modality: 'Multispectral',
    supportedInput: 'GeoTIFF / TIFF (Multispectral & High-Res RGB)',
    version: 'v2.1.0',
    status: 'active',
    parameters: '220M (GroundingDINO-RS backbone)',
    adaptationDataset: 'VRSBench Grounding Split',
    architecture: 'Dual-encoder Query-to-Region Cross-Modality Feature Pyramid',
    latencyMs: 310,
    benchmarkScore: '76.8% Acc@0.5 IoU (VRSBench Grounding)'
  },
  {
    id: 'mod-cd-1',
    name: 'SatQuery-ChangeDet-Siamese',
    task: 'Change Detection',
    modality: 'Bi-temporal Pair',
    supportedInput: 'Co-registered T1 and T2 GeoTIFFs (Sentinel-2 / Landsat)',
    version: 'v3.0.2',
    status: 'active',
    parameters: '290M (Siamese ResNeXt-101 + Temporal Difference Conv)',
    adaptationDataset: 'BigEarthNet.txt Bi-temporal Pair Adaptation + CDVQA',
    architecture: 'Bi-temporal Siamese Spatial-Temporal Cross-Attention (BIT-Net)',
    latencyMs: 520,
    benchmarkScore: '92.1% F1-score / 85.3% IoU (LEVIR-CD+)'
  },
  {
    id: 'mod-cvqa-1',
    name: 'SatQuery-ChangeVQA-Temporal',
    task: 'Change VQA',
    modality: 'Bi-temporal Pair',
    supportedInput: 'T1 & T2 Image Pair + Natural Language Query',
    version: 'v1.5.0',
    status: 'active',
    parameters: '480M (Bitemporal-Q&A Multi-Scale Transformer)',
    adaptationDataset: 'CDVQA (Change Detection Visual Question Answering)',
    architecture: 'Temporal Contrastive Language-Vision Fusion Engine',
    latencyMs: 590,
    benchmarkScore: '83.7% Accuracy (CDVQA Benchmark)'
  },
  {
    id: 'mod-fusion-1',
    name: 'SatQuery-OpticalSAR-DeepFusion',
    task: 'Optical-SAR Fusion',
    modality: 'Sentinel-1 SAR + Sentinel-2 MSI',
    supportedInput: 'Co-registered Optical (RGB/NIR) + Sentinel-1 SAR (VV/VH backscatter)',
    version: 'v2.2.0',
    status: 'active',
    parameters: '510M (Dual-Branch Co-Attention Deep Fusion Network)',
    adaptationDataset: 'BigEarthNet.txt (co-registered S1 SAR + S2 MSI multi-modal pairs)',
    architecture: 'Cross-Attention Dual-Stream Encoder with Physical Microwave Invariance',
    latencyMs: 640,
    benchmarkScore: '91.8% F1-score Multi-label Land-cover (BigEarthNet-S1/S2)'
  }
];

const DEFAULT_BENCHMARKS: BenchmarkItem[] = [
  {
    id: 'bm-vrsbench',
    name: 'VRSBench',
    task: 'Visual Grounding, Captioning & VQA for High-Res Remote Sensing',
    description: 'Comprehensive open-source benchmark for visual question answering, dense captioning, and bounding-box spatial grounding on sub-meter satellite imagery.',
    sampleCount: '120,000+ question-answer & grounding pairs',
    modalities: 'Sub-meter High-Resolution Optical RGB',
    keyMetric: 'mAP@0.5 / Accuracy / CIDEr',
    satQueryScore: '76.8% Grounding Acc / 88.5% VQA Acc',
    citation: 'VRSBench: A Versatile Vision-Language Benchmark for Remote Sensing'
  },
  {
    id: 'bm-rsvqa',
    name: 'RSVQA (Low/High Resolution)',
    task: 'Remote Sensing Visual Question Answering',
    description: 'Standard remote sensing VQA benchmark targeting presence, comparison, and rural/urban land-cover counting questions over Sentinel-2 and aerial images.',
    sampleCount: '77,222 questions across 772 image tiles',
    modalities: 'Sentinel-2 L1C & High-Res Aerial',
    keyMetric: 'Overall Accuracy (OA)',
    satQueryScore: '89.4% Overall Accuracy',
    citation: 'RSVQA: Visual Question Answering for Remote Sensing Data'
  },
  {
    id: 'bm-cdvqa',
    name: 'CDVQA Benchmark',
    task: 'Change Detection Visual Question Answering',
    description: 'Bi-temporal question answering benchmark evaluating reasoning over structural land-use changes, building expansions, and environmental degradation.',
    sampleCount: '38,500 bi-temporal question-answer pairs',
    modalities: 'Co-registered Bi-temporal Satellite Pairs',
    keyMetric: 'Bi-temporal QA Accuracy & F1',
    satQueryScore: '83.7% Accuracy',
    citation: 'CDVQA: Change Detection Visual Question Answering Benchmark'
  },
  {
    id: 'bm-bigearthnet',
    name: 'BigEarthNet.txt (Multimodal)',
    task: 'Optical + SAR Remote-Sensing Vision-Language Pre-training',
    description: 'Primary dataset for remote-sensing adaptation using co-registered Sentinel-1 SAR, Sentinel-2 multispectral imagery, and diverse text annotations (arXiv:2603.29630).',
    sampleCount: '590,326 co-registered pairs with rich textual descriptions',
    modalities: 'Sentinel-1 Dual-Pol SAR (VV/VH) & Sentinel-2 12-Band MSI',
    keyMetric: 'Macro F1 / Mean Average Precision (mAP)',
    satQueryScore: '91.8% Macro F1 on 19 CORINE land-cover classes',
    citation: 'BigEarthNet.txt: Co-registered Multimodal SAR-MSI Dataset with Textual Supervision (arXiv:2603.29630)'
  }
];

const DEFAULT_USERS: User[] = [];

export class Database {
  private db: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.db = this.load();
  }

  public clearAllAnalyses(): void {
    this.db.analyses = [];
    this.save();
  }

  public clearAllReports(): void {
    this.db.reports = [];
    this.save();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || DEFAULT_USERS,
          analyses: parsed.analyses || [],
          models: parsed.models || DEFAULT_MODELS,
          reports: parsed.reports || [],
          benchmarks: parsed.benchmarks || DEFAULT_BENCHMARKS
        };
      } catch (e) {
        console.error('Error reading database file, initializing defaults:', e);
      }
    }
    const initial: DatabaseSchema = {
      users: DEFAULT_USERS,
      analyses: [],
      models: DEFAULT_MODELS,
      reports: [],
      benchmarks: DEFAULT_BENCHMARKS
    };
    this.save(initial);
    return initial;
  }

  private save(data?: DatabaseSchema) {
    if (data) this.db = data;
    fs.writeFileSync(DB_PATH, JSON.stringify(this.db, null, 2), 'utf-8');
  }

  // User management
  public findUserByEmail(email: string): User | undefined {
    return this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  public createUser(email: string, name: string): User {
    const existing = this.findUserByEmail(email);
    if (existing) return existing;
    const user: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: email.toLowerCase(),
      name,
      role: 'Analyst',
      createdAt: new Date().toISOString()
    };
    this.db.users.push(user);
    this.save();
    return user;
  }

  // Analyses
  public getAnalyses(userId?: string): Analysis[] {
    if (!userId) return this.db.analyses;
    return this.db.analyses.filter(a => a.userId === userId);
  }

  public getAnalysis(id: string, userId?: string): Analysis | undefined {
    return this.db.analyses.find(a => a.id === id && (!userId || a.userId === userId));
  }

  public createAnalysis(analysis: Analysis): Analysis {
    this.db.analyses.unshift(analysis);
    this.save();
    return analysis;
  }

  public updateAnalysis(id: string, updates: Partial<Analysis>): Analysis | undefined {
    const idx = this.db.analyses.findIndex(a => a.id === id);
    if (idx === -1) return undefined;
    this.db.analyses[idx] = {
      ...this.db.analyses[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.db.analyses[idx];
  }

  public deleteAnalysis(id: string, userId?: string): boolean {
    const lenBefore = this.db.analyses.length;
    this.db.analyses = this.db.analyses.filter(a => !(a.id === id && (!userId || a.userId === userId)));
    const deleted = this.db.analyses.length < lenBefore;
    if (deleted) this.save();
    return deleted;
  }

  public toggleSaveAnalysis(id: string, userId: string, notes?: string): Analysis | undefined {
    const analysis = this.getAnalysis(id, userId);
    if (!analysis) return undefined;
    analysis.isSaved = !analysis.isSaved;
    if (notes !== undefined) analysis.notes = notes;
    analysis.updatedAt = new Date().toISOString();
    this.save();
    return analysis;
  }

  // Models
  public getModels(): ModelRegistryItem[] {
    return this.db.models;
  }

  // Reports
  public getReports(userId?: string): ReportItem[] {
    if (!userId) return this.db.reports;
    return this.db.reports.filter(r => r.userId === userId);
  }

  public createReport(report: ReportItem): ReportItem {
    this.db.reports.unshift(report);
    this.save();
    return report;
  }

  public deleteReport(id: string, userId?: string): boolean {
    const len = this.db.reports.length;
    this.db.reports = this.db.reports.filter(r => !(r.id === id && (!userId || r.userId === userId)));
    if (this.db.reports.length < len) {
      this.save();
      return true;
    }
    return false;
  }

  // Benchmarks
  public getBenchmarks(): BenchmarkItem[] {
    return this.db.benchmarks;
  }
}

export const db = new Database();
