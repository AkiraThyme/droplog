import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#7c3aed',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
