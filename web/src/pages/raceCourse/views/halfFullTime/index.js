/**
 * Created by easyLottoMac on 2018/10/10.
 */

import './index.scss';
import Vue from 'vue';
import template from './index.template';
import matchService from '../../matchService';
import {HALF_FULL_TIME} from 'constants/MarketSort';
import '../../component/betOutCome';
import '../../component/eventListTitle';
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

let halfFullTime = Vue.component('half-full-time',{
    data(){
        return {
            grpMatch: {},
            updateTime: '',
            isEndTime: false,           // 是否显示截止时间
            isFloatBonus: false,        // 是否显示奖金浮动
            arrWeek: [],                // 比赛有的日期
            arrLeague: [],              // 比赛有的联赛
            hideLen: 0,                 // 隐藏的赛事场数
            hwfArr:[
                {text: '胜-胜', odd: 's33'},
                {text: '胜-平', odd: 's31'},
                {text: '胜-负', odd: 's30'},
                {text: '平-胜', odd: 's13'},
                {text: '平-平', odd: 's11'},
                {text: '平-负', odd: 's10'},
                {text: '负-胜', odd: 's03'},
                {text: '负-平', odd: 's01'},
                {text: '负-负', odd: 's00'}
             ],
            marketHFTSort: HALF_FULL_TIME,
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
            matchService.getMatchData({arrMarket: [HALF_FULL_TIME]}).then((data) => {
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

module.exports = halfFullTime;
