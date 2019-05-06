/**
 * Created by easyLottoMac on 2018/10/8.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';

let market_average = Vue.component('market-average',{
    template: template,
    props:{
        //赔率信息
        averages: {
            type: Object
        },
        //是否垂直显示
        isVertical: {
            default: false
        }
    },
    created(){}
});

module.exports = market_average;