/**
 * Created by DDT on 2017/11/24.
 */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const config = require('./config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const GLOBALS = {
    '__DEBUG__': false,
    "__DEBUGDATA__": false
};

console.log(path.resolve('./src'));

module.exports = function (pages, DEBUG) {
    let entryMap = {};
    let arrHtml = [];
    let filePath = config.pagePath;
    //let isHash = config.isHash;
    let isHash = false;
    let rootPath = config.rootPath;
    pages.forEach((filename) => {
        entryMap[filename.name] = [
            config.rootPath + '/common/js/common.js',
            filePath + '/' + filename.name + '/action.js',
            config.rootPath + '/component/header/index.js',
            config.rootPath + '/component/footer/index.js'
        ];
        arrHtml.push({
            filename: filename.name + '.art',
            template: config.pathTemp + '/' + filename.name + '.html',
            favicon: rootPath + "/common/style/img/logo.png",
            chunks: [
                'common', filename.name
            ]
        });
    });
    let commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
        name: "common",
        filename: "js/common_static" + (isHash ? ".[hash]" : "") + ".js"
    });
    var extractCSS = new ExtractTextPlugin((isHash ? '[hash]' : '') + '[name].css');
    return {
        entry: entryMap,
        output: {
            path: path.join(__dirname, config.target),
            filename: 'js/' + (isHash ? '[hash]' : '') + '[name].js',
            publicPath: "../../resource/",
            chunkFilename: 'js/' + (isHash ? '[hash]' : '') + '[id].bundle.js' + (isHash ? '' : '?[hash]')
        },
        devtool: DEBUG ? '#eval' : false,
        resolve: {
            alias: {
                jquery: "plugin/jQuery/jquery.js",
                avalon2: "plugin/avalon/avalon.js",
                mmRouter: "plugin/avalon/mmRouter.js",
                fetchPolyfill: "plugin/avalon/fetch.js",
                avalonPromise: "plugin/avalon/mmPromise.js"
            },
            root: [path.resolve(config.rootPath)],
            modulesDirectories: ["node_modules"],
            extensions: ['', '.webpack.js', '.web.js', '.css', '.js', '.jsx']
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
                    test: /\.(png|svg|jpg|gif)$/,
                    loader: 'file-loader?name=img/[name][hash].[ext]'
                },
                {
                    test: /\.art$/,
                    loaders: ['art-template']
                },
                {
                    test: /\.css$/,
                    loader: extractCSS.extract(['css'])
                },
                {
                    test: /\.template$/,
                    loaders: ["html-loader"]
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                },
                {
                    test: /\.scss$/,
                    loader: extractCSS.extract(['css', 'sass'])
                }
            ],
            postLoaders: [
                {
                    test: /\.js$/,
                    loaders: ['es3ify-loader']
                }
            ]
        },
        plugins: arrHtml.map(objHtml => new HtmlWebpackPlugin(objHtml)).concat([
            extractCSS,
            new webpack.DefinePlugin(GLOBALS),
            commonsPlugin,
            new CleanWebpackPlugin([config.target], {
                exclude:  ['.svn']
            }),
            new TransferWebpackPlugin([
                { from: './src/common/style/img', to: './img' },
                { from: './src/plugin/echarts', to: './plugin/echarts' },
                { from: './src/plugin/laydate/theme/default', to: './js/theme/default' }
            ])
        ]).concat(DEBUG ? [] : [
            new webpack.optimize.AggressiveMergingPlugin(),
            new UglifyJsPlugin({
                uglifyOptions: {
                    ie8: true
                }
            })
        ])
    }
};