import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Map,
  MapPin,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  Globe2,
  BarChart3,
  FileText,
  Satellite,
  Orbit
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

// Animated sidebar background
const SidebarBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Stars */}
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white/30 animate-twinkle"
        style={{
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animationDelay: Math.random() * 3 + 's',
        }}
      />
    ))}
    {/* Gradient orbs */}
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
  </div>
);

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Map, color: 'from-cyan-500 to-blue-500' },
    { name: 'My Zones', href: '/aois', icon: MapPin, color: 'from-emerald-500 to-cyan-500' },
    { name: 'Define AOI', href: '/create-aoi', icon: Plus, color: 'from-violet-500 to-purple-500' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-amber-500 to-orange-500' },
    { name: 'Reports', href: '/reports', icon: FileText, color: 'from-pink-500 to-rose-500' },
    { name: 'Settings', href: '/settings', icon: Settings, color: 'from-slate-500 to-slate-600' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-space-900 transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0c1445 0%, #030712 100%)',
        }}
      >
        <SidebarBackground />

        {/* Logo Header */}
        <div className="relative flex items-center justify-between h-20 px-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Globe2 className="h-7 w-7 text-white" />
              {/* Orbit ring */}
              <div className="absolute inset-0 rounded-xl border border-white/30 animate-pulse-slow" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight font-display">GeoWatch</span>
              <p className="text-xs text-cyan-400">Earth Monitoring</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative mt-6 px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden ${active
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {/* Active background */}
                {active && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-90"
                    style={{
                      background: `linear-gradient(135deg, ${item.color.replace('from-', '').replace(' to-', ', ').replace('-500', '')})`,
                    }}
                  />
                )}

                {/* Active glow */}
                {active && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-50 blur-lg"
                    style={{ background: `linear-gradient(135deg, ${item.color.replace('from-', '').replace(' to-', ', ').replace('-500', '')})` }}
                  />
                )}

                <div className={`relative flex items-center z-10 ${active ? 'text-white' : ''}`}>
                  <div className={`mr-3 p-1.5 rounded-lg transition-all duration-300 ${active
                      ? 'bg-white/20'
                      : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {item.name}
                </div>

                {/* Active indicator */}
                {active && (
                  <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse shadow-lg shadow-white/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Decorative satellite */}
        <div className="absolute bottom-32 right-4 opacity-10">
          <Satellite className="w-20 h-20 text-cyan-300" />
        </div>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl"
            style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
              }}
            >
              <span className="text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || user?.email[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-cyan-400/80 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-slate-400 rounded-xl hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition-all duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-space-800 border-b border-slate-200 dark:border-slate-800/50 backdrop-blur-xl">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 lg:flex lg:justify-center">
              <h1 className="hidden lg:flex items-center gap-3 text-lg font-semibold">
                <span className="text-slate-500 dark:text-slate-400">GeoWatch</span>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="font-display bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Mission Control
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Status indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Systems Online</span>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 
                         hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200 border border-slate-200 dark:border-white/10"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-slate-100 dark:bg-space-900 transition-colors duration-300">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-space-800 border-t border-slate-200 dark:border-slate-800/50 py-3 px-6">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500">
            <span className="flex items-center gap-2">
              © 2026 GeoWatch — Built by <span className="font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">Ram</span>
            </span>
            <span className="hidden sm:flex items-center gap-2 text-slate-400 dark:text-slate-600">
              <Orbit className="h-4 w-4 text-cyan-500 animate-spin-slow" style={{ animationDuration: '10s' }} />
              Monitoring Earth in Real-time
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}