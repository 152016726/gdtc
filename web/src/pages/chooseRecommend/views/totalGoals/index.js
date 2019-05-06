/**
 * Created by easyLottoMac on 2018/9/28.
 */

import './index.scss';
import Vue from 'vue';
import template from './index.template';
import matchService from '../../../raceCourse/matchService';
import {TOTAL_GOALS} from 'constants/MarketSort';
import '../../../raceCourse/component/betOutCome';
import '../../../raceCourse/component/eventListTitle';
import '../../../raceCourse/component/sortButton';
import '../../../raceCourse/component/marketNum';
import '../../../raceCourse/component/marketLeague';
import '../../../raceCourse/component/marketTeam';
import '../../../raceCourse/component/marketTime';
import '../../../raceCourse/component/marketRecord';
import '../../../raceCourse/component/marketAverage';
import '../../../raceCourse/component/matchHeader';
import '../../../raceCourse/component/marketTimeSelect';
import '../../../raceCourse/component/filterBox/oddsFilter';
import '../../../raceCourse/component/filterBox/matchFilter';
import 'component/vueListLazyComponent';
import emitter from "@easylotto/emitter";
import {BetslipPosition, START_INTERVAL_RENDER} from "constants/EmitterKey";

let cr_totalGoals = Vue.component('choose-recommend-total-goals', {
    data(){
        return {
            grpMatch: {},
            updateTime: '',
            isEndTime: false,  //是否显示截止时间
            isFloatBonus: false, //是否显示奖金浮动
            marketTGSort: TOTAL_GOALS, //总进球数的 sort
            arrWeek: [],          //比赛有的日期
            arrLeague: [],        //比赛有的联赛
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
       // 修改 store值
       this.$store.dispatch('setSort', 'tg');
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
            matchService.getMatchData({arrMarket: [TOTAL_GOALS], isOne: true}).then((data) => {
                this.grpMatch = data.grpEvent;
                this.updateTime = data.updateTime;
                this.arrWeek = data.arrWeek;
                this.arrLeague = data.arrLeague;
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
            this.grpMatch = matchService.filterMatch({
                odd: obj
            }).grpEvent;
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
        },
        /**
         * 赛事列表刷新时间
         */
        updateHandle(){
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

module.exports = cr_totalGoals;