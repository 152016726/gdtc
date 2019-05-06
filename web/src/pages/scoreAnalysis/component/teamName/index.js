/**
 * Created by easyLottoMac on 2018/12/4.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';

module.exports = Vue.component('analysis-team-name', {
    data() {
      return {
          isHomeWin: false,
          isAwayWin: false
      }
    },
    props: {
        isDefault: {
            default: false
        },
        redNum: {           //红牌
            default: ''
        },
        yellowNum: {        // 黄牌
            default: ''
        },
        typeNum: {          // 1 => 主 2 => 客
            default: 1
        },
        teamName: {         // 队名全称
            default: ''
        },
        teamShortName: {    // 队名简称
            default: ''
        },
        homeGoalsScored: {  // 主队进球数
            default: ''
        },
        awayGoalsScored: {  // 客队进球数
            default: ''
        }
    },
    template,
    created() {
        if(!this.isDefault){
            this.isHomeWin = this.homeGoalsScored > this.awayGoalsScored;
            this.isAwayWin = this.homeGoalsScored < this.awayGoalsScored;
        }
    }
});