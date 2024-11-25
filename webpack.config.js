const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "wizzy.js"),

  output: {
    filename: "wizzy.js",
    path: path.resolve(__dirname, "dist"),
    library: "wizzy",
    libraryTarget: "umd",
    globalObject: "this",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "index.html"),
          to: path.resolve(__dirname, "dist"),
        },
        {
          from: path.resolve(__dirname, "wizzy.css"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
  ],

  mode: "development",
};
