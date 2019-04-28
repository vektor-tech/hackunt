const path = require("path");
const webpack = require("webpack");

// copy manifest.json to the path: 'public/build'
// this will allow for the authRequest to see the file at www.example.com/manifest.json
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestAssetPlugin = new CopyWebpackPlugin([
  { from: "src/assets/manifest.json", to: "manifest.json" }
]);
const HeadersAssetPlugin = new CopyWebpackPlugin([
  { from: "./_headers", to: "." }
]);
const IconAssetPlugin = new CopyWebpackPlugin([
  { from: "src/images/icon-192x192.png", to: "icon-192x192.png" },
  { from: "src/images/logo.png", to: "logo.png" },
  { from: "src/images/logo1.png", to: "logo1.png" },
  { from: "src/images/carousel1.jpg", to: "carousel1.jpg" },
  { from: "src/images/carousel2.jpg", to: "carousel2.jpg" },
  { from: "src/images/carousel3.jpg", to: "carousel3.jpg" },
  { from: "src/images/home.jpg", to: "home.jpg" },
  { from: "src/images/git.png", to: "git.png" },
  { from: "src/images/link.png", to: "link.png" },
  { from: "src/images/rs.jpg", to: "rs.jpg" },
  { from: "src/images/sl.jpg", to: "sl.jpg" }
]);

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "index.html",
  inject: "body"
});

module.exports = {
  entry: "./src/index.js",
  target: "web",
  output: {
    path: path.resolve("public/build"),
    filename: "index_bundle.js"
  },
  devServer: {
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    }
  },
  module: {
    rules: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx$/, loader: "babel-loader", exclude: /node_modules/ },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        loader: "file-loader!url-loader"
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    ManifestAssetPlugin,
    IconAssetPlugin,
    HeadersAssetPlugin
  ]
};
