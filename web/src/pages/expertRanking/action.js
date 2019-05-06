/**
 * Created by easyLottoMac_Feng on 2019/3/11.
 */
require('./style.scss');
require('babel-polyfill');
import $ from "jquery";
import Vue from "vue";
import './contentView';

window.onload = function(){
    $("#expertHeader .navigation li").eq(3).addClass('active');
    new Vue({
        el: '#root'
    });
};