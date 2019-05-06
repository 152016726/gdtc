require('./style.scss');
require('./list')
let $ = require('jquery');
import Vue from 'vue';
import store from '@easylotto/store'
import * as localStoreKeys from '../../constants/localStoreKeys'

$(function () {
    $("#header .navigation li").eq(4).addClass('active');
    new Vue({
        el: '#exponent_wrapper'
    });
});







