/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['monospace'],
      },
      colors: {
        pixel: {
          bg: '#1a1a2e',
          surface: '#16213e',
          primary: '#0f3460',
          accent: '#e94560',
          text: '#f5f5f5',
          muted: '#a0a0a0',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#ef4444',
        }
      },
      animation: {
        'pixel-pulse': 'pixel-pulse 2s ease-in-out infinite alternate',
        'pet-idle': 'pet-idle 3s ease-in-out infinite',
        'xp-fill': 'xp-fill 0.8s ease-out forwards',
      },
      keyframes: {
        'pixel-pulse': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.5' }
        },
        'pet-idle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'xp-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-width)' }
        }
      }
    },
  },
  plugins: [],
}

