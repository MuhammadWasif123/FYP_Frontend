// tailwind.config.js
export default {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          heading: ['Poppins', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  