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
let commonsPlugin, extractCSS;

module.exports = function (pages, DEBUG) {
    let entryMap = {};
    let arrHtml = [];
    let filePath = config.pagePath;
    let isHash = config.isHash;
    let rootPath = config.rootPath;
    let arrTemps = config.temps.map((item) => item.name);
    let GLOBALS = {
        '__DEBUG__': DEBUG,
        "__DEBUGDATA__": false
    };
    if(!DEBUG){
        commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "js/common" + (isHash ? ".[hash]" : "") + ".js"
        });
        extractCSS = new ExtractTextPlugin('css/' + (isHash ? '[hash].' : '') + '[name].css');
    }

    pages.forEach((filename) => {
        if(DEBUG){
            entryMap[filename] = filePath + '/' + filename + '/index.js';
        }else{
            entryMap[filename] = [
                config.rootPath + '/common/js/common.js',
                filePath + '/' + filename + '/action.js',
                config.rootPath + '/component/header/index.js',
                config.rootPath + '/component/footer/index.js'
            ];
        }
        let isTemp = arrTemps.indexOf(filename) !== -1;
        // 针对模板页面生成不一样的
        arrHtml.push({
            filename: (!DEBUG && isTemp) ? `${config.tempRoot}/${filename}.art` : `${filename}.html`,
            template: DEBUG ? './src/entry/empty.html' : `${config.pathTemp}/${filename}.html`,
            favicon: `${rootPath}/common/style/img/logo.png`,
            hash: true,
            chunks: [
                'common', filename
            ]
        });
    });
    return {
        entry: entryMap,
        output: {
            path: path.join(__dirname, config.target),
            filename: `js/${isHash ? '[hash].' : ''}[name].js`,
            publicPath: DEBUG ? './' : config.publicPath,
            chunkFilename: `js/${isHash ? '[hash].' : ''}[id].bundle.js${isHash ? '' : '?[hash]'}`
        },
        devtool: DEBUG ? '#eval' : false,
        resolve: {
            alias: Object.assign({
                jquery: "plugin/jQuery/jquery.js",
                avalon2: "plugin/avalon/avalon.js",
                mmRouter: "plugin/avalon/mmRouter.js",
                fetchPolyfill: "plugin/avalon/fetch.js",
                avalonPromise: "plugin/avalon/mmPromise.js"
            }, DEBUG ? {
                vue: 'vue/dist/vue.js'
            }: {
                "vue$": "vue/dist/vue.js"
            }),
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
                    loader: 'file-loader?name=img/' + (isHash ? '[hash].' : '[path]') + '[name].[ext]'
                },
                {
                    test: /\.art$/,
                    loaders: ['art-template']
                },
                Object.assign({
                        test: /\.css$/
                    }, DEBUG ? {
                        loaders: ['style', 'css']
                    }: {
                        loader: extractCSS.extract(['css'])
                }),
                Object.assign({
                        test: /\.scss$/
                    }, DEBUG ? {
                        loaders: ['style', 'css', 'sass']
                    }: {
                        loader: extractCSS.extract(['css', 'sass'])
                }),
                {
                    test: /\.template$/,
                    loaders: ["html-loader"]
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
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
            new webpack.DefinePlugin(GLOBALS),
            new TransferWebpackPlugin([
                { from: './src/common/style/img', to: './img' },
                { from: './src/plugin/echarts', to: './plugin/echarts' },
                { from: './src/plugin/laydate/theme/default', to: './js/theme/default' }
            ])
        ]).concat(DEBUG ? [] : [
            extractCSS,
            commonsPlugin,
            new CleanWebpackPlugin([config.target], {
                exclude:  ['.svn']
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new UglifyJsPlugin()
        ])
    }
};