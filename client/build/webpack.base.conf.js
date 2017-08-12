const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const utils = require('./utils');
const config = require('../config');

const projectRoot = path.resolve(__dirname, '../');
const entry = utils.getEntries('./client/src/entry/**/*.js');
// var entry = utils.getEntries('./client/src/entry/private/main.js'); // 一次只能调试一个entry
const env = process.env.NODE_ENV;
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
const cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap);
const cssSourceMapProd = (env === 'production' && config.build.productionSourceMap);
const useCssSourceMap = cssSourceMapDev || cssSourceMapProd;
// Create multiple instances
const privateLess = new ExtractTextPlugin('static/css/[name].private.[hash:7].css');
const vendorCss = new ExtractTextPlugin('static/css/[name].vendor.[hash:7].css');
const vueCssSourcemaploaders = 'vue-style-loader?sourceMap!css-loader?sourceMap!less-loader?sourceMap';
module.exports = {
  entry,
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    modules: [
      'node_modules',
      path.join(__dirname, '../node_modules'),
    ],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      api$: path.resolve(__dirname, '../src/service/api'),
      common: path.resolve(__dirname, '../src/common'),
      service: path.resolve(__dirname, '../src/service'),
      store: path.resolve(__dirname, '../src/store'),
      props: path.resolve(__dirname, '../src/components/common/props'),
      'element-ui': 'kr-element-ui',
      juqery$: 'jquery/dist/jquery.slim.js',
      src: path.resolve(__dirname, '../src'),
      assets: path.resolve(__dirname, '../src/assets'),
      components: path.resolve(__dirname, '../src/components'),
    },
  },
  resolveLoader: {
    modules: [
      'node_modules',
      __dirname,
    ],
    moduleExtensions: ['-loader'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.vue$/,
        loader: 'eslint-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue',
        options: {
          preserveWhitespace: false,
          name: utils.assetsPath('[name].[hash:7].[ext]'),
          postcss: [
            require('autoprefixer')({
              browsers: ['last 2 versions'],
            }),
          ],
          loaders: {
            less: useCssSourceMap ? vueCssSourcemaploaders : privateLess.extract({
              use: ['css-loader', 'less-loader'],
              fallback: 'vue-style-loader',
            }),
          },
        },
      },
      {
        test: /kr-element-ui.*\.css$/,
        use: ['ignore-loader'],
      },
      {
        test: /\.css$/,
        use: vendorCss.extract({
          use: 'css-loader',
        }),
        exclude: /kr-element-ui.*\.css$/,
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel',
          },
          {
            loader: 'eslint',
            options: {
              configFile: path.join(projectRoot, '../.eslintrc.js'),
            },
          },
        ],
        include: [
          projectRoot,
          path.join(projectRoot, '../node_modules/vue-echarts'),
        ],
        exclude: /pv-router.js$/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  plugins: [
    vendorCss,
    privateLess,
  ],
};

