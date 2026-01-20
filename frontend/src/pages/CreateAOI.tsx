import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { Save, X, Maximize2, Minimize2, Globe2, Info, CheckCircle2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import axios from 'axios';
import toast from 'react-hot-toast';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AOIFormData {
  name: string;
  monitoringFrequency: string;
  changeType: string;
  confidenceThreshold: number;
  emailAlerts: boolean;
  inAppNotifications: boolean;
  description: string;
}

export default function CreateAOI() {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const [drawnShape, setDrawnShape] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AOIFormData>({
    name: '',
    monitoringFrequency: 'weekly',
    changeType: 'deforestation',
    confidenceThreshold: 60,
    emailAlerts: true,
    inAppNotifications: true,
    description: ''
  });
  const [mapFullScreen, setMapFullScreen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const onCreated = (e: any) => {
    const { layer } = e;
    setDrawnShape(layer.toGeoJSON());
  };

  const onEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      setDrawnShape(layer.toGeoJSON());
    });
  };

  const onDeleted = () => {
    setDrawnShape(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!drawnShape) {
      toast.error('Please draw an area on the map');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a zone name');
      return;
    }

    setLoading(true);
    try {
      const aoiData = {
        name: formData.name,
        geojson: drawnShape,
        changeType: formData.changeType,
        monitoringFrequency: formData.monitoringFrequency,
        confidenceThreshold: formData.confidenceThreshold,
        emailAlerts: formData.emailAlerts,
        inAppNotifications: formData.inAppNotifications,
        description: formData.description,
        status: 'active'
      };

      await axios.post('http://localhost:8000/api/geowatch/aois/', aoiData);
      toast.success('GeoWatch zone created successfully! 🛰️');
      navigate('/aois');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create zone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 hero-gradient text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                  <Globe2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Define Area of Interest</h1>
                  <p className="text-blue-200 mt-1">Draw the area you want GeoWatch to monitor</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/aois')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${mapFullScreen ? '' : 'lg:grid-cols-3'} gap-0 relative`}>
            {/* Map Section */}
            <div className={`${mapFullScreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col' : 'lg:col-span-2 border-r border-slate-200 dark:border-slate-700'} transition-all duration-300`}
              style={mapFullScreen ? { height: '100vh' } : {}}>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-geowatch-accent" />
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Draw Your Monitoring Zone</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Use polygon or rectangle tools to define the area
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMapFullScreen(f => !f)}
                    className="btn btn-secondary p-2"
                    title={mapFullScreen ? 'Exit Full Screen' : 'Full Screen Map'}
                  >
                    {mapFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className={`${mapFullScreen ? 'flex-1' : 'h-[500px] lg:h-[600px]'}`}>
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <FeatureGroup>
                    <EditControl
                      position="topright"
                      onCreated={onCreated}
                      onEdited={onEdited}
                      onDeleted={onDeleted}
                      draw={{
                        polyline: true,
                        polygon: true,
                        rectangle: true,
                        circle: false,
                        circlemarker: false,
                        marker: true,
                      }}
                      edit={{
                        remove: true,
                      }}
                    />
                  </FeatureGroup>
                </MapContainer>
              </div>

              {drawnShape && !mapFullScreen && (
                <div className="p-3 bg-accent-50 dark:bg-accent-900/20 border-t border-accent-200 dark:border-accent-800">
                  <div className="flex items-center gap-2 text-sm text-accent-700 dark:text-accent-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Area defined successfully. You can edit or delete it using the map controls.
                  </div>
                </div>
              )}

              {mapFullScreen && (
                <button
                  onClick={() => setMapFullScreen(false)}
                  className="absolute top-4 right-4 z-50 btn btn-primary"
                >
                  Exit Full Screen
                </button>
              )}
            </div>

            {/* Form Section */}
            {!mapFullScreen && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/30">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Zone Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-geowatch"
                      placeholder="e.g., Forest Zone Alpha"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Monitoring Frequency
                    </label>
                    <select
                      name="monitoringFrequency"
                      value={formData.monitoringFrequency}
                      onChange={handleInputChange}
                      className="input-geowatch"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Change Type (Primary Interest)
                    </label>
                    <select
                      name="changeType"
                      value={formData.changeType}
                      onChange={handleInputChange}
                      className="input-geowatch"
                    >
                      <option value="deforestation">🌳 Deforestation / Vegetation Loss</option>
                      <option value="construction">🏗️ Construction / Urbanization</option>
                      <option value="waterbody">💧 Waterbody Changes</option>
                      <option value="agricultural">🌾 Agricultural Changes</option>
                      <option value="other">📍 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Detection Threshold: <span className="text-geowatch-accent font-bold">{formData.confidenceThreshold}%</span>
                    </label>
                    <input
                      type="range"
                      name="confidenceThreshold"
                      min="30"
                      max="90"
                      step="10"
                      value={formData.confidenceThreshold}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-geowatch-accent"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>More Sensitive</span>
                      <span>More Strict</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Alert Preferences
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-geowatch-accent transition-colors">
                        <input
                          type="checkbox"
                          name="emailAlerts"
                          checked={formData.emailAlerts}
                          onChange={handleInputChange}
                          className="rounded border-slate-300 text-geowatch-accent focus:ring-geowatch-accent"
                        />
                        <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">Email Alerts</span>
                      </label>
                      <label className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-geowatch-accent transition-colors">
                        <input
                          type="checkbox"
                          name="inAppNotifications"
                          checked={formData.inAppNotifications}
                          onChange={handleInputChange}
                          className="rounded border-slate-300 text-geowatch-accent focus:ring-geowatch-accent"
                        />
                        <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">In-App Notifications</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="input-geowatch resize-none"
                      placeholder="Additional details about this monitoring zone..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading || !drawnShape}
                      className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          Start GeoWatch Analysis
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/aois')}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}