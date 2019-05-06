/**
 * html控制器，生成写入html文件
 * Created by DDT on 2017/11/23.
 */
const fs = require('fs');
const path = require('path');
const vm_root = 'src/pages/';
const gen_root = './temp';
let template = require('art-template');

/**
 * @description 替换模板方法
 * @param source 源数据
 * @param target 目标数据
 * @param label 替换的标签名
 */
function replaceTemp(source, target, label){
    let reg = new RegExp("<" + label + ">(([\\w\\W])*?)<\\/" + label +">");
    let copy = target.match(reg);
    let isMatch = copy && copy.length > 1;
    // match不到返回源数据
    let result = isMatch ? source.replace(reg, copy[1]) : source;
    return result;
}

module.exports = {
    /**
     * 初始化模板引擎配置等，注入imports公共定义内容
     * @deprecated 已废弃，改由genPage时加入公共内容
     */
    init() {
        //全局公用数据
        Object.assign(template.defaults.imports, require('../src/importData/index'));
    },
    /**
     * 主动生成页面
     */
    genPage(page) {
        return new Promise( (resolve, reject) => {
            let strHtml = template(
                path.resolve('./' + vm_root + page + '/view.art'),
                Object.assign({}, require('../' + vm_root + page + '/model'), { global: Object.assign({}, require('../src/importData/index'), {
                    isStaticBuild: true
                })})
            );
            //fs.writeFileSync(path.resolve(gen_root) + '/' + page + '.html', strHtml);
            fs.writeFile(path.resolve(gen_root) + '/' + page + '.html', strHtml, (err) => {
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    },
    /**
     * @description 生成静态页
     * @param pageConfig config.js -> temps的一个子对象
     * @param rootLabel 用于替换的根标签
     * @returns {Promise}
     */
    genStaticPage(pageConfig, rootLabel){
        return new Promise((resolve, reject) => {
            let isHasSubtemplates = pageConfig.subtemplates && pageConfig.subtemplates.length > 0;
            let strHtml = template(
                path.resolve('./' + vm_root + pageConfig.name + '/view.art'),
                Object.assign({}, require('../' + vm_root + pageConfig.name + '/model'), { global: Object.assign({}, require('../src/importData/index'), {
                    isStaticBuild: true
                })})
            );
            //console.log(strHtml);

            let defArr = [];
            // 先转换最外层模板
            let _defRoot = new Promise((defResolve, defReject) => {
                fs.readFile(path.resolve('./' + vm_root + pageConfig.name + '/view.art'), 'utf8', (err, data) => {
                    if (err) {
                        defReject(err);
                    } else {
                        strHtml = replaceTemp(strHtml, data, rootLabel);
                        //console.log(strHtml);
                        defResolve();
                    }
                });
            });
            defArr.push(_defRoot);

            // 再转换子模板
            for(let i = 0; i < isHasSubtemplates ? pageConfig.subtemplates.length : 0; i++) {
                let _def = new Promise((defResolve, defReject) => {
                    fs.readFile(path.resolve(pageConfig.subtemplates[i].path), 'utf8', (err, data) => {
                        if (err) {
                            defReject(err);
                        } else {
                            let label = pageConfig.subtemplates[i].label;
                            strHtml = replaceTemp(strHtml, data, label);
                            //console.log(strHtml);
                            defResolve();
                        }
                    });
                });
                defArr.push(_def);
            }

            // 炼成
            Promise.all(defArr).then(() => {
                // 写到temp
                fs.writeFile(path.resolve(gen_root) + '/' + pageConfig.name + '.html', strHtml, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });



        });
    }
};
































