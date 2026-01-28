import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Main palette
        'sand': {
          DEFAULT: '#DFC191',
          light: '#EED9B6',
          dark: '#C9A86E',
        },
        'terracotta': {
          DEFAULT: '#C46733',
          light: '#D4834F',
          dark: '#A85529',
        },
        'rust': {
          DEFAULT: '#AD5938',
          light: '#C06B4A',
          dark: '#8E4A2E',
        },
        'coal': {
          DEFAULT: '#32332D',
          light: '#4A4B44',
          lighter: '#5E5F57',
          dark: '#1F201B',
          darker: '#141510',
        },
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #DFC191, 0 0 10px #DFC191' },
          '100%': { boxShadow: '0 0 15px #DFC191, 0 0 25px #DFC191' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(223 193 145 / 0.07)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        'noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
}
export default config
