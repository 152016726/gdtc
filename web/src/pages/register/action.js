/**
 * Created by feng on 2018/06/11.
 */
require('./style.scss');
require('babel-polyfill');

let router = require("../../common/js/vue_router.js");

window.onload = function(){
    router.init("register", {
        vue_config:{
            store: ''
        },
        pages: ['register_view', 'reset_password'],
        default_page: ''
    });
};