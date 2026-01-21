import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Globe2, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, Rocket, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Animated nebula background
const NebulaBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Stars */}
    {[...Array(60)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white animate-twinkle"
        style={{
          width: Math.random() * 2.5 + 0.5 + 'px',
          height: Math.random() * 2.5 + 0.5 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animationDelay: Math.random() * 4 + 's',
          opacity: Math.random() * 0.6 + 0.4,
        }}
      />
    ))}

    {/* Nebula clouds */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
  </div>
);

// Satellite illustration component
const SatelliteIllustration = () => (
  <div className="relative">
    {/* Main satellite body */}
    <div className="relative w-32 h-32 mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-2xl scale-150" />

      {/* Satellite core */}
      <div
        className="absolute inset-4 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        <Globe2 className="w-12 h-12 text-cyan-400" />
      </div>

      {/* Solar panels */}
      <div className="absolute top-1/2 -left-8 w-8 h-16 transform -translate-y-1/2"
        style={{
          background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 50%, #1e3a8a 100%)',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
        }}
      />
      <div className="absolute top-1/2 -right-8 w-8 h-16 transform -translate-y-1/2"
        style={{
          background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 50%, #1e3a8a 100%)',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
        }}
      />

      {/* Signal waves */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="w-4 h-4 border-2 border-emerald-400/50 rounded-full animate-ping" />
        <div className="w-4 h-4 border-2 border-emerald-400/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  </div>
);

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name);
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Rocket, text: 'Real-time satellite imagery monitoring' },
    { icon: Zap, text: 'AI-powered change detection' },
    { icon: Shield, text: 'NDVI trend analysis & charts' },
    { icon: CheckCircle2, text: 'Automated PDF report generation' },
    { icon: Sparkles, text: 'Smart email & in-app alerts' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #030712 0%, #0c1445 30%, #312e81 60%, #1e1b4b 100%)'
        }}
      >
        <NebulaBackground />

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Satellite Illustration */}
          <div className="mb-8">
            <SatelliteIllustration />
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-4 font-display text-center">
            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
              Join GeoWatch
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-8 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Start your Earth observation mission
          </p>

          {/* Features List */}
          <div className="max-w-md w-full space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <feature.icon className="h-5 w-5 text-cyan-300" />
                </div>
                <span className="text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-12 px-6 py-3 rounded-2xl flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-sm text-purple-200">
              Powered by <span className="font-semibold text-white">NASA Earth Engine</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{
          background: 'linear-gradient(180deg, #faf5ff 0%, #f3e8ff 50%, #faf5ff 100%)'
        }}
      >
        <div className="max-w-md w-full space-y-8 relative">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)',
                boxShadow: '0 10px 40px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Globe2 className="h-10 w-10 text-cyan-300" />
            </div>
            <h2 className="text-2xl font-bold font-display bg-gradient-to-r from-purple-900 to-indigo-700 bg-clip-text text-transparent">
              GeoWatch
            </h2>
            <p className="text-slate-500 text-sm mt-1">Monitor Earth. Detect Change. Act Smart.</p>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Begin your Earth monitoring journey today
            </p>
          </div>

          <div className="rounded-2xl p-8 border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.15)'
            }}
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Commander Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-geowatch pl-12 focus:border-purple-500 focus:ring-purple-500/20"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-geowatch pl-12 focus:border-purple-500 focus:ring-purple-500/20"
                    placeholder="commander@geowatch.io"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-geowatch pl-12 pr-12 focus:border-purple-500 focus:ring-purple-500/20"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)',
                    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)'
                  }}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Launch Your Mission
                      <Rocket className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                By creating an account, you agree to GeoWatch's Terms of Service and Privacy Policy
              </p>

              <div className="text-center pt-2">
                <p className="text-sm text-slate-600">
                  Already a commander?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500">
            © 2026 GeoWatch — Built by Ram
          </div>
        </div>
      </div>
    </div>
  );
}