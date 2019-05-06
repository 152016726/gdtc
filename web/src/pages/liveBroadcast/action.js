import $ from "jquery";

require('./style.scss');
require('babel-polyfill');

import pushClient from '@easylotto/push_client';
import pushMethod from 'common/js/pushMethod';
import config from 'common/js/config';
import router from '../../common/js/vue_router.js';
import pages from './router_config';
import store from './store';
import '../../component/scoreDetailsHeader';

// push初始化
pushClient.init({
    isDebug: config.debug,
    pushServer: config.pushServer,
    isAutoConnect: true
}, pushMethod);

window.onload = function(){
    $("#header .navigation li").eq(3).addClass('active');

    router.init("liveBroadcast", {
        vue_config:{
            store: store
        },
        pages: pages,
        default_page: ""
    });
};