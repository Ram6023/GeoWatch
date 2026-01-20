import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Globe2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-geowatch-accent/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>

        {/* Orbiting Elements */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-geowatch-accent rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-white/60 rounded-full animate-bounce-slow"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Globe2 className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-4">
            GeoWatch
          </h1>
          <p className="text-xl text-blue-200 mb-8 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Monitor Earth. Detect Change. Act Smart.
          </p>

          <div className="max-w-md text-center">
            <p className="text-blue-100/80 leading-relaxed">
              GeoWatch is a powerful satellite imagery change detection platform that helps you monitor
              environmental and land-use changes using AI and Google Earth Engine.
            </p>
          </div>

          {/* Features Pills */}
          <div className="mt-12 flex flex-wrap gap-3 justify-center">
            {['NDVI Analysis', 'Change Detection', 'PDF Reports', 'Real-time Alerts'].map((feature) => (
              <span key={feature} className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm font-medium border border-white/20">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-geowatch-deep to-geowatch-ocean rounded-2xl shadow-geowatch-lg mb-4">
              <Globe2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">GeoWatch</h2>
            <p className="text-slate-500 text-sm mt-1">Monitor Earth. Detect Change. Act Smart.</p>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Sign in to your GeoWatch account
            </p>
          </div>

          <div className="card-glass">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-geowatch pl-12"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-geowatch pl-12 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      Start Monitoring
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold text-geowatch-deep dark:text-geowatch-accent hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            © 2026 GeoWatch — Built by Ram
          </div>
        </div>
      </div>
    </div>
  );
}