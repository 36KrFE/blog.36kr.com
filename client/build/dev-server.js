require('./check-versions')()
// var config = require('../config')
// if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
// var path = require('path')
// var express = require('express')
var webpack = require('webpack')
// var opn = require('opn')
// var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// // default port where dev server listens for incoming traffic
// var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var WebpackDevServer = require('webpack-dev-server');

// Object.keys(webpackConfig.entry).forEach(function(key){
//   webpackConfig.entry[key]=['webpack/hot/dev-server','webpack-dev-server/client?http://local.36kr.com:8080/'].concat([webpackConfig.entry[key][1]]);
// });
var compiler = webpack(webpackConfig)
var server = new WebpackDevServer(compiler, webpackConfig.devServer);
// server.listen();
server.listen(8080, "127.0.0.1", function() {
	console.log("Starting server on http://local.36kr.com:8080");
});
