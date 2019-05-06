/**
 * Created by DDT on 2017/11/24.
 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const config = require('./config');

const GLOBALS = {
    '__DEBUG__': true,
    "__DEBUGDATA__": false
};

module.exports = function(pages) {
    let entryMap = {};
    let arrHtml = [];
    let filePath = config.pagePath;
    let isHash = config.isHash;
    let rootPath = config.rootPath;
    pages.forEach((filename) => {
        entryMap[filename] = filePath + '/' + filename + '/index.js';
        arrHtml.push({
            filename: filename + '.html',
            favicon: rootPath + "/common/style/img/logo.png",
            template: './src/entry/empty.html',
            chunks: [filename],
            inject: "body"
        });
    });
    return {
        entry: entryMap,
        output: {
            path: path.join(__dirname, config.target),
            filename: 'js/' + (isHash ? '[hash]' : '') + '[name].js',
            publicPath: config.publicPath
        },
        devtool: '#eval',
        resolve: {
            alias: {
                jquery: "plugin/jQuery/jquery.js",
                avalon2: "plugin/avalon/avalon.js",
                mmRouter: "plugin/avalon/mmRouter.js",
                fetchPolyfill: "plugin/avalon/fetch.js",
                avalonPromise: "plugin/avalon/mmPromise.js",
                vue: 'vue/dist/vue.js'
            },
            root: [
                path.resolve('./src')
            ],
            modulesDirectories: ["node_modules"],
            extensions: ['', '.webpack.js', '.web.js', '.css', '.js', '.jsx']
            //modules: [path.resolve(__dirname, "src"), "node_modules"]
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        cacheDirectory: true,
                        "presets": [
                            "es2015",
                            "stage-0"
                        ],
                        "plugins": [
                            "transform-object-assign"
                        ]
                    }
                },
                {
                    test: /\.css$/,
                    loaders: ['style', 'css']
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass']
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    loaders: ['file']
                },
                {
                    test: /\.art$/,
                    loaders: ['art-template']
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                },
                {
                    test: /\.template$/,
                    loaders: ["html-loader"]
                }
            ]
            //,
            //postLoaders: [
            //    {
            //        test: /\.js$/,
            //        loaders: ['es3ify-loader']
            //    }
            //]
        },
        plugins: arrHtml.map(objHtml => new HtmlWebpackPlugin(objHtml)).concat([
            new webpack.DefinePlugin(GLOBALS),
            new TransferWebpackPlugin([
                { from: './src/common/style/img', to: './img' },
                /* { from: './src/dataCenter/images', to: './s_img' }, */
                { from: './src/plugin/echarts', to: './plugin/echarts' },
                { from: './src/plugin/laydate/theme/default', to: './js/theme/default' }
                // { from: './src/debug/data', to:'./data'}
                // { from: './src/plugins', to: './plugins' }
            ])
        ])
    }
};