const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'wizzy.js'),
  output: {
    filename: 'wizzy2.build.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'wizzy2',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'development',
};
