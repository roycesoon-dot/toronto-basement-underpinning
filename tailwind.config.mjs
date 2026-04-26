/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8ecf2',
          100: '#c5cfdc',
          200: '#9eafc4',
          300: '#778fac',
          400: '#5a779a',
          500: '#3d5f88',
          600: '#1a2b3c',
          700: '#0b1d2d',
          800: '#041627',
          900: '#020e1a',
          950: '#01070d',
        },
        secondary: {
          50: '#eef0f3',
          100: '#d2d6df',
          200: '#a6adba',
          300: '#7a8495',
          400: '#545f72',
          500: '#3c475a',
          600: '#2d3744',
          700: '#1f2632',
          800: '#111720',
          900: '#080b10',
        },
        accent: {
          50: '#fff2e6',
          100: '#ffd9b8',
          200: '#ffc08a',
          300: '#ffa75c',
          400: '#ff932e',
          500: '#FF7E21',
          600: '#e86d0a',
          700: '#b85608',
          800: '#7a3a05',
          900: '#491d00',
        },
        'brand-bg': '#f7f9fb',
        'brand-surface': '#ffffff',
        'brand-text': '#191c1e',
        'brand-muted': '#44474c',
        'brand-border': '#c4c6cd',
      },
      fontFamily: {
        heading: ['Work Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        button: '0px',
        card: '0px',
        badge: '0px',
      },
      maxWidth: {
        container: '1280px',
      },
      zIndex: {
        header: '50',
        hero: '10',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
