require('./style.scss');
require('./map');
let $ = require('jquery');
import Vue from 'vue';
import store from '@easylotto/store'
import * as localStoreKeys from '../../constants/localStoreKeys'
window.xxxx = function () {
    console.log(arguments);
}

function initMap() {
    new Vue({
        el: '#bottom',
        data: {}
    });
}

function initEvent() {
    // 设置头部
    $(".navigation li:eq(6)", "#header").addClass('active');
    $('.excellentDot .mc').on('click', function () {
        store.set(localStoreKeys.DOT_INFO, window.DOT_STATIC_DATA.excellentDot);
        window.location.href = '/SMGShopDetails.html';
    });
    $('.starDot ul li').on('click', function () {
        let index = $(this).attr('data-index');
        store.set(localStoreKeys.DOT_INFO, window.DOT_STATIC_DATA.starDot[index]);
        window.location.href = '/SMGShopDetails.html';
    });
}

$(function () {
    initMap();
    initEvent();
    let url = 'https://sapi.k780.com/?app=weather.future&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&jsoncallback=xxxx&weaid=' + encodeURI('广州');
    //$.getScript(url)
});







