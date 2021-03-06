/**
 * Created by easyLottoMac on 2018/10/10.
 */

import './index.scss';
import Vue from 'vue';
import template from './index.template';
import matchService from '../../matchService';
import {WIN_DRAW_WIN} from 'constants/MarketSort';
import emitter from "@easylotto/emitter";
import {BetslipPosition, START_INTERVAL_RENDER} from "../../../../constants/EmitterKey";
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
import '../../component/filterBox/oddsFilter';
import '../../component/filterBox/matchFilter';
import '../../component/marketLi';
import _ from "lodash";

let singleFlex = Vue.component('single-flex', {
    data(){
        return{
            grpMatch: {},
            updateTime:'',
            isEndTime: false,               // 是否显示截止时间
            isFloatBonus: false,            // 是否显示奖金浮动
            marketWDWSort: WIN_DRAW_WIN,    // 胜平负 sort
            arrWeek: [],                    // 比赛有的日期
            arrLeague: [],                  // 比赛有的联赛
            isNoMarket: false,              // 判断是否无赛事
            hideLen: 0,                     // 隐藏的赛事场数
            oddStr:[                        // 渲染胜平负，让球胜平负 outCome
                {odd:"homeOdds", trend:"homeTrend"},
                {odd:"drawOdds", trend:"drawTrend"},
                {odd:"awayOdds", trend:"awayTrend"}
            ],
            isFlex: false
        }
    },
    template: template,
    created(){
        //数据请求
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
            matchService.getMatchData({dgStatus: true}).then((data) => {
                this.grpMatch = data.grpEvent;
                this.updateTime = data.updateTime;
                this.arrWeek = data.arrWeek;
                this.arrLeague = data.arrLeague;
                this.isNoMarket = !(Object.keys(data.grpEvent).length);
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
         * 赛事胜的排序事件
         * @param param 当前选项下标
         */
        winHandle(param){
            this.setMarketSort('W', param);
        },
        /**
         * 赛事平的排序事件
         * @param param 当前选项下标
         */
        flatHandle(param){
            this.setMarketSort('D', param);
        },
        /**
         * 赛事负的排序事件
         * @param param 当前选项下标
         */
        failHandle(param){
            this.setMarketSort('L', param);
        },
        /**
         * 赛事排序
         * @param sortKey  胜平负key W：胜， D:平，L:负
         * @param Num
         */
        setMarketSort(sortKey, Num){
            let statusNum = 0;
            switch (Num) {
                case 1:
                    statusNum = 1;
                    break;
                case 2:
                    statusNum = -1;
                    break;
            }
            this.grpMatch = matchService.sortMatch(sortKey, statusNum).grpEvent;
        },
        /**
         * 头部滚动回调
         */
        callbackHandle(flag){
            this.isFlex = flag;
        }
    }
});

module.exports = singleFlex;
