/**
 * Created by easyLottoMac on 2018/9/28.
 */

import './index.scss';
import Vue from 'vue';
import template from './index.template';
import matchService from '../../matchService';
import '../../component/eventListTitle';
import '../../component/matchHeader';
import '../../component/marketTimeSelect';
import '../../component/filterBox/oddsFilter';
import '../../component/filterBox/matchFilter';
import './marketLi';
import emitter from "@easylotto/emitter";
import {BetslipPosition, START_INTERVAL_RENDER} from "../../../../constants/EmitterKey";
import _ from "lodash";

let hybrid = Vue.component('v-hybrid', {
    data() {
        return {
            updateTime: '',
            grpMatch: {},
            isEndTime: false,                   // 是否显示截止时间
            isFloatBonus: false,                // 是否显示奖金浮动
            arrWeek: [],                        // 比赛有的日期
            arrLeague: [],                      // 比赛有的联赛
            arrHandicap: [],                    // 比赛有的中界线
            hideLen: 0,                         // 隐藏的赛事场数
            oddStr: [                           // 渲染胜平负，让球胜平负 outCome
                {odd: "homeOdds", trend: "homeTrend", text: '胜'},
                {odd: "drawOdds", trend: "drawTrend", text: '平'},
                {odd: "awayOdds", trend: "awayTrend", text: '负'}
            ],
            CSOddArr: [
                {odd: "h10", text: '1:0'},
                {odd: "h20", text: '2:0'},
                {odd: "d00", text: '0:0'},
                {odd: "d11", text: '1:1'}
            ],
            TGOddArr: [
                {odd: "goal0", text: '0'},
                {odd: "goal1", text: '1'},
                {odd: "goal2", text: '2'},
                {odd: "goal3", text: '3'}
            ],
            halfOddArr: [
                {odd: "s33", text: '胜胜'},
                {odd: "s31", text: '胜平'},
                {odd: "s13", text: '平胜'},
                {odd: "s11", text: '平平'}
            ],
            isFlex: false
        }
    },
    template: template,
    created() {
        //接口获取数据
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
            matchService.getMatchData({}).then((data) => {
                this.grpMatch = data.grpEvent;
                this.updateTime = data.updateTime;
                this.arrWeek = data.arrWeek;
                this.arrLeague = data.arrLeague;
                this.arrHandicap = data.arrHandicap;
                this.hideLen = data.hideLen;
            });
        },
        /**
         * 奖金变化浮窗
         */
        bonusChangeHandle() {
            this.isFloatBonus = !this.isFloatBonus;
        },
        /**
         * 赔率筛选回调
         * @param obj 筛选条件
         */
        oddFilterCb(obj) {
            let data = matchService.filterMatch({odd: obj});
            this.grpMatch = data.grpEvent;
            this.hideLen = data.hideLen;
        },
        /**
         * 赛事筛选回调
         * @param obj 筛选条件
         */
        matchFilterCb(obj) {
            let data = matchService.filterMatch(obj);
            this.grpMatch = data.grpEvent;
            this.hideLen = data.hideLen;
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
         * 赛事列表刷新时间
         */
        updateHandle() {
            this.getMarketList();
        },
        /**
         * 头部滚动回调
         */
        callbackHandle(flag){
            this.isFlex = flag;
        }
    }
});

module.exports = hybrid;
