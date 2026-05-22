import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f9593b',
        'primary-dark': '#d73e20',
        'primary-light': '#f77d67',
        background: '#ffffff',
        foreground: '#28332d',
        border: '#e5e7eb',
        muted: '#f3f4f6',
      },
    },
  },
  plugins: [],
};

export default config;
