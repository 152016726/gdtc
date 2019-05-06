/**
 * Created by Administrator on 2017/12/13.
 */
import './style.scss';
import 'babel-polyfill';
import router from '../../common/js/vue_router.js';
import store from './store';
import '../../component/scoreDetailsHeader';
import './views/viewContent';
import $ from "jquery";
import pushClient from "@easylotto/push_client/index";
import pushMethod from 'common/js/pushMethod';
import config from 'common/js/config';

// push初始化
pushClient.init({
    isDebug: config.debug,
    pushServer: config.pushServer,
    isAutoConnect: true
}, pushMethod);

window.onload =function () {
    $("#header .navigation li").eq(3).addClass('active');
    router.init("scoreAnalysis", {
        vue_config:{
            store: store
        },
        pages: ['viewContent'],
        default_page: ""
    });
};



