module.exports = {
  purge: [`_site/**/*.html`],
  theme: {
    extend: {
      animation: {
        'bounce-3': 'bounce 1s 3 forwards'
      }
    },
  },
  variants: {
    animation: ['responsive', 'motion-safe', 'motion-reduce']
  },
  plugins: [],
};
