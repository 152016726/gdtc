/**
 * Created by easyLottoMac_Feng on 2019/2/13.
 */
require('./style.scss');
require('babel-polyfill');
import Vue from "vue";
import $ from 'jquery';
import './peerReviewList';


window.onload = function(){
    $("#header .navigation li").eq(3).addClass('active');
    new Vue({
        el: '#root'
    });
};