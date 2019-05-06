import Vue from "vue";

require('babel-polyfill');
import './eventView';
import $ from 'jquery';

window.onload = function(){
    $("#header .navigation li").eq(5).addClass('active');
    new Vue({
        el: '#root'
    });
};
