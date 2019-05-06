/**
 * Created by easyLottoMac on 2018/9/28.
 */

import './index.scss';
import Vue from 'vue';
import template from './index.template';
import matchService from '../../matchService';
import {TOTAL_GOALS} from 'constants/MarketSort';
import '../../component/betOutCome';
import '../../component/eventListTitle';
import '../../component/sortButton';
import '../../component/marketNum';
import '../../component/marketLeague';
import '../../component/marketTeam';
import '../../component/marketTime';
import '../../component/marketRecord';
import '../../component/marketAverage';
import '../../component/matchHeader';
import '../../component/marketTimeSelect';
import '../../component/filterBox/oddsFilter';
import '../../component/filterBox/matchFilter';
import 'component/vueListLazyComponent';
import emitter from "@easylotto/emitter";
import {BetslipPosition, START_INTERVAL_RENDER} from "../../../../constants/EmitterKey";
import _ from "lodash";

let totalGoals = Vue.component('total-goals', {
    data(){
        return {
            grpMatch: {},
            updateTime: '',
            isEndTime: false,               // 是否显示截止时间
            isFloatBonus: false,            // 是否显示奖金浮动
            marketTGSort: TOTAL_GOALS,      // 总进球数的 sort
            arrWeek: [],                    // 比赛有的日期
            arrLeague: [],                  // 比赛有的联赛
            hideLen: 0,                     // 隐藏的赛事场数
            TGOddArr: [
                {odd: 'goal0'},
                {odd: 'goal1'},
                {odd: 'goal2'},
                {odd: 'goal3'},
                {odd: 'goal4'},
                {odd: 'goal5'},
                {odd: 'goal6'},
                {odd: 'goal7'}
            ],
            isFlex: false
        }
    },
   template: template,
   created(){
       this.getMarketList();
   },
   updated(){
       emitter.global.emit(BetslipPosition);
       // 开始渲染每个赛事数据
       emitter.global.emit(START_INTERVAL_RENDER);
   },
    methods: {
        /**
         * 通过接口获取赛事列表
         */
        getMarketList(){
            matchService.getMatchData({arrMarket: [TOTAL_GOALS]}).then((data) => {
                this.grpMatch = data.grpEvent;
                this.updateTime = data.updateTime;
                this.arrWeek = data.arrWeek;
                this.arrLeague = data.arrLeague;
                this.hideLen = data.hideLen;
            });
        },
        /**
         * 奖金变化浮窗
         */
        bonusChangeHandle(){
            this.isFloatBonus = !this.isFloatBonus;
        },
        /**
         * 赔率筛选回调
         * @param obj 筛选条件
         */
        oddFilterCb(obj){
            let data = matchService.filterMatch({odd: obj});
            this.grpMatch = data.grpEvent;
            this.hideLen = data.hideLen;
        },
        /**
         * 赛事筛选回调
         * @param obj 筛选条件
         */
        matchFilterCb(obj){
            let filterObj = {
                week: obj.week,
                leagueId: obj.leagueId
            };
            let data = matchService.filterMatch(filterObj);
            this.grpMatch = data.grpEvent;
            this.hideLen = data.hideLen;
        },
        /**
         * 赛事列表刷新时间
         */
        updateHandle(){
            this.getMarketList();
        },
        /**
         * 关闭隐藏赛事事件
         */
        closeHiddenHandle() {
            let obj = {
                leagueId: _.map(this.arrLeague, 'id'),
                week: _.map(this.arrWeek, 'id')
            };
            let data = matchService.filterMatch(obj);
            this.grpMatch = data.grpEvent;
            this.hideLen = data.hideLen;
        },
        /**
         * 头部滚动回调
         */
        callbackHandle(flag){
            this.isFlex = flag;
        }
    }
});

module.exports = totalGoals;
