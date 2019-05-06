import Vue from "vue";

require('babel-polyfill');
import './expertView';
import $ from 'jquery';

window.onload = function(){
    $("#expertHeader .navigation li").eq(0).addClass('active');
    new Vue({
        el: '#root'
    });
};
