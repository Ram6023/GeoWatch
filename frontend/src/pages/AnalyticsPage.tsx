import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Minus,
    MapPin,
    RefreshCw,
    Info,
    Leaf,
    Satellite,
    Activity
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    Legend
} from 'recharts';
import toast from 'react-hot-toast';
import { AOIService, AnalysisService, AOI } from '../services/mockData';

interface NDVIData {
    data: Array<{
        date: string;
        ndvi: number;
        quality: string;
    }>;
    trend: string;
    statistics: {
        min: string;
        max: string;
        avg: string;
        current: string;
        trend: string;
        trendDescription: string;
    };
}

export default function AnalyticsPage() {
    const [searchParams] = useSearchParams();
    const [aois, setAois] = useState<AOI[]>([]);
    const [selectedAoi, setSelectedAoi] = useState<string | null>(null);
    const [ndviData, setNdviData] = useState<NDVIData | null>(null);
    const [selectedAoiName, setSelectedAoiName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        fetchAOIs();
    }, []);

    useEffect(() => {
        if (selectedAoi) {
            fetchNDVIData(selectedAoi);
            const aoi = aois.find(a => a._id === selectedAoi);
            if (aoi) {
                setSelectedAoiName(aoi.name);
            }
        }
    }, [selectedAoi, aois]);

    const fetchAOIs = async () => {
        try {
            const data = await AOIService.getAll();
            setAois(data);

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

    const fetchNDVIData = async (aoiId: string) => {
        setChartLoading(true);
        try {
            const response = await AnalysisService.getNDVITimeSeries(aoiId);
            setNdviData(response);
        } catch (error) {
            console.error('Error fetching NDVI data:', error);
            toast.error('Failed to fetch NDVI data');
        } finally {
            setChartLoading(false);
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'increasing':
                return <TrendingUp className="h-5 w-5 text-emerald-400" />;
            case 'decreasing':
                return <TrendingDown className="h-5 w-5 text-red-400" />;
            default:
                return <Minus className="h-5 w-5 text-amber-400" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'increasing':
                return 'text-emerald-400';
            case 'decreasing':
                return 'text-red-400';
            default:
                return 'text-amber-400';
        }
    };

    const getNDVIColor = (value: string | null) => {
        if (value === null) return 'text-slate-400';
        const num = parseFloat(value);
        if (num >= 0.6) return 'text-emerald-400';
        if (num >= 0.3) return 'text-amber-400';
        return 'text-red-400';
    };

    const formatNDVI = (value: string | null) => {
        if (value === null) return 'N/A';
        return value;
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />
                        <Activity className="absolute inset-0 m-auto h-8 w-8 text-cyan-400" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading analytics data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)',
                            boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)'
                        }}
                    >
                        <BarChart3 className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                            NDVI Analytics
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Vegetation health monitoring & trend analysis</p>
                    </div>
                </div>
                {selectedAoi && (
                    <button
                        onClick={() => fetchNDVIData(selectedAoi)}
                        className="btn btn-secondary flex items-center gap-2 w-fit"
                        disabled={chartLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${chartLoading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </button>
                )}
            </div>

            {/* Zone Selector */}
            <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)' }}
                        >
                            <MapPin className="h-5 w-5 text-cyan-500" />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Select Zone:</span>
                    </div>
                    <select
                        value={selectedAoi || ''}
                        onChange={(e) => setSelectedAoi(e.target.value)}
                        className="input-geowatch w-full sm:w-auto sm:min-w-[300px]"
                    >
                        {aois.map(aoi => (
                            <option key={aoi._id} value={aoi._id}>
                                {aoi.name} ({aoi.changeType})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {aois.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 animate-spin-slow" style={{ animationDuration: '20s' }} />
                        <div className="absolute inset-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Leaf className="h-8 w-8 text-slate-400" />
                        </div>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No monitoring zones</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Create a zone to start viewing NDVI analytics</p>
                    <Link to="/create-aoi" className="btn btn-primary">
                        Define First Zone
                    </Link>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    {ndviData && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Current NDVI', value: ndviData.statistics.current, icon: Leaf, gradient: 'from-emerald-500 to-teal-600', colorFn: getNDVIColor },
                                { label: 'Trend', value: ndviData.trend, icon: () => getTrendIcon(ndviData.trend), gradient: 'from-cyan-500 to-blue-600', colorFn: getTrendColor },
                                { label: 'Max NDVI', value: ndviData.statistics.max, icon: TrendingUp, gradient: 'from-amber-500 to-orange-600', colorFn: () => 'text-slate-900 dark:text-white' },
                                { label: 'Average NDVI', value: ndviData.statistics.avg, icon: BarChart3, gradient: 'from-violet-500 to-purple-600', colorFn: () => 'text-slate-900 dark:text-white' },
                            ].map((stat, index) => (
                                <div key={stat.label} className="card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{
                                                background: `linear-gradient(135deg, ${stat.gradient.replace('from-', '').replace(' to-', ', ')})`,
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                                            }}
                                        >
                                            {typeof stat.icon === 'function' ? stat.icon({}) : <stat.icon className="h-6 w-6 text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                                            <p className={`text-2xl font-bold capitalize ${stat.colorFn(stat.value)}`}>
                                                {stat.label === 'Trend' ? stat.value.replace('_', ' ') : formatNDVI(stat.value)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* NDVI Chart */}
                    <div className="card">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)' }}
                                >
                                    <Activity className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">NDVI Time-Series</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        12-month vegetation health for {selectedAoiName || 'selected zone'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                <Info className="h-4 w-4" />
                                <span>NDVI -1 to 1 • Higher = Healthier</span>
                            </div>
                        </div>

                        {chartLoading ? (
                            <div className="h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="relative w-16 h-16 mx-auto mb-4">
                                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400">Processing satellite data...</p>
                                </div>
                            </div>
                        ) : ndviData ? (
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ndviData.data}>
                                        <defs>
                                            <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.4} />
                                                <stop offset="50%" stopColor="#22c55e" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                                            axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                                        />
                                        <YAxis
                                            domain={[-0.2, 1]}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                                            axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                                            label={{ value: 'NDVI', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                                borderRadius: '0.75rem',
                                                color: '#f1f5f9',
                                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                                            }}
                                            formatter={(value: number) => [value.toFixed(4), 'NDVI']}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="ndvi"
                                            stroke="#00ff88"
                                            strokeWidth={3}
                                            fill="url(#ndviGradient)"
                                            name="NDVI Value"
                                            dot={{ fill: '#00ff88', strokeWidth: 2, r: 4, stroke: '#0f172a' }}
                                            activeDot={{ r: 6, fill: '#00ff88', stroke: '#0f172a', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[400px] flex items-center justify-center text-slate-500">
                                Select a zone to view NDVI data
                            </div>
                        )}
                    </div>

                    {/* Trend Analysis */}
                    {ndviData && (
                        <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 40%, #064e3b 100%)'
                            }}
                        >
                            {/* Background decoration */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
                            </div>

                            <div className="relative z-10 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(255,255,255,0.1)' }}
                                >
                                    {getTrendIcon(ndviData.trend)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 font-display">Trend Analysis</h3>
                                    <p className="text-cyan-200 leading-relaxed">{ndviData.statistics.trendDescription}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
