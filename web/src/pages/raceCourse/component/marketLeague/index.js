/**
 * Created by easyLottoMac on 2018/10/8.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';

let market_league = Vue.component('market-league', {
   template: template,
    props:{
        leagueName: { //联赛名的简称
            default: '英超'
        },
        leagueColor: {  //联赛的背景色，接口返回不带#
            default: 'eb812b'
        },
        leagueShortName: {   //联赛名的简称
            default: '英格兰超级联赛'
        },
        leagueId: { //联赛Id
            default: '123456'
        },
        isTop:{  //是否置顶展示
            default: false
        }
    },
   created(){}
});

module.exports = market_league;