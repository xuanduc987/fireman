module.exports = {
  extends: '@snowpack/app-scripts-react',
  install: ['heroicon/solid/*', 'heroicon/outline/*'],
  scripts: {
    'build:css': 'postcss',
    'bundle:*': '@snowpack/plugin-webpack',
  },
  plugins: [['@snowpack/plugin-webpack', { sourceMap: true }]],
};
