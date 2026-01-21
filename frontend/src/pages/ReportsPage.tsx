import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    FileText,
    Download,
    Calendar,
    CheckCircle2,
    Clock,
    Globe2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AOIService, AnalysisService, AOI } from '../services/mockData';

interface ReportData {
    report_title: string;
    generated_at: string;
    generated_by: string;
    aoi: {
        id: string;
        name: string;
        description?: string;
        change_type: string;
        monitoring_frequency: string;
        confidence_threshold?: number;
        status: string;
        created_at: string;
    };
    ndvi_analysis: {
        trend: string;
        trendDescription: string;
        min: string;
        max: string;
        avg: string;
        current: string;
    };
    total_alerts: number;
    recent_alerts: any[];
    footer: string;
}

export default function ReportsPage() {
    const [searchParams] = useSearchParams();
    const [aois, setAois] = useState<AOI[]>([]);
    const [selectedAoi, setSelectedAoi] = useState<string | null>(null);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchAOIs();
    }, []);

    const fetchAOIs = async () => {
        try {
            const data = await AOIService.getAll();
            setAois(data);

            // Check if there's an AOI ID in URL params
            const aoiFromUrl = searchParams.get('aoi');
            if (aoiFromUrl && data.find(a => a._id === aoiFromUrl)) {
                setSelectedAoi(aoiFromUrl);
            } else if (data.length > 0) {
                setSelectedAoi(data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching zones:', error);
            toast.error('Failed to fetch monitoring zones');
        } finally {
            setLoading(false);
        }
    };

    const generateReport = async () => {
        if (!selectedAoi) {
            toast.error('Please select a zone');
            return;
        }

        setGenerating(true);
        try {
            const response = await AnalysisService.generateReport(selectedAoi);
            setReportData(response);
            toast.success('Report generated successfully!');
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    const downloadReportJSON = () => {
        if (!reportData) return;

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `geowatch-report-${reportData.aoi.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Report downloaded!');
    };

    const downloadReportPDF = () => {
        if (!reportData) return;

        // Create a simple HTML report and trigger print dialog
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('Please allow popups to download PDF');
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>GeoWatch Report - ${reportData.aoi.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                    h1 { color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
                    h2 { color: #333; margin-top: 30px; }
                    .header { background: linear-gradient(135deg, #0066cc, #00aa66); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
                    .header h1 { color: white; border: none; margin: 0; }
                    .header p { margin: 10px 0 0 0; opacity: 0.9; }
                    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
                    .stat-card { background: #f5f5f5; padding: 20px; border-radius: 10px; }
                    .stat-label { color: #666; font-size: 14px; }
                    .stat-value { font-size: 24px; font-weight: bold; color: #333; }
                    .trend-increasing { color: #22c55e; }
                    .trend-decreasing { color: #ef4444; }
                    .trend-stable { color: #f59e0b; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background: #f5f5f5; }
                    .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                    @media print { body { padding: 20px; } .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🌍 ${reportData.report_title}</h1>
                    <p>${reportData.aoi.name}</p>
                    <p style="font-size: 12px; margin-top: 15px;">Generated: ${new Date(reportData.generated_at).toLocaleString()}</p>
                </div>
                
                <h2>Zone Configuration</h2>
                <table>
                    <tr><th>Property</th><th>Value</th></tr>
                    <tr><td>Name</td><td>${reportData.aoi.name}</td></tr>
                    <tr><td>Change Type</td><td style="text-transform: capitalize;">${reportData.aoi.change_type}</td></tr>
                    <tr><td>Monitoring Frequency</td><td style="text-transform: capitalize;">${reportData.aoi.monitoring_frequency}</td></tr>
                    <tr><td>Status</td><td style="text-transform: capitalize;">${reportData.aoi.status}</td></tr>
                    ${reportData.aoi.description ? `<tr><td>Description</td><td>${reportData.aoi.description}</td></tr>` : ''}
                </table>
                
                <h2>NDVI Analysis</h2>
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-label">Current NDVI</div>
                        <div class="stat-value" style="color: #22c55e;">${reportData.ndvi_analysis.current}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Average NDVI</div>
                        <div class="stat-value">${reportData.ndvi_analysis.avg}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Max NDVI</div>
                        <div class="stat-value">${reportData.ndvi_analysis.max}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Min NDVI</div>
                        <div class="stat-value">${reportData.ndvi_analysis.min}</div>
                    </div>
                </div>
                
                <h2>Trend Analysis</h2>
                <p><strong>Trend:</strong> <span class="trend-${reportData.ndvi_analysis.trend}" style="text-transform: capitalize;">${reportData.ndvi_analysis.trend}</span></p>
                <p>${reportData.ndvi_analysis.trendDescription}</p>
                
                <h2>Change Detection</h2>
                <p>Total alerts detected: <strong>${reportData.total_alerts}</strong></p>
                
                <div class="footer">
                    <p>${reportData.footer}</p>
                    <p style="font-size: 12px;">© 2026 GeoWatch. All rights reserved.</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load then trigger print
        printWindow.onload = () => {
            printWindow.print();
        };

        toast.success('PDF print dialog opened!');
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/4 mb-6"></div>
                    <div className="card h-96"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <FileText className="h-8 w-8 text-geowatch-accent" />
                    GeoWatch Reports
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Generate and download comprehensive analysis reports</p>
            </div>

            {aois.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No monitoring zones</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Create a zone to start generating reports</p>
                    <Link to="/create-aoi" className="btn btn-primary">
                        Define First Zone
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Report Generator */}
                    <div className="card lg:col-span-1">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Generate Report</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Select Monitoring Zone
                                </label>
                                <select
                                    value={selectedAoi || ''}
                                    onChange={(e) => setSelectedAoi(e.target.value)}
                                    className="input-geowatch"
                                >
                                    {aois.map(aoi => (
                                        <option key={aoi._id} value={aoi._id}>
                                            {aoi.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Report Includes:</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-geowatch-accent" />
                                        AOI configuration details
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-geowatch-accent" />
                                        NDVI statistics & trends
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-geowatch-accent" />
                                        Change detection summary
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-geowatch-accent" />
                                        Trend analysis results
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={generateReport}
                                disabled={generating || !selectedAoi}
                                className="btn btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <div className="spinner"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="h-5 w-5" />
                                        Generate GeoWatch Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Report Preview */}
                    <div className="card lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Report Preview</h2>
                            {reportData && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={downloadReportJSON}
                                        className="btn btn-secondary flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        JSON
                                    </button>
                                    <button
                                        onClick={downloadReportPDF}
                                        className="btn btn-accent flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        PDF
                                    </button>
                                </div>
                            )}
                        </div>

                        {reportData ? (
                            <div className="space-y-6">
                                {/* Report Header */}
                                <div className="p-6 hero-gradient rounded-xl text-white">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                                            <Globe2 className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">{reportData.report_title}</h3>
                                            <p className="text-blue-200">{reportData.aoi.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-blue-200">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(reportData.generated_at).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {new Date(reportData.generated_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>

                                {/* AOI Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Zone Configuration</h4>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Change Type</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white capitalize">{reportData.aoi.change_type}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Frequency</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white capitalize">{reportData.aoi.monitoring_frequency}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Status</dt>
                                                <dd className="badge badge-success">{reportData.aoi.status}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">NDVI Analysis</h4>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Current</dt>
                                                <dd className="font-medium text-geowatch-accent">{reportData.ndvi_analysis.current}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Average</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white">{reportData.ndvi_analysis.avg}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Trend</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white capitalize">{reportData.ndvi_analysis.trend}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Alerts</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white">{reportData.total_alerts}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-center py-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{reportData.footer}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="h-10 w-10 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No report generated</h3>
                                <p className="text-slate-500 dark:text-slate-400">Select a zone and click "Generate Report" to preview</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
