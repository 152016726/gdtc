/**
 * Created by Administrator on 2017/12/13.
 */
require('./style.scss');
require('babel-polyfill');
require("./component/betslip");

let router = require("../../common/js/vue_router.js");
const pages = require("./router_config");
let store = require("./store");

window.onload = function(){
    router.init("raceCourse", {
        vue_config:{
            store: store
        },
        pages: pages,
        default_page: ""
    });
};

