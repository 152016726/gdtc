
const gulp = require("gulp");
const gutil = require("gulp-util");
const clean = require('gulp-clean');
const rename = require("gulp-rename");
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const WebpackDevServer = require("webpack-dev-server");
const fnStaticWebpackConfig = require("./webpack.config.static.js");
const fnTempWebpackConfig = require("./webpack.config.temp.js");
const webpackConfig = require("./webpack.config.all.js");
const htmlCtrl = require('./controller/html');

/**
 * 生成静态页面方法，用于生成静态使用html，但也可以只返回需要访问的html
 * @param isGenPage 是否生成页面
 * @param buildType 生成类别     0 (默认) 全部生成，1 只生成非静态页面，2 只生成静态页
 * @returns {*}
 */
function genPage(isGenPage, buildType){
    let filePath = config.pagePath;
    let pages = [];
    let _isGenPage = !!isGenPage;
    buildType = buildType || 0;

    // 不生成页面直接返回配置页面
    if(!_isGenPage && config.devPages && config.devPages.length > 0){
        return Promise.resolve(config.devPages);
    }else{
        return new Promise((resolve, reject) => {
            //根据文件路径读取文件，返回文件列表
            fs.readdir(filePath, (err, files) => {
                if(err){
                    console.warn(err);
                    reject();
                }else{
                    let arrTemps = config.temps.map((item) => item.name);
                    let arrDef = [];
                    //遍历读取到的文件列表
                    files.forEach( (filename, i) =>{
                        //获取当前文件的绝对路径
                        let filedir = path.join(filePath,filename);
                        //根据文件路径获取文件信息，返回一个fs.Stats对象
                        fs.stat(filedir,function(eror,stats){
                            if(eror){
                                console.warn('获取文件stats失败');
                            }else{
                                let isFile = stats.isFile();//是文件
                                let isDir = stats.isDirectory();//是文件夹
                                if(isFile){
                                    console.warn('[' + filedir + '] 这个应该是文件夹');
                                }
                                if(isDir){
                                    if(_isGenPage){
                                        let tempIdx = arrTemps.indexOf(filename);
                                        if(tempIdx === -1){
                                            if(buildType === 0 || buildType === 1){
                                                arrDef.push(htmlCtrl.genPage(filename));
                                                pages.push(filename);
                                            }
                                        }else{
                                            if(buildType === 0 || buildType === 2){
                                                arrDef.push(htmlCtrl.genStaticPage(config.temps[tempIdx], config.staticLabel));
                                                pages.push(filename);
                                            }
                                        }
                                    }
                                }
                            }
                            if(i === files.length - 1){
                                if(arrDef.length === 0){
                                    resolve(pages);
                                }else{
                                    Promise.all(arrDef).then(() => {
                                        resolve(pages);
                                    }, ()=>{
                                        reject();
                                    });
                                }
                            }
                        })
                    });
                }
            });
        });
    }
}


function copyRes(){
    return new Promise(function(resolve, reject){
        var copyPaths = config.copyPaths;
        var doCnt = copyPaths.length;
        copyPaths.forEach(function(res){
            if(res.indexOf('.') === -1){
                gulp.src(config.target + '/' + res + '/**/*')
                    .pipe(gulp.dest(config.target + '/' + config.sourceRoot + '/' + res))
                    .on('end', function(){
                        doCnt--;
                        if(doCnt === 0){
                            resolve();
                        }
                    });
            }else{
                gulp.src(config.target + '/' + res )
                    .pipe(gulp.dest(config.target + '/' + config.sourceRoot))
                    .on('end', function(){
                        doCnt--;
                        if(doCnt === 0){
                            resolve();
                        }
                    });
            }
        });
    });
}

function delRes() {
    return new Promise(function(resolve, reject){
        var copyPaths = config.copyPaths;
        var doCnt = copyPaths.length;
        copyPaths.forEach(function(res){
            var tmp = gulp.src(config.target + '/' + res, {read: false})
                .pipe(clean());
        });
    });
}

function doBuildEnd(isNotCopy) {
    //拷贝配置文件
    gulp.src(config.rootPath + '/common/js/outer_config.js')
        .pipe(rename("config.js"))
        .pipe(gulp.dest(config.target + '/' + config.sourceRoot + '/js'));

    if(isNotCopy) return;

    copyRes().then(function(){
        return delRes();
    });
}


gulp.task("clean:temp", (callback) => {
    return gulp.src(config.pathTemp + '/**/*', {read: false})
        .pipe(clean());
});

gulp.task("gen:page", ["clean:temp"], (callback) => {
    return genPage(true);
});

gulp.task("gen:staticize:dev", (callback) => {
    genPage(false).then(pages => {
        let _webpackConfig = webpackConfig(pages, true);
        // Start a webpack-dev-server
        new WebpackDevServer(webpack(_webpackConfig), {
            stats: {
                colors: true
            },
            contentBase: "./src",
            https: false
        }).listen(config.serverPort, "localhost", function (err) {
            if (err) throw new gutil.PluginError("webpack-dev-server", err);
            gutil.log("[webpack-dev-server]", "http://localhost:" + config.serverPort + "/webpack-dev-server/index.html");
        });
    });
});

gulp.task("gen:staticize:build", ["clean:temp"], (callback) => {
    genPage(true, 1).then(pages => {
        let webpackStaticConfig = webpackConfig(pages);
        // run webpack
        webpack(webpackStaticConfig, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack:build", err);
            gutil.log("[webpack:build]", stats.toString({
                colors: true
            }));
            callback();
            doBuildEnd();
        });
    });
});

gulp.task("gen:staticize:build:all", ["clean:temp"], (callback) => {
    genPage(true).then(pages => {
        let webpackStaticConfig = webpackConfig(pages);
        // run webpack
        webpack(webpackStaticConfig, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack:build", err);
            gutil.log("[webpack:build]", stats.toString({
                colors: true
            }));
            callback();
            doBuildEnd();
        });
    });
});

/**
 * @description 生成静态页模板
 * @returns {Promise}
 */
function genStaticPage(){
    return new Promise((resolve, reject) => {
        //根据文件路径读取文件，返回文件列表
        fs.readdir(config.pagePath, (err, files) => {
            if(err){
                console.warn(err);
                reject();
            }else{
                let defArr = [];
                let pages = [];
                //遍历读取到的文件列表
                files.forEach((filename, i) =>{
                    for(let j = 0; j < config.temps.length; j++){
                        if(config.temps[j].name === filename){
                            // 这里就不判断是不是文件夹了... 反正不是的话会报错的...
                            defArr.push(htmlCtrl.genStaticPage(config.temps[j], config.staticLabel));
                            pages.push(filename);
                            break;
                        }
                    }
                });
                Promise.all(defArr).then(() => {
                    resolve(pages);
                }, reject);
            }
        });
    });
}

gulp.task("gen:staticize:temp", ["clean:temp"], (callback) => {
    genPage(true, 2).then(pages => {
        let webpackStaticConfig = webpackConfig(pages);
        // run webpack
        webpack(webpackStaticConfig, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack:build", err);
            gutil.log("[webpack:build]", stats.toString({
                colors: true
            }));
            callback();
            doBuildEnd();
        });
    });
});

gulp.task("gen:staticize:build:debug", ["clean:temp"], (callback) => {
    genPage(true).then(pages => {
        let webpackStaticConfig = webpackConfig(pages);
        // run webpack
        webpack(webpackStaticConfig, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack:build", err);
            gutil.log("[webpack:build]", stats.toString({
                colors: true
            }));
            callback();
            doBuildEnd(true);
        });
    });
});

























