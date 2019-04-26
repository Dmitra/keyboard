const path = require('path')

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.(scss|css)$/,
      use: [
      'style-loader',
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: [
            'node_modules',
            'node_modules/@material/*'
          ].map(d => path.join(__dirname, d))
        }
      }]
    }, {
      test: /\.yml$/,
      use: 'js-yaml-loader',
    }], 
  }
}
