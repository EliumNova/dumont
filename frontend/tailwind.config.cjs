/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#F2F5F6',
        'text-icon': '#353344',
        principal: '#427EF3',
        secundario: '#7AA3F3',
        acento: '#9235C2',
      },
      borderRadius: {
        Modal: '45px',
      },
    },
  },
  plugins: [],
};
