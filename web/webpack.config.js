
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: './src/index.jsx',
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },
  output: {
    path: path.resolve('build'),
    filename: 'assets/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.scss$/, loaders: [
        'style-loader',
        'css-loader?localIdentName=[path]___[name]__[local]___[hash:base64:5]',
        'sass-loader',
      ]}
    ],
  },
  plugins: [HtmlWebpackPluginConfig]
}
