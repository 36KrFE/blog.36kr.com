var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['./client/build/dev-client'].concat(baseWebpackConfig.entry[name])
// })

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
    rules: [
      {
        test: /pv-router.js$/,
        use: ['babel','router-loader', 'eslint'],
      },
    ],
  },
  devtool: 'eval',
  watch: true,
  devServer: {
    host: 'local.36kr.com',
    hot: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
    },
    disableHostCheck: true,
    publicPath: baseWebpackConfig.output.publicPath,
    proxy: {
      '/api': {
        target: 'http://localhost:8360/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
    },
    stats: {
      colors: true,
    },
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/__webpack_hmr$/, to: '/__webpack_hmr'},
        { from: /^.*$/, to: '/private.html'},
      ],
    },
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      test: /.css$/,
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
  ]
});

var pages = utils.getEntries('./client/src/entry/**/*.html');
for(var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    favicon: './client/src/assets/favicon.ico', //favicon路径
    filename: page + '.html',
    template: pages[page], //模板路径
    inject: false,
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    })
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}
