/**
 * Created by Administrator on 2017/12/13.
 */
import './style.scss';
import 'babel-polyfill';
import Vue from 'vue';
import '../../component/scoreDetailsHeader';
import '../../component/exponent/list/ah';
import util from '@easylotto/util';
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

window.onload = function () {
    $("#header .navigation li").eq(3).addClass('active');
    new Vue({
        el: '#root',
        data: {
            vid: util.getUrlVars().vid
        }
    });
};



