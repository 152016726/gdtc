import Vue from 'vue';
require('babel-polyfill');
import './expertZone';
import $ from 'jquery';
import util from '@easylotto/util';

window.onload= function () {
    $("#expertHeader .navigation li").eq(0).addClass('active');
    new Vue({
        el: '#root',
        data:{
            eid: util.getUrlVars().eid
        }
    });
}