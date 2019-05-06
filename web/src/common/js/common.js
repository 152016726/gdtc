
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('core-js/fn/object/assign');
require('es6-promise');
require('es6-promise').polyfill();
require('fetch-ie8');

require("../style/common.scss");
require("../../component/tips/style.scss");
var dict = require('@easylotto/dict');
var dictDict = require("./dictData");


// 字典表初始化
dict.init(dictDict);

var config = require("./config.js");
// require("avalon2"); // 引入avalon

// 配置service
var service = require('@easylotto/service');
service.setConfiguration({
    //host: "http://192.168.199.186:8080/dotrecru_web_api",
    host: config.host_name + config.api_name,
    //host: "/dotrecru_web_api",
    is_debug_data: config.is_debug_data,
    success_code: config.success_code
});


//扩展日期转换方法
Date.now || (Date.now = function() {
    return +new Date;
});
Date.prototype.format || (Date.prototype.format = function(format) {
    let o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
});
/**
 * Parses the ISO 8601 formated date into a date object, ISO 8601 is YYYY-MM-DD
 *
 * @param {String} date the date as a string eg 1971-12-15
 * @returns {Date} Date object representing the date of the supplied string
 */
Date.prototype.parseISO8601 = function(date){
    let dt = date.split(/[: T-]/).map(parseFloat);
    return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
};