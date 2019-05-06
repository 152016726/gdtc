/**
 * Created by easyLottoMac on 2018/10/11.
 */

import './index.scss';
import template from './index.template';
import Vue from 'vue';
import {
    WIN_DRAW_WIN,
    HANDICAP_WIN_DRAW_WIN,
    CORRECT_SCORES,
    TOTAL_GOALS,
    HALF_FULL_TIME
} from 'constants/MarketSort';
import '../moreOddsBut';
import '../marketNum';
import '../marketLeague';
import '../marketTeam';
import '../marketTime';
import '../marketRecord';
import '../marketAverage';
import '../moreBetCtrlBtn';
import 'component/vueListLazyComponent';
import '../marketConcede';
import {odds_WDW} from '../../../../constants/getOddsArr';

let marketLi = Vue.component('market-li', {
    data() {
        return {
            isShowOther: false, // 是否展开更多
            sort: '', // 展开更多的展示赛事key
            marketWDWSort: WIN_DRAW_WIN, //胜平负 sort
            marketHWDWSort: HANDICAP_WIN_DRAW_WIN, //胜平负 sort
            WDWOddArr: odds_WDW[0]  //胜平负以及让球胜平负
        }
    },
    props: {
        marketSort: {  //赛事 sort
            default: ''
        },
        event: { //赛事列表
            default: {}
        },
        rowNum: { //当前渲染行数下标索引
            default: 0
        },
        isEndTime: {  //是否显示截止时间
            default: false
        },
        minHeight: {
            default: 0
        }
    },
    template: template,
    created() {
    },
    computed: {
        selectedBet: function () {
            let selectedBet = {};
            let betslip = this.$store.state.betslip;
            // 判断当场赛事是否有选中的 outcome
            let newBetsLip = betslip.filter((bli, i) => {
                return this.event.vid === bli.matchInfo.vid;
            });
            if (newBetsLip.length > 0) {
                //选中的比分的 outcome 数量
                selectedBet.CSBets = newBetsLip[0].outcomes.filter((cb, i) => {
                    return cb.marketKey === CORRECT_SCORES
                }).length;
                //选中的总进球的 outcome 数量
                selectedBet.TGBets = newBetsLip[0].outcomes.filter((cb, i) => {
                    return cb.marketKey === TOTAL_GOALS
                }).length;
                //选中的半全场的 outcome 数量
                selectedBet.HFTBets = newBetsLip[0].outcomes.filter((cb, i) => {
                    return cb.marketKey === HALF_FULL_TIME
                }).length;
                selectedBet.allBets = selectedBet.CSBets + selectedBet.TGBets + selectedBet.HFTBets;
            }
            return selectedBet;
        }
    },
    methods: {
        /**
         * 点击展开收起事件
         * @param active 收起展开状态
         * @param sort  要显示的赛事 key
         */
        clickMoreBetBtnCb(active, sort) {
            this.isShowOther = active;
            this.sort = sort;
        }
    }
});

module.exports = marketLi;