import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, AlertTriangle, TrendingUp, Globe2, Activity, Layers, ArrowUpRight, Satellite, Orbit, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AOIService, AnalysisService, AOI } from '../services/mockData';

// Animated Earth mini component
const MiniEarth = () => (
  <div className="relative w-16 h-16">
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: 'radial-gradient(circle at 30% 30%, #4fc3f7 0%, #1e88e5 30%, #1565c0 60%, #0d47a1 100%)',
        boxShadow: '0 0 30px rgba(30, 136, 229, 0.4), inset -5px -5px 15px rgba(0,0,0,0.3)',
      }}
    />
    {/* Atmosphere glow */}
    <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md scale-110" />
    {/* Orbit ring */}
    <div className="absolute -inset-2 border border-cyan-500/30 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
    <div className="absolute -inset-2">
      <div className="absolute top-0 left-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [aois, setAois] = useState<AOI[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAOIs: 0,
    activeMonitoring: 0,
    recentAlerts: 0,
    coverageArea: '0 km²'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [aoiData, statsData] = await Promise.all([
        AOIService.getAll(),
        AnalysisService.getSummaryStats()
      ]);

      setAois(aoiData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge badge-success';
      case 'pending':
        return 'badge badge-warning';
      default:
        return 'badge badge-inactive';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'deforestation':
        return '🌳';
      case 'construction':
        return '🏗️';
      case 'waterbody':
        return '💧';
      case 'agricultural':
        return '🌾';
      default:
        return '📍';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
              <Satellite className="absolute inset-0 m-auto h-8 w-8 text-cyan-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 animate-pulse">Loading satellite data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 40%, #0c4a6e 70%, #064e3b 100%)'
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/40 animate-twinkle"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
              }}
            />
          ))}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <MiniEarth />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white font-display">
                Welcome back, <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">{user?.name || user?.email?.split('@')[0]}</span>!
              </h1>
              <p className="text-cyan-200 text-lg mt-1 flex items-center gap-2">
                <Orbit className="h-4 w-4 animate-spin-slow" style={{ animationDuration: '5s' }} />
                GeoWatch Mission Control • Real-time Earth Monitoring
              </p>
            </div>
          </div>
          <Link
            to="/create-aoi"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 transition-all duration-300 hover:scale-105 group"
            style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #22c55e 50%, #4ade80 100%)',
              boxShadow: '0 4px 20px rgba(0, 255, 136, 0.4)'
            }}
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            New Mission Zone
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Zones', value: stats.totalAOIs, icon: MapPin, gradient: 'from-cyan-500 to-blue-600', glow: 'rgba(6, 182, 212, 0.3)' },
          { label: 'Active Monitoring', value: stats.activeMonitoring, icon: Activity, gradient: 'from-emerald-500 to-teal-600', glow: 'rgba(16, 185, 129, 0.3)' },
          { label: 'Recent Alerts', value: stats.recentAlerts, icon: AlertTriangle, gradient: 'from-amber-500 to-orange-600', glow: 'rgba(245, 158, 11, 0.3)' },
          { label: 'Coverage Area', value: stats.coverageArea, icon: Layers, gradient: 'from-violet-500 to-purple-600', glow: 'rgba(139, 92, 246, 0.3)' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="card group hover:scale-[1.02] transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${stat.gradient.replace('from-', '').replace(' to-', ', ')})`,
                  boxShadow: `0 4px 20px ${stat.glow}`
                }}
              >
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent AOIs */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
              }}
            >
              <Satellite className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Monitoring Zones</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your satellite-tracked Areas of Interest</p>
            </div>
          </div>
          <Link
            to="/aois"
            className="btn btn-secondary flex items-center gap-2 text-sm"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {aois.length > 0 ? (
          <div className="space-y-4">
            {aois.slice(0, 5).map((aoi, index) => (
              <div
                key={aoi._id}
                className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 group animate-slide-up border border-transparent hover:border-cyan-500/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.02) 0%, rgba(6, 182, 212, 0.02) 100%)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 border border-slate-200/50 dark:border-slate-700/50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.9) 100%)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}
                  >
                    {getChangeTypeIcon(aoi.changeType)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {aoi.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="capitalize flex items-center gap-1">
                        <Zap className="h-3 w-3 text-emerald-500" />
                        {aoi.changeType.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{aoi.monitoringFrequency}</span>
                      <span>•</span>
                      <span>{formatDate(aoi.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <span className={getStatusBadge(aoi.status)}>{aoi.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 animate-spin-slow" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No monitoring zones yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Start your first Earth observation mission</p>
            <Link to="/create-aoi" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Define First Zone
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { to: '/create-aoi', icon: Plus, title: 'New Mission Zone', desc: 'Define a new monitoring area', gradient: 'from-cyan-500 to-blue-600' },
          { to: '/analytics', icon: TrendingUp, title: 'NDVI Analytics', desc: 'Vegetation health trends', gradient: 'from-emerald-500 to-teal-600' },
          { to: '/reports', icon: Calendar, title: 'Generate Reports', desc: 'Export PDF analysis', gradient: 'from-violet-500 to-purple-600' },
        ].map((action, index) => (
          <Link
            key={action.to}
            to={action.to}
            className="card group cursor-pointer hover:scale-[1.02] transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${(index + 5) * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background: `linear-gradient(135deg, ${action.gradient.replace('from-', '').replace(' to-', ', ')})`,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}
              >
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{action.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{action.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}