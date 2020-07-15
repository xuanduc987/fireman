module.exports = {
  extends: '@snowpack/app-scripts-react',
  install: [
    "heroicon/solid/*",
    "heroicon/outline/*"
  ],
  scripts: {
    'build:css': 'postcss',
  },
  plugins: [],
};
