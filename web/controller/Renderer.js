var $ = require("jquery");
// var tools = require('common/js/tools');


/**
 * 主动注入html片段
 * @param strPage   来源于哪个页面，对应pages目录下文件夹
 * @param exModel   可以增加扩展对象，用于静态化生成
 */
module.exports = function (strPage, exModel) {
    var render = require("../src/pages/" + strPage + "/view.art");
    var data = require("../src/pages/" + strPage + "/model");
    var html = render(Object.assign({}, data, {exModel: exModel || {}}, {global: require('importData')}));
    var body_str = html.match(/<body[\s\S]*>[\s\S]*<\/body>/g);
    if (typeof document === 'object') {
        $(document.body).html(body_str[0]);
    }
};




















