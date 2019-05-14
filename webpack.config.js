const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      }
    }, {
      test: /\.css$/,
      use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png)(\?\S*)?$/,
      loader: 'url-loader?&name=asset/font/[name].[ext]',
    }, {
      test: /\.yml$/,
      use: 'js-yaml-loader',
    }, {
      test: /\.html$/,
        use: [{
          loader: "html-loader",
        }]
    }], 
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    })
  ]
}
