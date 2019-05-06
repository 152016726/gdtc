import $ from "jquery";

/**
 * Created by Administrator on 2017/12/13.
 */
require('./style.scss');
require('babel-polyfill');
require('./component/bottomView');
require('./tabView');

let router = require("../../common/js/vue_router.js");
const pages = require("./router_config");
let store = require("./store");

window.onload = function(){
    $("#expertHeader .navigation li").eq(1).addClass('active');
    router.init("chooseRecommend", {
        vue_config:{
            store: store
        },
        pages: pages,
        default_page: "win_draw_win"
    });
};

