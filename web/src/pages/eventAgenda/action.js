import Vue from "vue";

require('babel-polyfill');
import './eventAgenda';
import $ from 'jquery';
import util from '@easylotto/util';

window.onload = function(){
    $("#header .navigation li").eq(5).addClass('active');
    $("#root").css({backgroundColor: '#fafafa'});
    new Vue({
        el: '#root',
        data: {
            vid: util.getUrlVars().vid
        }
    });
};
