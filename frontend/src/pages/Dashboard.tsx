import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, AlertTriangle, TrendingUp, Globe2, Activity, Layers, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface AOI {
  _id: string;
  name: string;
  changeType: string;
  monitoringFrequency: string;
  status: string;
  createdAt: string;
  lastMonitored?: string;
}

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
      const response = await axios.get('http://localhost:8000/api/geowatch/aois/');
      setAois(response.data);

      const totalAOIs = response.data.length;
      const activeMonitoring = response.data.filter((aoi: AOI) => aoi.status === 'active').length;
      const recentAlerts = Math.floor(Math.random() * 5);

      setStats({
        totalAOIs,
        activeMonitoring,
        recentAlerts,
        coverageArea: `${(totalAOIs * 2.5).toFixed(1)} km²`
      });
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
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Hero Welcome Section */}
      <div className="card hero-gradient text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-geowatch-accent/20 rounded-full translate-y-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
              <Globe2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-blue-200 text-lg mt-1">
                Your GeoWatch Earth Monitoring Dashboard
              </p>
            </div>
          </div>
          <Link
            to="/create-aoi"
            className="btn btn-accent flex items-center gap-2 shadow-lg group"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Define New Area of Interest
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card group hover:border-geowatch-deep dark:hover:border-geowatch-accent transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="h-7 w-7 text-geowatch-deep dark:text-geowatch-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Zones</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalAOIs}</p>
            </div>
          </div>
        </div>

        <div className="card group hover:border-geowatch-accent transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/30 dark:to-accent-800/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="h-7 w-7 text-geowatch-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Monitoring</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeMonitoring}</p>
            </div>
          </div>
        </div>

        <div className="card group hover:border-amber-500 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Recent Alerts</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.recentAlerts}</p>
            </div>
          </div>
        </div>

        <div className="card group hover:border-purple-500 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Coverage Area</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.coverageArea}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent AOIs */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Zones</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your recently created Areas of Interest</p>
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
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                    {getChangeTypeIcon(aoi.changeType)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-geowatch-deep dark:group-hover:text-geowatch-accent transition-colors">
                      {aoi.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="capitalize">{aoi.changeType.replace(/([A-Z])/g, ' $1')}</span>
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
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No zones yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Start monitoring by defining your first Area of Interest</p>
            <Link to="/create-aoi" className="btn btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Define First AOI
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/create-aoi" className="card group hover:border-geowatch-deep dark:hover:border-geowatch-accent cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-geowatch-deep to-geowatch-ocean rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Define New Zone</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Create a new monitoring area</p>
            </div>
          </div>
        </Link>

        <Link to="/analytics" className="card group hover:border-geowatch-accent cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-geowatch-accent to-geowatch-forest rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">View Analytics</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">NDVI trends & change reports</p>
            </div>
          </div>
        </Link>

        <Link to="/reports" className="card group hover:border-purple-500 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Download Reports</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Export GeoWatch PDF reports</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}