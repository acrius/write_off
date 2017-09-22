var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: `/mnt/c/Users/bda.DOKENISEY/Documents/dev/write_off/backend/static`,
    filename: 'application.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules']
  },
  module: {
    loaders: [
      {
        test: /.js/,
        loader: ['babel-loader'],
        include: [path.resolve(__dirname)],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
}
