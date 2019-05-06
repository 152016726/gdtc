/**
 * Created by easyLottoMac on 2018/10/8.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';

let market_num = Vue.component('market-num', {
    props:{
        week: {
            default: ''
        },
        completeNo: {
            default: '001' //赛事编号
        },
        dgStatus: { //单关状态
            default: "0"
        },
        isBottom: { //是否置低展示
            default:false
        }
    },
    template: template
});

module.exports = market_num;