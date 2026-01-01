/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#DBE4FF',
          100: '#B5C8F2',
          200: '#8FAAE0',
          300: '#6B8FC7',
          400: '#4A6FA5',
          500: '#2D4A6E',
          600: '#1A2F4D',
          700: '#0F1F3A',
          800: '#0A1628',
          900: '#050B14',
        },
        accent: {
          orange: '#FF6B35',
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444',
          blue: '#3B82F6',
        },
        tier: {
          beginner: '#94A3B8',
          novice: '#A855F7',
          intermediate: '#3B82F6',
          advanced: '#10B981',
          elite: '#F59E0B',
          master: '#EF4444',
          legend: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(74, 111, 165, 0.5)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'level-up': 'levelUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'shake': 'shake 0.5s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        levelUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
