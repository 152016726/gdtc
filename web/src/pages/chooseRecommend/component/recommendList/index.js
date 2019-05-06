/**
 * Created by easyLottoMac_Feng on 2019/2/26.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template'
import {odds_WDW} from 'constants/getOddsArr';
import '../../../raceCourse/component/betOutCome';
import {
    WIN_DRAW_WIN,
    HANDICAP_WIN_DRAW_WIN,
    TOTAL_GOALS
} from 'constants/MarketSort';
import {
    odds_TG
} from '../../../../constants/getOddsArr';

module.exports = Vue.component('recommend-list-view', {
   data(){
       return{
           oddArr: [],                      // 赔率 outcome 展示渲染数组
           sort: this.$store.state.sort,    // 选中的玩法 key
           marketKey: '',                   // 胜平负、让球胜平负的 key
           market: {}                       // 选中的赛事
       }
   },
   props: {
       outComes: {      // 选中的晒单注项
           default: function () {
               return []
           }
       },
       matchInfo: {     // 选中的赛事信息
           default: function () {
               return {}
           }
       }
   },
   template,
   created() {
       let {marketList} = this.$store.state;
       this.market = marketList.filter(MF =>
           MF.vid === this.matchInfo.vid
       )[0];
       this.marketKey = this.outComes[0].marketKey;
       this.oddArr = this.marketKey === 'tg'? odds_TG[0]: odds_WDW[0];
   }
});