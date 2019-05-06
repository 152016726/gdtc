/**
 * Created by easyLottoMac on 2018/10/8.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';

let market_record = Vue.component('market-record',{
   template: template,
   props:{
       typeNum:{ //选择需要显示的个数，0=> 默认显示4个，1=>显示3个，2=>显示1个
           type: Number,
           default: 0
       },
       vid:{   //联赛 Id
           default: ''
       },
       isOneRow:{  //是否单行展示
           default:false
       },
       winOdds: {
           default: '0.00'
       },
       flatOdds: {
           default: '0.00'
       },
       loseOdds: {
           default: '0.00'
       },
       isPeerReview: {  // 是否展示同奖回查跳转
           default: true
       }
   }
});

module.exports = market_record;
