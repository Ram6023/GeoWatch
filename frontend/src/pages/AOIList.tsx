import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Settings, Trash2, Eye, Search, BarChart3, Download, Filter } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AOIAlertsModal from '../components/AOIAlertsModal';

interface AOI {
  _id: string;
  name: string;
  changeType: string;
  monitoringFrequency: string;
  status: string;
  createdAt: string;
  lastMonitored?: string;
  confidenceThreshold: number;
  description?: string;
}

export default function AOIList() {
  const [aois, setAois] = useState<AOI[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAoiId, setSelectedAoiId] = useState<string | null>(null);

  useEffect(() => {
    fetchAOIs();
  }, []);

  const fetchAOIs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/geowatch/aois/');
      setAois(response.data);
    } catch (error) {
      console.error('Error fetching zones:', error);
      toast.error('Failed to fetch monitoring zones');
    } finally {
      setLoading(false);
    }
  };

  const deleteAOI = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this monitoring zone?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/geowatch/aois/${id}`);
      setAois(aois.filter(aoi => aoi._id !== id));
      toast.success('Zone deleted successfully');
    } catch (error) {
      toast.error('Failed to delete zone');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge badge-success';
      case 'pending':
        return 'badge badge-warning';
      case 'inactive':
        return 'badge badge-inactive';
      default:
        return 'badge badge-inactive';
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAOIs = aois.filter(aoi => {
    const matchesSearch = aoi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aoi.changeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || aoi.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Monitoring Zones</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your Areas of Interest for GeoWatch</p>
        </div>
        <Link
          to="/create-aoi"
          className="btn btn-primary flex items-center gap-2 w-fit"
        >
          <Plus className="h-5 w-5" />
          Define New Zone
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search zones by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-geowatch pl-12"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-geowatch w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Showing {filteredAOIs.length} of {aois.length} zones
      </div>

      {/* AOI Grid */}
      {filteredAOIs.length > 0 ? (
        <div className="grid gap-4">
          {filteredAOIs.map((aoi, index) => (
            <div
              key={aoi._id}
              className="card group hover:border-geowatch-deep dark:hover:border-geowatch-accent animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {getChangeTypeIcon(aoi.changeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate group-hover:text-geowatch-deep dark:group-hover:text-geowatch-accent transition-colors">
                        {aoi.name}
                      </h3>
                      <span className={getStatusBadge(aoi.status)}>{aoi.status}</span>
                    </div>
                    {aoi.description && (
                      <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{aoi.description}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4 mr-2 text-geowatch-accent" />
                        <span className="capitalize">{aoi.changeType.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                      <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <Calendar className="h-4 w-4 mr-2 text-geowatch-deep" />
                        <span className="capitalize">{aoi.monitoringFrequency}</span>
                      </div>
                      <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <Settings className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{aoi.confidenceThreshold}% threshold</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                      <span>Created: {formatDate(aoi.createdAt)}</span>
                      <span>•</span>
                      <span>Last monitored: {aoi.lastMonitored ? formatDate(aoi.lastMonitored) : 'Pending'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    className="btn btn-secondary p-2.5"
                    onClick={() => setSelectedAoiId(aoi._id)}
                    title="View GeoWatch Analysis"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    className="btn btn-secondary p-2.5"
                    title="View NDVI Chart"
                  >
                    <BarChart3 className="h-5 w-5" />
                  </button>
                  <button
                    className="btn btn-secondary p-2.5"
                    title="Download Report"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    className="btn btn-secondary p-2.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    onClick={() => deleteAOI(aoi._id)}
                    title="Delete Zone"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No zones match your filters' : 'No monitoring zones yet'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by defining your first Area of Interest'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Link to="/create-aoi" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Define First Zone
            </Link>
          )}
        </div>
      )}

      {selectedAoiId && (
        <AOIAlertsModal aoiId={selectedAoiId} onClose={() => setSelectedAoiId(null)} />
      )}
    </div>
  );
}