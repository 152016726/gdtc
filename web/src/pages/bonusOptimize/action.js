/**
 * Created by Administrator on 2017/12/13.
 */
import Vue from 'vue';
import store from './store';
import './betProject';
import './betPlan';
import './betResult';

require('babel-polyfill');
require('./style.scss');
let $ = require("jquery");

// 设置Vue
Vue.config.debug = __DEBUG__;
Vue.config.devtools = __DEBUG__;
Vue.config.productionTip = __DEBUG__;

window.onload = function(){
    new Vue({
        el: '#root',
        store
    });
};