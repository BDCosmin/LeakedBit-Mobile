/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}', 
    './LoadingScreen.{js,ts,tsx}', 
    './Home.{js,ts,tsx}',
    './Registration/*.{js,ts,tsx}',
    './Navigation/*.{js,ts,tsx}',
    './Settings/*.{js,ts,tsx}',
    './Upload/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}'
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
