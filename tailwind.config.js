/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F9F7F4',
          dark: '#F0EDE8',
        },
        ink: {
          DEFAULT: '#1A1A18',
          light: '#3D3D3A',
        },
        warm: {
          gray: '#8C8C86',
          line: '#D8D5CE',
          muted: '#B0ADA6',
        },
        terracotta: {
          DEFAULT: '#B5705B',
          light: '#CC9080',
          dark: '#8E5242',
        },
        sage: {
          DEFAULT: '#7A8C6E',
          light: '#A4B394',
          dark: '#5C6B52',
        },
        gold: {
          DEFAULT: '#C4A35A',
          light: '#D4BB80',
          dark: '#9E7E3A',
        },
        'rose-wedding': '#C9A9A6',
        'rose-light': '#E8D5D3',
        'rose-dark': '#A07A77',
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-lato)', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.25em',
        tight: '-0.02em',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.9s ease-out forwards',
        'line-draw': 'lineDraw 1.2s ease-out forwards',
        'reveal': 'reveal 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        lineDraw: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        reveal: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0% 0 0)' },
        },
      },
    },
  },
  plugins: [],
}
