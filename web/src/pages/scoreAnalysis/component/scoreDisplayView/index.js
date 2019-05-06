/**
 * Created by easyLottoMac_Feng on 2018/12/20.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';

module.exports = Vue.component('analysis-score-display-view', {
    data() {
        return {
            isHomeWin: false,
            isAwayWin: false
        }
    },
    template,
    props: {
        isVertical: {               // 是否垂直展示，默认 false
            default: false
        },
        homeGoalsScored: {          // 主队进球数
            default: '0'
        },
        awayGoalsScored: {          // 客队进球数
            default: '0'
        },
        homeHalftimeScored: {       // 主队半场进球数
            default: '0'
        },
        awayHalftimeScored: {       // 客队半场进球数
            default: '0'
        }

    },
    created() {
        this.isHomeWin = this.homeGoalsScored > this.awayGoalsScored;
        this.isAwayWin = this.homeGoalsScored < this.awayGoalsScored;
    }
});