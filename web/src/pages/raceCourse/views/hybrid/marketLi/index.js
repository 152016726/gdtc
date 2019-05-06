/**
 * Created by easyLottoMac on 2018/10/15.
 */

import './index.scss';
import template from './index.template';
import Vue from 'vue';
import {
    CORRECT_SCORES,
    HALF_FULL_TIME,
    TOTAL_GOALS,
    HANDICAP_WIN_DRAW_WIN,
    WIN_DRAW_WIN
} from 'constants/MarketSort';
import '../../../component/moreOddsBut';
import '../../../component/marketNum';
import '../../../component/marketLeague';
import '../../../component/marketTeam';
import '../../../component/marketTime';
import '../../../component/marketRecord';
import '../../../component/marketAverage';
import '../../../component/moreBetCtrlBtn';
import 'component/vueListLazyComponent';
import {odds_WDW} from '../../../../../constants/getOddsArr';

let marketLiHyb = Vue.component('market-li-hyb', {
    data() {
        return {
            isShowOther: false, // 是否展开更多
            sort: '', // 展开更多的展示赛事key
            marketSort: 'HYB',
            WDWOddArr: odds_WDW[0],  //胜平负以及让球胜平负
            CSOddArr: [    //比分
                {key: "h10", title: '1:0'},
                {key: "h20", title: '2:0'},
                {key: "d00", title: '0:0'},
                {key: "d11", title: '1:1'}
            ],
            TGOddArr: [   //总进球
                {key: "goal0", title: '0'},
                {key: "goal1", title: '1'},
                {key: "goal2", title: '2'},
                {key: "goal3", title: '3'}
            ],
            halfOddArr: [   //半全场
                {key: "s33", title: '胜胜'},
                {key: "s31", title: '胜平'},
                {key: "s13", title: '平胜'},
                {key: "s11", title: '平平'}
            ],
            marketCSSort: CORRECT_SCORES, //比分 sort
            marketTGSort: TOTAL_GOALS, //总进球数 sort
            marketHFTSort: HALF_FULL_TIME, //半全场 sort
            marketWDWSort: WIN_DRAW_WIN, //胜平负 sort
            marketHWDWSort: HANDICAP_WIN_DRAW_WIN, //让胜平负 sort
            fnEmitterRender: null,  // 指定直接渲染方法
            fnEmitterCheck: null    // 指定选点判断方式
        };
    },
    props: {
        event: { //赛事列表
            default: {}
        },
        rowNum: { //当前渲染行数下标索引
            default: 0
        },
        isEndTime: {  //是否显示截止时间
            default: false
        }
    },
    template: template,
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

module.exports = marketLiHyb;