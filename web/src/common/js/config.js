/**
 * Created by oWEn on 2018/1/9.
 */
var $ = require("jquery");
var DEFAULT_SETTING = {
    //host_name: "http://120.78.151.155:8088/",
    host: 'http://14.18.86.60:8081/sporttery_web_api',
    host_name: "/", // 相对路径, dev联机测试用
    api_name: "sporttery_web_api",
    debug: true,
    is_debug_data: __DEBUGDATA__,
    debug_data_folder:"debug/data/",
    success_code: "SUCCESS",
    pushServer: '//172.20.52.35:3000'
  /*  pushServer: '//192.168.199.136:3000/' ///连接push地址*/
};

var setting = $.extend({}, DEFAULT_SETTING, window.cfg || {});

module.exports = setting;