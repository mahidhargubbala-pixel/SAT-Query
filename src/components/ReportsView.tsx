import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Eye,
  Plus,
  Inbox
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Analysis, ReportItem } from '../types';
import { Logo } from './Logo';

interface ReportsViewProps {
  onOpenAnalysis: (analysisId: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onOpenAnalysis }) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedReport, setSelectedReport] = useState<{ report: ReportItem; analysis?: Analysis } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    const token = localStorage.getItem('satquery_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    Promise.all([
      fetch('/api/reports', { headers }).then(r => r.json()),
      fetch('/api/analyses', { headers }).then(r => r.json())
    ])
      .then(([reportsData, analysesData]) => {
        if (reportsData.reports) setReports(reportsData.reports);
        if (analysesData.analyses) setAnalyses(analysesData.analyses);
      })
      .catch(err => console.error('Error fetching reports:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreateReport = async (analysisId: string) => {
    try {
      const token = localStorage.getItem('satquery_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers,
        body: JSON.stringify({ analysisId })
      });
      if (res.ok) fetchReports();
    } catch (err) {
      console.error('Error creating report:', err);
    }
  };

  const handleDeleteReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this report?')) return;
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) fetchReports();
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  // Generate & Download PDF using jsPDF
  const exportPdf = (report: ReportItem, analysis?: Analysis) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Header Band
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SATQUERY AI', 15, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(56, 189, 248);
    doc.text('“Ask. Analyze. Understand Earth.” • Multimodal Remote Sensing Report', 15, 22);

    doc.setFontSize(8);
    doc.setTextColor(220, 220, 220);
    doc.text(`Generated: ${new Date(report.createdAt).toLocaleString()}`, 135, 14);
    doc.text(`Report ID: ${report.id}`, 135, 20);

    // Section 1: Investigation Details
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Mission & Query Overview', 15, 42);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Title: ${report.title}`, 15, 50);
    doc.text(`Query: "${report.query}"`, 15, 57);
    doc.text(`Pipeline Mode: ${report.analysisType}`, 15, 64);
    doc.text(`Confidence: ${report.confidence}`, 15, 71);

    // Section 2: Executive Summary
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Specialist Vision-Language Model Findings', 15, 84);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    const splitSummary = doc.splitTextToSize(report.summary || '', 180);
    doc.text(splitSummary, 15, 92);

    // Section 3: Technical Details
    let yPos = 135;
    if (analysis?.result?.technicalDetails) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Geospatial & Sensor Specifications', 15, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const tech = analysis.result.technicalDetails;
      doc.text(`• Coordinate Reference System: ${tech.crs || 'WGS 84 (EPSG:4326)'}`, 15, yPos);
      yPos += 6;
      doc.text(`• Spatial Resolution (GSD): ${tech.gsdResolution || '10 m'}`, 15, yPos);
      yPos += 6;
      doc.text(`• Spectral Bands: ${tech.spectralBands || 'Multispectral'}`, 15, yPos);
      yPos += 6;
      doc.text(`• Sensor Platform: ${tech.sensorPlatform || 'Sentinel-2 / Sentinel-1'}`, 15, yPos);
      yPos += 6;
      doc.text(`• Adaptation Dataset: ${tech.adaptationDataset || 'BigEarthNet.txt + VRSBench'}`, 15, yPos);
      yPos += 6;
      doc.text(`• Inference Latency: ${tech.inferenceTimeMs || 450} ms (Cloud TPU-v4 Accelerated)`, 15, yPos);
      yPos += 12;
    }

    // Models used
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Models Executed:', 15, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(report.modelsUsed.join(', '), 50, yPos);

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 275, 195, 275);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('SatQuery AI • Smart India Hackathon Solution • Automated Remote Sensing Intelligence', 15, 282);

    doc.save(`${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_Report.pdf`);
  };

  const eligibleForReport = analyses.filter(a => a.result && !reports.some(r => r.analysisId === a.id));

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Intelligence Reports & Dossiers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized technical reports exported from real-time multimodal analysis results.
          </p>
        </div>

        {eligibleForReport.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">New Analysis ready:</span>
            <button
              onClick={() => handleCreateReport(eligibleForReport[0].id)}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Generate Dossier</span>
            </button>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Inbox size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No reports generated yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you complete an analysis in the Workspace, you can export and save an official remote sensing report here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map(report => {
            const linkedAnalysis = analyses.find(a => a.id === report.analysisId);

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 uppercase">
                      {report.analysisType}
                    </span>
                    <button
                      onClick={e => handleDeleteReport(report.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 italic line-clamp-2">
                      "{report.query}"
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {report.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {report.confidence}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportPdf(report, linkedAnalysis)}
                      className="flex-1 py-1.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Download size={13} />
                      <span>Download PDF</span>
                    </button>
                    {linkedAnalysis && (
                      <button
                        onClick={() => onOpenAnalysis(linkedAnalysis.id)}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                        title="Open in Workspace"
                      >
                        <Eye size={13} />
                        <span>Workspace</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
