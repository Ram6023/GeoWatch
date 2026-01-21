import React, { useEffect, useState } from 'react';
import { X, Calendar, Maximize2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AnalysisService, ChangeAlert } from '../services/mockData';

export default function AOIAlertsModal({ aoiId, onClose }: { aoiId: string, onClose: () => void }) {
    const [alerts, setAlerts] = useState<ChangeAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlerts() {
            setLoading(true);
            try {
                const alertsData = await AnalysisService.getChangeAlerts(aoiId);
                setAlerts(alertsData);
            } catch (err) {
                setAlerts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAlerts();
    }, [aoiId]);

    const getSeverityBadge = (severity?: string) => {
        switch (severity) {
            case 'high':
            case 'critical':
                return 'badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'moderate':
                return 'badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            default:
                return 'badge bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="hero-gradient p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6" />
                            <div>
                                <h2 className="text-xl font-bold">GeoWatch Change Alerts</h2>
                                <p className="text-blue-200 text-sm">Detected changes for this monitoring zone</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-geowatch-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 dark:text-slate-400">Loading change detection data...</p>
                        </div>
                    ) : alerts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="h-10 w-10 text-geowatch-accent" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Changes Detected</h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                GeoWatch hasn't detected any significant changes in this zone yet.
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-6">
                            {alerts.map((alert, index) => (
                                <li
                                    key={alert._id}
                                    className="card bg-slate-50 dark:bg-slate-700/50 animate-slide-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Alert Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-geowatch-deep dark:text-geowatch-accent" />
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {new Date(alert.detection_date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <span className={getSeverityBadge(alert.severity)}>
                                            {alert.severity || 'detected'}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                                        {alert.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Change Type</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                                                {alert.change_type}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Change Percentage</p>
                                            <p className="text-lg font-bold text-geowatch-accent">
                                                {alert.change_percent.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Before/After Images */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                                                <span>Before</span>
                                                <Maximize2 className="h-3 w-3" />
                                            </div>
                                            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-xl overflow-hidden">
                                                <img
                                                    src={alert.before_image_url}
                                                    alt="Before"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                                                <span>After</span>
                                                <Maximize2 className="h-3 w-3" />
                                            </div>
                                            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-xl overflow-hidden">
                                                <img
                                                    src={alert.after_image_url}
                                                    alt="After"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400&h=300&fit=crop';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Powered by GeoWatch — Built by Ram
                        </p>
                        <button onClick={onClose} className="btn btn-secondary">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}