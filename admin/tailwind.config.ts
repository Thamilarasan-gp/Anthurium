import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        adminBg: '#0B132B',
        adminCard: '#1C2541',
        adminBorder: '#3A506B',
        adminAccent: '#10B981',
        adminSidebar: '#0F172A',
        adminSurface: '#1E293B',
        adminMuted: '#94A3B8'
      },
    },
  },
  plugins: [],
} satisfies Config;
