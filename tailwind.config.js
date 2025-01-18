module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      clipPath: {
        'border': 'polygon(5% 0%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0% 90%, 0% 10%)'
      }
    },
  },
  plugins: [],
};