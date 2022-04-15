const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const common = require('./webpack.common');
const title = require('./web.config');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/[name].bundle.css' }),
    /*     new FaviconsWebpackPlugin({
      logo: './src/img/favicon.png',
      prefix: 'img/',
      inject: true,
    }), */
    new HtmlWebpackPlugin({
      title,
      filename: 'index.html',
      template: 'src/template.html',
      inject: 'body',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
            ],
          },
        },
      }),
    ],
    runtimeChunk: {
      name: 'runtime',
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
