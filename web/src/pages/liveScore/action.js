import Vue from "vue";

require('babel-polyfill');
import './liveView';
import $ from 'jquery';
import pushClient from "@easylotto/push_client/index";
import pushMethod from 'common/js/pushMethod';
import config from 'common/js/config';

// push初始化
pushClient.init({
    isDebug: config.debug,
    pushServer: config.pushServer,
    isAutoConnect: true
}, pushMethod);

window.onload = function(){
    $("#header .navigation li").eq(3).addClass('active');
    new Vue({
        el: '#root'
    });
};
