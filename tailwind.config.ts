import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F5F0EB',
        'bg-secondary': '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6B6B',
        'text-muted': '#999999',
        'accent-peach': '#F5D5B0',
        'accent-peach-text': '#8B6914',
        'border-light': '#E5E0DB',
        'border-circle': '#C4C0BB',
        'cta-primary': '#FF6B00',
        'cta-text': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        'article': '700px',
        'content': '1200px',
      },
      borderRadius: {
        'pill': '100px',
      },
    },
  },
  plugins: [],
};
export default config;
