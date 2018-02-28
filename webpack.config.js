const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/common/js/main.js',
  output: {
    filename: 'bundle.min.js',
    path: path.join(__dirname, 'docs/common/js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}
