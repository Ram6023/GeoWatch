import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Globe2, Mail, Lock, ArrowRight, Sparkles, Satellite } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Animated stars background component
const StarsBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's',
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}
    </div>
  );
};

// Orbiting satellite component
const OrbitingSatellite = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Orbit rings */}
      <div className="absolute w-[500px] h-[500px] border border-cyan-500/20 rounded-full animate-pulse-slow" />
      <div className="absolute w-[400px] h-[400px] border border-emerald-500/30 rounded-full" style={{ animationDelay: '1s' }} />
      <div className="absolute w-[300px] h-[300px] border border-blue-500/20 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Orbiting satellite */}
      <div className="absolute w-[400px] h-[400px] animate-spin-slow">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse" />
        </div>
      </div>

      {/* Second satellite */}
      <div className="absolute w-[500px] h-[500px] animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }}>
        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
        </div>
      </div>
    </div>
  );
};

// Earth globe component
const EarthGlobe = () => {
  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 to-emerald-400/30 blur-3xl scale-150" />

      {/* Earth */}
      <div className="relative w-48 h-48">
        {/* Atmosphere glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent blur-xl scale-110" />

        {/* Earth sphere */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, 
                #4fc3f7 0%,
                #1e88e5 25%,
                #1565c0 50%,
                #0d47a1 75%,
                #0a3d91 100%
              )
            `,
            boxShadow: `
              inset -20px -20px 40px rgba(0, 0, 0, 0.4),
              inset 10px 10px 30px rgba(79, 195, 247, 0.3),
              0 0 60px rgba(30, 136, 229, 0.4),
              0 0 120px rgba(30, 136, 229, 0.2)
            `,
          }}
        >
          {/* Continents pattern overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: `
                radial-gradient(ellipse 30% 20% at 25% 35%, #22c55e 0%, transparent 70%),
                radial-gradient(ellipse 40% 25% at 70% 45%, #22c55e 0%, transparent 60%),
                radial-gradient(ellipse 25% 15% at 45% 65%, #22c55e 0%, transparent 70%),
                radial-gradient(ellipse 20% 30% at 80% 25%, #22c55e 0%, transparent 60%)
              `,
            }}
          />

          {/* Cloud layer */}
          <div
            className="absolute inset-0 rounded-full opacity-20 animate-spin-slow"
            style={{
              animationDuration: '60s',
              background: `
                radial-gradient(ellipse 20% 10% at 30% 40%, white 0%, transparent 70%),
                radial-gradient(ellipse 15% 8% at 60% 30%, white 0%, transparent 60%),
                radial-gradient(ellipse 25% 12% at 75% 60%, white 0%, transparent 70%)
              `,
            }}
          />
        </div>

        {/* Highlight */}
        <div
          className="absolute top-4 left-8 w-16 h-8 rounded-full bg-white/20 blur-md transform -rotate-45"
        />
      </div>
    </div>
  );
};

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
      {/* Left Side - Space Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #030712 0%, #0c1445 40%, #1e3a8a 70%, #0c4a6e 100%)'
        }}
      >
        {/* Stars Background */}
        <StarsBackground />

        {/* Gradient overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        {/* Orbiting satellites */}
        <OrbitingSatellite />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Earth Globe */}
          <div className="mb-12">
            <EarthGlobe />
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-4 font-display bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
            GeoWatch
          </h1>
          <p className="text-xl text-cyan-200 mb-8 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Monitor Earth. Detect Change. Act Smart.
          </p>

          <div className="max-w-md text-center">
            <p className="text-blue-200/80 leading-relaxed">
              Advanced satellite imagery change detection platform powered by
              AI and real-time Earth observation data.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="mt-12 flex flex-wrap gap-3 justify-center">
            {['🛰️ Real-time Monitoring', '📊 NDVI Analysis', '🔔 Smart Alerts', '📄 PDF Reports'].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 rounded-full text-sm font-medium border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm text-cyan-100 hover:bg-cyan-500/20 transition-all duration-300 hover:scale-105"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Satellite icon */}
          <div className="absolute bottom-8 right-8 opacity-20">
            <Satellite className="w-32 h-32 text-cyan-300" />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{
          background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)'
        }}
      >
        <div className="dark:hidden absolute inset-0 lg:left-1/2 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0c4a6e 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-md w-full space-y-8 relative">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 50%, #0c4a6e 100%)',
                boxShadow: '0 10px 40px rgba(12, 20, 69, 0.3)'
              }}
            >
              <Globe2 className="h-10 w-10 text-cyan-300" />
            </div>
            <h2 className="text-2xl font-bold font-display bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">
              GeoWatch
            </h2>
            <p className="text-slate-500 text-sm mt-1">Monitor Earth. Detect Change. Act Smart.</p>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Sign in to your GeoWatch mission control
            </p>
          </div>

          <div className="card-glass dark:bg-slate-800/90 border-0 shadow-xl shadow-blue-500/10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-geowatch pl-12 focus:border-cyan-500 focus:ring-cyan-500/20"
                    placeholder="commander@geowatch.io"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-geowatch pl-12 pr-12 focus:border-cyan-500 focus:ring-cyan-500/20"
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 50%, #0c4a6e 100%)',
                    boxShadow: '0 4px 20px rgba(30, 58, 138, 0.4)'
                  }}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Launch Mission Control
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  New to GeoWatch?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 hover:underline"
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