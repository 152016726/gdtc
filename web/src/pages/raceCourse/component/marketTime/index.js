/**
 * Created by easyLottoMac on 2018/10/8.
 */
import template from './index.template';
import Vue from 'vue';

let market_time = Vue.component('market-time', {
   template: template,
   props:{
       shortDate:{       //开赛日期
           default:'09-01'
       },
       startTime:{       //开赛时间
           default: '00:20'
       },
       endShortDate:{    //截止开赛日期
           default: '09-01'
       },
       endTime: {        //截止开赛时间
           default: '00:30'
       },
       isEndTime: {      //是否显示截止开赛时间
           default: false
       }
   },
   created(){}
});

module.exports = market_time;