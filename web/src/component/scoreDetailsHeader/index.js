/**
 * Created by easyLottoMac on 2018/11/6.
 */
import './index.scss';
import Vue from 'vue';
import tpl from './index.template';
import getScoreDetails from 'services/getEventScoreDetails';
import dict from '@easylotto/dict';
import util from '@easylotto/util';
import pushClient from "@easylotto/push_client";
import Timer from "@easylotto/timer";
import store from '@easylotto/store';
import {MARKET_NAME} from 'constants/localStoreKeys';

const _typeDictKey = 'eventState'; //赛事状态字典 key
const _weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
let _timeArr = ["2", "4", "5", "7"]; //需要展示时间的状态
let _showVsArr = ["0", "1"];

let score_details_header = Vue.component('score-details-header', {
    data() {
        return {
            curVid: '',                         // 当前实际vid
            event: {},                          // 赛事信息
            eventStatus: "0",                   // 赛事状态
            statusText: '',                     // 赛事装态显示内容
            isShowVS: true,                     // 是否不显示比分
            week: '',                           // 星期
            isShowTime: false,                  // 是否显示赛事时间的状态颜色
            isOverEvent: false,                 // 赛事完场状态颜色
            vsDate: "",                         // 开赛时间
            vsTime: '0',                        // 赛事进行时间
            homeGoalsScored: '0',               // 主队比分
            awayGoalsScored: '0',               // 客队比分
            homeHalftimeScored: '0',            // 上半场主队比分
            awayHalftimeScored: '0',            // 上半场客队比分
            vid: '',                            // 赛事 id
            timerTime: -1                       // 定时器真实走时间
        }
    },
    props: {
        htmlType: {      // 当前页面标识：0=>直播，1=>分析，2=>亚盘，3=>欧赔，4=>必发
            default: 0
        }
    },
    template: tpl,
    created() {
        this.isOverEvent = false;
        this.curVid = this.vid;
        if (this.curVid === '') {
            let vars = util.getUrlVars();
            this.curVid = vars.vid;
        }
        let vid = this.curVid;
        this.setPushBind(true);
        getScoreDetails.getData({vid}).then((rsp) => {
            // 是否需要设置赛事信息到store中去
            this.$store && this.$store.dispatch('setEventInfo', rsp.list);
            let {eventState, homeGoalsScored, vsDate, vsTime, awayGoalsScored, homeHalftimeScored, awayHalftimeScored} = rsp.list;
            let stDate = Date.prototype.parseISO8601(vsDate);   // 开赛日期
            this.event = rsp.list;
            this.eventState = eventState;
            this.week = _weekArr[stDate.getDay()];
            this.vsDate = stDate.format('yyyy-MM-dd hh:mm');
            this.vsTime = vsTime;
            this.homeGoalsScored = homeGoalsScored;
            this.awayGoalsScored = awayGoalsScored;
            this.homeHalftimeScored = homeHalftimeScored;
            this.awayHalftimeScored = awayHalftimeScored;
            this.setDefDate();
            let localObj = {
                homeName: rsp.list.homeShortName,
                awayName: rsp.list.awayShortName
            };
            store.set(MARKET_NAME, localObj)
        });
    },
    updated() {
        this.$nextTick(() => {
            // push更新了时间需要同步计时器
            if (+this.vsTime !== this.timerTime) {
                this.setTimer(true);
            }
        });
    },
    methods: {
        /**
         * 设置 push
         * @param isBind
         * @param vid
         */
        setPushBind(isBind) {
            let {curVid} = this;
            if (isBind) {
                this.fnPushOff = pushClient.onEventInfoUpdate(curVid, this.pushUpdate.bind(this));
            } else {
                this.fnPushOff && this.fnPushOff();
                this.fnPushOff = null;
            }
        },
        /**
         * 接收push后的逻辑
         */
        pushUpdate(data) {
            let {homeGoalsScored, awayGoalsScored, homeHalftimeScored, awayHalftimeScored, eventState} = data.actions;
            let vsTime = data.time;
            this.vsTime = vsTime || this.vsTime;
            this.eventState = eventState || this.eventState;
            this.homeGoalsScored = homeGoalsScored || this.homeGoalsScored;
            this.awayGoalsScored = awayGoalsScored || this.homeGoalsScored;
            this.homeHalftimeScored = homeHalftimeScored || this.homeHalftimeScored;
            this.awayHalftimeScored = awayHalftimeScored || this.awayHalftimeScored;
            this.setDefDate();
        },
        /**
         *初始化根据时间展示状态内容
         */
        setDefDate() {
            let {eventState, vsTime} = this;
            let timeMinute = "0"; //比赛时间的分钟
            this.isShowVS = _showVsArr.indexOf(eventState) !== -1;  //判断是否显示 VS
            this.isShowTime = _timeArr.indexOf(eventState) !== -1;  //判断是否显示时间计时器
            this.isOverEvent = eventState === "9"; //判断是否显示完场的状态样式
            timeMinute = Math.floor(vsTime / 60); //比赛时间的分钟
            timeMinute = timeMinute < 2 ? '1': timeMinute;
            let isShowTextTip = false;
            let showText = '';
            isShowTextTip = this.isStateTextShow(eventState);
            //上半场以及下半场的时间状态展示
            switch (eventState) {
                case "2":
                    showText = timeMinute > 45 ? "45+" : timeMinute;
                    break;
                case "4":
                    showText = timeMinute > 90 ? "90+" : timeMinute;
                    break;
                case "5":
                    showText = timeMinute > 105 ? "105+" : timeMinute;
                    break;
                case "7":
                    showText = timeMinute > 120 ? "120+" : timeMinute;
                    break;
                case "8":
                    showText = "";
                    break;
            }
            if (isShowTextTip) {
                //要显示的文字内容提示
                showText = dict.getDictText(_typeDictKey, eventState, "shortText");
            }
            this.statusText = showText;
        },
        /**
         * 是否显示文字不显示时间
         * @param eventState    对应赛事状态
         */
        isStateTextShow(eventState) {
            let textArrId = ["0", "1", "3", "9", "10", "11", "12", "13"]; //需要显示文字提示的状态
            return textArrId.indexOf(eventState) !== -1;
        },
        /**
         * 设置定时器
         * @param isAdd
         */
        setTimer(isAdd) {
            let self = this;
            let {curVid, eventState, vsTime} = this;
            if (!this.isStateTextShow(eventState) && isAdd) {
                Timer.setTimer({
                    key: curVid,
                    startTime: vsTime,
                    callback(duration) {
                        self.timerTime = duration;
                        self.vsTime = duration;
                        self.setDefDate();
                    }
                });
            } else {
                Timer.clearTimer(curVid);
            }
        },
    },
    destroyed() {
        this.setPushBind(false);
        this.setTimer(false);
    },
});

module.exports = score_details_header;
