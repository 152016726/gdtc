/**
 * Created by easyLottoMac_Feng on 2019/3/7.
 */
require('./style.scss');
require('babel-polyfill');
import $ from "jquery";
import Vue from "vue";
import './contetnView';


window.onload = function(){
    $("#expertHeader .navigation li").eq(2).addClass('active');
    new Vue({
        el: '#root'
    });
};