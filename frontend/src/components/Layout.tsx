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
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Map },
    { name: 'My Zones', href: '/aois', icon: MapPin },
    { name: 'Define AOI', href: '/create-aoi', icon: Plus },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
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
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Logo Header */}
        <div className="flex items-center justify-between h-20 px-6 hero-gradient">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Globe2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">GeoWatch</span>
              <p className="text-xs text-blue-200">Monitor • Detect • Act</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive(item.href)
                    ? 'bg-gradient-to-r from-geowatch-deep to-geowatch-ocean text-white shadow-geowatch'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <Icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive(item.href) ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-geowatch-accent'
                  }`} />
                {item.name}
                {isActive(item.href) && (
                  <div className="ml-auto w-2 h-2 bg-geowatch-accent rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-geowatch-deep to-geowatch-accent rounded-full flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || user?.email[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 lg:flex lg:justify-center">
              <h1 className="text-xl font-bold text-gradient hidden lg:block">
                GeoWatch Earth Monitoring Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 
                         hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 px-6">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>© 2026 GeoWatch — Built by <span className="font-semibold text-geowatch-deep dark:text-geowatch-accent">Ram</span></span>
            <span className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-geowatch-accent" />
              Monitor Earth. Detect Change. Act Smart.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}