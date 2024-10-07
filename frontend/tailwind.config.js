/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
<<<<<<< HEAD
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
=======
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
>>>>>>> main
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
      'fondo' : "#F2F5F6",
      'text-icon' : '#353344',
      'principal' : "#427EF3",
      'secundario': '#7AA3F3',
      'acento' : '#9235C2'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
     
=======
        fondo: '#F2F5F6',
        'text-icon': '#353344',
        principal: '#427EF3',
        secundario: '#7AA3F3',
        acento: '#9235C2',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        Modal: '45px',
      },
>>>>>>> main
    },
  },
  plugins: [],
};
