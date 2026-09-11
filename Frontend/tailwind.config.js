/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06060f',
          900: '#0b0c1f',
          800: '#131530',
          700: '#1e2148',
          600: '#2d3169',
        },
        accent: {
          300: '#a5abff',
          400: '#8385ff',
          500: '#6a5cf5',
          600: '#5541e8',
          700: '#4531c7',
        },
        aurora: {
          from: '#6a5cf5',
          via: '#a855f7',
          to: '#22d3ee',
        },
        surface: {
          light: '#ffffff',
          muted: '#f6f6fc',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(11, 12, 31, 0.25)',
        glow: '0 0 0 1px rgba(106,92,245,0.25), 0 10px 32px -6px rgba(168,85,247,0.45)',
        'glow-lg': '0 0 0 1px rgba(106,92,245,0.3), 0 20px 60px -12px rgba(168,85,247,0.5)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(115deg, #6a5cf5 0%, #a855f7 50%, #22d3ee 100%)',
        'dot-grid': 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        shine: 'shine 1.1s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-15deg)' },
          '100%': { transform: 'translateX(220%) skewX(-15deg)' },
        },
      },
    },
  },
  plugins: [],
};
