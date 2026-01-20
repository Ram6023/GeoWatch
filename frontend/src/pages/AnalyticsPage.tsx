import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Minus,
    MapPin,
    RefreshCw,
    Info,
    Leaf
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    Legend
} from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AOI {
    _id: string;
    name: string;
    changeType: string;
    status: string;
}

interface NDVIData {
    aoi_id: string;
    aoi_name: string;
    data: Array<{
        date: string;
        ndvi: number;
        quality: string;
    }>;
    trend: string;
    trend_description: string;
    statistics: {
        min: number | null;
        max: number | null;
        avg: number | null;
        current: number | null;
    };
}

export default function AnalyticsPage() {
    const [aois, setAois] = useState<AOI[]>([]);
    const [selectedAoi, setSelectedAoi] = useState<string | null>(null);
    const [ndviData, setNdviData] = useState<NDVIData | null>(null);
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        fetchAOIs();
    }, []);

    useEffect(() => {
        if (selectedAoi) {
            fetchNDVIData(selectedAoi);
        }
    }, [selectedAoi]);

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

    const fetchNDVIData = async (aoiId: string) => {
        setChartLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/geowatch/analysis/${aoiId}/ndvi`);
            setNdviData(response.data);
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
                return <TrendingUp className="h-5 w-5 text-geowatch-accent" />;
            case 'decreasing':
                return <TrendingDown className="h-5 w-5 text-red-500" />;
            default:
                return <Minus className="h-5 w-5 text-amber-500" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'increasing':
                return 'text-geowatch-accent';
            case 'decreasing':
                return 'text-red-500';
            default:
                return 'text-amber-500';
        }
    };

    const getNDVIColor = (value: number | null) => {
        if (value === null) return 'text-slate-500';
        if (value >= 0.6) return 'text-geowatch-accent';
        if (value >= 0.3) return 'text-amber-500';
        return 'text-red-500';
    };

    const formatNDVI = (value: number | null) => {
        if (value === null) return 'N/A';
        return value.toFixed(4);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-geowatch-accent" />
                        GeoWatch Analytics
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">NDVI time-series analysis and vegetation health monitoring</p>
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
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-geowatch-deep" />
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
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Leaf className="h-10 w-10 text-slate-400" />
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
                            <div className="card">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center">
                                        <Leaf className="h-6 w-6 text-geowatch-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Current NDVI</p>
                                        <p className={`text-2xl font-bold ${getNDVIColor(ndviData.statistics.current)}`}>
                                            {formatNDVI(ndviData.statistics.current)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                        {getTrendIcon(ndviData.trend)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Trend</p>
                                        <p className={`text-xl font-bold capitalize ${getTrendColor(ndviData.trend)}`}>
                                            {ndviData.trend.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Max NDVI</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {formatNDVI(ndviData.statistics.max)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Average NDVI</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {formatNDVI(ndviData.statistics.avg)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NDVI Chart */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">NDVI Time-Series</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Vegetation health index over time for {ndviData?.aoi_name || 'selected zone'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Info className="h-4 w-4" />
                                <span>NDVI ranges from -1 to 1. Higher values indicate healthier vegetation.</span>
                            </div>
                        </div>

                        {chartLoading ? (
                            <div className="h-[400px] flex items-center justify-center">
                                <div className="spinner border-geowatch-accent"></div>
                            </div>
                        ) : ndviData ? (
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ndviData.data}>
                                        <defs>
                                            <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={{ stroke: '#e2e8f0' }}
                                        />
                                        <YAxis
                                            domain={[-0.2, 1]}
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            tickLine={{ stroke: '#e2e8f0' }}
                                            label={{ value: 'NDVI', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: 'none',
                                                borderRadius: '0.75rem',
                                                color: '#f1f5f9'
                                            }}
                                            formatter={(value: number) => [value.toFixed(4), 'NDVI']}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="ndvi"
                                            stroke="#22c55e"
                                            strokeWidth={3}
                                            fill="url(#ndviGradient)"
                                            name="NDVI Value"
                                            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, fill: '#16a34a' }}
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
                        <div className="card hero-gradient text-white">
                            <div className="flex items-center gap-4">
                                {getTrendIcon(ndviData.trend)}
                                <div>
                                    <h3 className="text-lg font-semibold">Trend Analysis</h3>
                                    <p className="text-blue-200">{ndviData.trend_description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
