import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Bell, Shield, User, Globe2 } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your GeoWatch preferences</p>
      </div>

      {/* Appearance */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sun className="h-5 w-5 text-geowatch-accent" />
          Appearance
        </h2>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-geowatch-accent' : 'bg-slate-300'
              }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
              }`}>
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-geowatch-deep" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-geowatch-accent" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Email Alerts</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive change detection alerts via email</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-geowatch-accent focus:ring-geowatch-accent w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Browser Notifications</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Get push notifications in your browser</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-geowatch-accent focus:ring-geowatch-accent w-5 h-5" />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-geowatch-accent" />
          About GeoWatch
        </h2>
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-geowatch-deep to-geowatch-ocean rounded-2xl flex items-center justify-center">
              <Globe2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">GeoWatch</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monitor Earth. Detect Change. Act Smart.</p>
            </div>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Version</dt>
              <dd className="font-medium text-slate-900 dark:text-white">2.0.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Author</dt>
              <dd className="font-medium text-slate-900 dark:text-white">Ram (Sriram Vissakoti)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">License</dt>
              <dd className="font-medium text-slate-900 dark:text-white">MIT</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        © 2026 GeoWatch — Built by Ram
      </div>
    </div>
  );
}