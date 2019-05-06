/**
 * Created by easyLottoMac on 2018/10/8.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';

let market_team = Vue.component('market-team', {
   data(){
       return {
            textColor:'' //让球数显示的样式
       }
   },
   template: template,
   props:{
       //主队排名
       homeLeagueRank:{
           default: ''
       },
       //主队简称
       homeShortName:{
           default: ''
       },
       //主队全称
       homeName:{
           default: ''
       },
       //客队简称
       awayShortName:{
           default:''
       },
       //客队全称
       awayName:{
           default: ''
       },
       //客队排名
       awayLeagueRank:{
           default:''
       },
       //是否垂直显示
       isVertical: {
           default: false
       },
       //让球数
       handicap: {
           default: '0'
       }
   },
   created(){
       if(this.isVertical){
           //判断让球显示样式
           if(this.handicap.indexOf('+') != -1){
               this.textColor = 'addColor'
           }else if(this.handicap.indexOf('-') != -1){
               this.textColor = 'subColor'
           }
       }
   },
   mounted(){}
});

module.exports = market_team;