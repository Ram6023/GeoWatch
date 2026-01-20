import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    Download,
    MapPin,
    Calendar,
    CheckCircle2,
    Clock,
    Globe2,
    BarChart3,
    Image
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AOI {
    _id: string;
    name: string;
    changeType: string;
    status: string;
    createdAt: string;
}

interface ReportData {
    message: string;
    format: string;
    report: {
        report_title: string;
        generated_at: string;
        author: string;
        aoi: {
            name: string;
            change_type: string;
            monitoring_frequency: string;
            confidence_threshold: number;
            status: string;
        };
        ndvi_analysis: {
            trend: string;
            trend_description: string;
            statistics: {
                min: number;
                max: number;
                avg: number;
                current: number;
            };
        };
        changes_detected: number;
        footer: string;
    };
}

export default function ReportsPage() {
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
            const response = await axios.get('http://localhost:8000/api/geowatch/aois/');
            setAois(response.data);
            if (response.data.length > 0) {
                setSelectedAoi(response.data[0]._id);
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
            const response = await axios.get(`http://localhost:8000/api/geowatch/analysis/${selectedAoi}/report`);
            setReportData(response.data);
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

        const dataStr = JSON.stringify(reportData.report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `geowatch-report-${reportData.report.aoi.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Report downloaded!');
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
                                        Before/After imagery
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
                                <button
                                    onClick={downloadReportJSON}
                                    className="btn btn-accent flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Report
                                </button>
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
                                            <h3 className="text-2xl font-bold">{reportData.report.report_title}</h3>
                                            <p className="text-blue-200">{reportData.report.aoi.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-blue-200">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(reportData.report.generated_at).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {new Date(reportData.report.generated_at).toLocaleTimeString()}
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
                                                <dd className="font-medium text-slate-900 dark:text-white capitalize">{reportData.report.aoi.change_type}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Frequency</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white capitalize">{reportData.report.aoi.monitoring_frequency}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Threshold</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white">{reportData.report.aoi.confidence_threshold}%</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Status</dt>
                                                <dd className="badge badge-success">{reportData.report.aoi.status}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">NDVI Analysis</h4>
                                        <dl className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Current</dt>
                                                <dd className="font-medium text-geowatch-accent">{reportData.report.ndvi_analysis.statistics.current?.toFixed(4) || 'N/A'}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Average</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white">{reportData.report.ndvi_analysis.statistics.avg?.toFixed(4) || 'N/A'}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Trend</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white capitalize">{reportData.report.ndvi_analysis.trend}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-slate-600 dark:text-slate-400">Changes Detected</dt>
                                                <dd className="font-medium text-slate-900 dark:text-white">{reportData.report.changes_detected}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-center py-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{reportData.report.footer}</p>
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
