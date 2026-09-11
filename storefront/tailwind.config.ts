import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        cream: '#F5EFE6',
        'warm-beige': '#EFE8DE',
        botanical: {
          DEFAULT: '#2E4036',
          light: '#42584A',
          dark: '#1C2922'
        },
        sage: '#8FA382',
        blush: '#E8C5C8',
        rose: {
          DEFAULT: '#C47B89',
          light: '#F3D2D5'
        },
        terracotta: '#A3524E',
        gold: {
          DEFAULT: '#C59B27',
          light: '#E6C468'
        },
        charcoal: '#23211E'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['Outfit', 'Inter', 'sans-serif'],
        script: ['Pinyon Script', 'Alex Brush', 'cursive']
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(46, 64, 54, 0.08)',
        hover: '0 20px 40px -15px rgba(46, 64, 54, 0.14)',
        card: '0 4px 20px rgba(0, 0, 0, 0.03)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      }
    }
  },
  plugins: []
};

export default config;
