/**
 * Created by easyLottoMac on 2018/9/26.
 */

import './index.scss';
import Vue from 'vue';
import _ from 'lodash';
import template from './index.template';
import {
    WIN_DRAW_WIN,
    HANDICAP_WIN_DRAW_WIN
} from 'constants/MarketSort';
import matchService from '../../matchService';
import emitter from "@easylotto/emitter";
import {BetslipPosition, START_INTERVAL_RENDER} from "../../../../constants/EmitterKey";
import '../../component/betOutCome';
import '../../component/eventListTitle';
import '../../component/marketNum';
import '../../component/marketLeague';
import '../../component/marketTeam';
import '../../component/marketTime';
import '../../component/marketRecord';
import '../../component/marketAverage';
import '../../component/marketTimeSelect';
import '../../component/matchHeader';
import '../../component/filterBox/oddsFilter';
import '../../component/filterBox/matchFilter';
import '../../component/winDrawWinSelect';
import 'component/vueListLazyComponent';
import '../../component/marketConcede';
import {odds_WDW} from '../../../../constants/getOddsArr';


let win_draw_win = Vue.component('win-draw-win', {
    data() {
        return {
            grpMatch: {},                             // 赛事列表
            updateTime: '',                           // 赛事更新的时间
            isEndTime: false,                         // 是否展示截止时间
            oddStr: odds_WDW[0],                      // 渲染胜平负，让球胜平负 outCome
            marketWDWSort: WIN_DRAW_WIN,              // 胜平负的 sort
            marketHWDWSort: HANDICAP_WIN_DRAW_WIN,    // 让球胜平负的 sort
            isWDW: true,                              // 是否显示胜平负
            isHWDW: true,                             // 是否显示让球胜平负
            isFloatBonus: false,                      // 是否显示奖金浮动
            arrWeek: [],                              // 比赛有的日期
            arrLeague: [],                            // 比赛有的联赛
            arrHandicap: [],                          // 比赛有的中界线
            hideLen: 0,                               // 隐藏的赛事场数
            isFlex: false
        }
    },
    template: template,
    created() {
        // 数据请求
        this.getMarketList();
    },
    updated() {
        emitter.global.emit(BetslipPosition);
        // 开始渲染每个赛事数据
        emitter.global.emit(START_INTERVAL_RENDER);
    },
    methods: {
        /**
         * 通过接口获取赛事列表
         */
        getMarketList() {
            matchService.getMatchData({arrMarket: [WIN_DRAW_WIN, HANDICAP_WIN_DRAW_WIN]}).then((data) => {
                this.grpMatch = data.grpEvent;
                this.updateTime = data.updateTime;
                this.arrWeek = data.arrWeek;
                this.arrLeague = data.arrLeague;
                this.arrHandicap = data.arrHandicap;
                this.hideLen = data.hideLen;
            });
        },
        /**
         * 胜平负以及让球胜平负展示选择事件
         * @param index
         */
        selectMarketHandle(index) {
            switch (index) {
                case 0:
                    this.isWDW = true;
                    this.isHWDW = true;
                    break;
                case 1:
                    this.isWDW = true;
                    this.isHWDW = false;
                    break;
                case 2:
                    this.isHWDW = true;
                    this.isWDW = false;
                    break;
            }
        },
        /**
         * 奖金变化浮窗
         */
        bonusChangeHandle() {
            this.isFloatBonus = !this.isFloatBonus;
        },
        /**
         * 赛事列表刷新时间
         */
        updateHandle() {
            this.getMarketList();
        },
        /**
         *赔率筛选回调
         */
        oddFilterCb(obj) {
            let data = matchService.filterMatch({odd: obj});
            this.grpMatch = data.grpEvent;
            this.hideLen = data.hideLen;
        },
        /**
         *赛事筛选回调
         */
        matchFilterCb(obj) {
            let data = matchService.filterMatch(obj);
            this.grpMatch = data.grpEvent;
            this.hideLen = data.hideLen;
        },
        /**
         * 赛事胜的排序事件
         */
        winHandle(param) {
            this.setMarketSort('W', 'HW', param);
        },
        /**
         * 赛事平的排序事件
         */
        flatHandle(param) {
            this.setMarketSort('D', 'HD', param);
        },
        /**
         * 赛事负的排序事件
         */
        failHandle(param) {
            this.setMarketSort('L', 'HL', param);
        },
        /**
         * 关闭隐藏赛事事件
         */
        closeHiddenHandle() {
            let obj = {
                leagueId: _.map(this.arrLeague, 'id'),
                week: _.map(this.arrWeek, 'id'),
                handicap: _.map(this.arrHandicap, 'id')
            };
            let data = matchService.filterMatch(obj);
            this.grpMatch = data.grpEvent;
            this.hideLen = data.hideLen;
        },
        /**
         * 赛事排序
         * @param sortKey_1  胜平负key W：胜， D:平，L:负
         * @param sortKey_2  让球胜平负key HW： 让球胜， HD:让球平，HL:让球负
         * @param Num
         */
        setMarketSort(sortKey_1, sortKey_2, Num) {
            let sortKey = sortKey_1; //排序的 key
            let statusNum = 0;
            switch (Num) {
                case 1:
                    statusNum = 1;
                    break;
                case 2:
                    statusNum = -1;
                    break;
                case 3:
                    statusNum = 1;
                    sortKey = sortKey_2;
                    break;
                case 4:
                    statusNum = -1;
                    sortKey = sortKey_2;
            }
            this.grpMatch = matchService.sortMatch(sortKey, statusNum).grpEvent;
        },
        /**
         * 头部滚动回调
         */
        callbackHandle(flag) {
            this.isFlex = flag;
        }
    }
});

module.exports = win_draw_win;
