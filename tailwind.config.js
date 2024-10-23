/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        im3Red: '#FE3402',
        im3White: '#F4F4F4',
        im3Black: '#010101',
      },
      fontFamily: {
        SpaceGrotesk: ['SpaceGrotesk-Regular', 'sans-serif'],
        Nunito: ['Nunito-Regular', 'sans-serif'],
      },
      width: {
        'fill-available': '-webkit-fill-available',
      },
      backgroundImage: {
        'graph-bg': "url('../public/images/enterRoom/graph.svg')",
      },
    },
  },
  plugins: [],
};
