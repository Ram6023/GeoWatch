import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Bell, Shield, Globe2, Satellite, Zap, Database, Lock, Mail } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)'
          }}
        >
          <Satellite className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure your GeoWatch mission parameters</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)' }}
          >
            <Sun className="h-5 w-5 text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700/50"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                  : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
              }}
            >
              {theme === 'dark' ? (
                <Moon className="h-6 w-6 text-cyan-400" />
              ) : (
                <Sun className="h-6 w-6 text-amber-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {theme === 'dark' ? 'Space Mode' : 'Light Mode'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {theme === 'dark' ? 'Immersive dark theme for night missions' : 'Bright theme for daylight operations'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-16 h-9 rounded-full transition-all duration-500 p-1"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #fde68a 0%, #fbbf24 100%)',
              boxShadow: theme === 'dark'
                ? '0 0 15px rgba(6, 182, 212, 0.3), inset 0 2px 4px rgba(0,0,0,0.3)'
                : '0 0 15px rgba(251, 191, 36, 0.3), inset 0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {/* Stars for dark mode */}
            {theme === 'dark' && (
              <>
                <div className="absolute top-2 left-3 w-1 h-1 bg-white/60 rounded-full" />
                <div className="absolute top-4 left-5 w-0.5 h-0.5 bg-white/40 rounded-full" />
                <div className="absolute top-2.5 left-7 w-0.5 h-0.5 bg-white/50 rounded-full" />
              </>
            )}

            <div
              className="w-7 h-7 rounded-full shadow-lg transition-all duration-500 flex items-center justify-center"
              style={{
                transform: theme === 'dark' ? 'translateX(28px)' : 'translateX(0)',
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)'
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: theme === 'dark'
                  ? '0 0 15px rgba(6, 182, 212, 0.5)'
                  : '0 0 15px rgba(251, 191, 36, 0.5)'
              }}
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-slate-900" />
              ) : (
                <Sun className="h-4 w-4 text-white" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)' }}
          >
            <Bell className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Alert Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email Alerts', desc: 'Receive change detection via email', defaultChecked: true },
            { icon: Zap, title: 'Browser Notifications', desc: 'Get instant push notifications', defaultChecked: true },
            { icon: Database, title: 'Weekly Summary', desc: 'Automated weekly mission reports', defaultChecked: false },
          ].map((item, index) => (
            <div
              key={item.title}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 transition-colors hover:border-cyan-500/30 dark:hover:border-cyan-500/30"
              style={{
                background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.5) 0%, rgba(226, 232, 240, 0.3) 100%)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 peer-checked:shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all">
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)' }}
          >
            <Shield className="h-5 w-5 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Add extra security to your account</p>
              </div>
            </div>
            <button className="btn btn-secondary text-sm">Configure</button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)' }}
          >
            <Globe2 className="h-5 w-5 text-cyan-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">About GeoWatch</h2>
        </div>

        <div className="relative p-6 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 40%, #064e3b 100%)'
          }}
        >
          {/* Background stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
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
          </div>

          <div className="relative z-10 flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Globe2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white font-display">GeoWatch</h3>
              <p className="text-cyan-200 mb-3">Monitor Earth. Detect Change. Act Smart.</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">
                  v2.0.0
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Built by Ram
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  MIT License
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        © 2026 GeoWatch — Earth Monitoring Platform by Ram
      </div>
    </div>
  );
}