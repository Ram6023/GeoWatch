/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // GeoWatch Space Theme Colors
        geowatch: {
          deep: '#0c1445',       // Deep Space Blue
          accent: '#00ff88',    // Neon Green - Aurora
          navy: '#050a1f',      // Dark Space
          ocean: '#1e40af',     // Ocean Blue
          forest: '#059669',    // Forest Green
          sky: '#06b6d4',       // Cyan Sky
          mint: '#34d399',      // Mint Green
          cosmos: '#0d1b3e',    // Cosmic Blue
          nebula: '#4f46e5',    // Nebula Purple
          aurora: '#06b6d4',    // Aurora Cyan
          earth: '#1e88e5',     // Earth Blue
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        space: {
          900: '#030712',
          800: '#0c1222',
          700: '#111827',
          600: '#1f2937',
          500: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.3), 0 0 10px rgba(0, 255, 136, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 136, 0.6), 0 0 60px rgba(0, 255, 136, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%': { transform: 'translateY(10px)', opacity: '1' },
        },
      },
      boxShadow: {
        'geowatch': '0 4px 20px rgba(0, 255, 136, 0.15)',
        'geowatch-lg': '0 10px 40px rgba(0, 255, 136, 0.2)',
        'accent-glow': '0 0 30px rgba(0, 255, 136, 0.4)',
        'earth-glow': '0 0 40px rgba(30, 136, 229, 0.4)',
        'space': '0 10px 50px rgba(0, 0, 0, 0.5)',
        'neon': '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3), 0 0 30px rgba(0, 255, 136, 0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e293b 100%)',
        'earth-gradient': 'linear-gradient(135deg, #1e88e5 0%, #1565c0 50%, #0d47a1 100%)',
        'aurora-gradient': 'linear-gradient(135deg, #00ff88 0%, #06b6d4 50%, #4f46e5 100%)',
      },
    },
  },
  plugins: [],
};
