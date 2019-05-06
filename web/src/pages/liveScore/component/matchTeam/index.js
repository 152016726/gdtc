import './style.scss';
import template from './index.template';
import Vue from 'vue';
import dict from '@easylotto/dict';
import pushClient from '@easylotto/push_client';
import Timer from '@easylotto/timer';
import '../checkBox';
import '../scoreOverlays';
import '../matchPlus';

const _typeDictKey = 'eventState';          // 赛事状态字典 key

module.exports = Vue.component('match-team', {
    data() {
        return {
            isShowScoreOverlays: false,     // 比分浮窗
            mouseTime: false,               // 比分悬浮计时器
            stateText: '未',                // 状态显示的内容
            isDoing: false,                 // 显示时间的时候的状态判断
            isFinish: false,                // 显示完场状态时的样式
            isHiedScore: true,              // 是否隐藏比分展示
            vidValue: [],
            isSelect: false,
            fnPushOff: null,                // push删除方法
            timerTime: -1                   // 定时器更新的time
        }
    },
    template: template,
    props: {
        event: {                            // 赛事信息
            default: {}
        },
        activeType: {                       // 当前页 type
            default: 0
        },
        allSelectVid: {
            default: []
        },
        selectHandle: {}                    // 父级回调
    },
    created() {
        this.setDefEvent();
        this.setPushBind(true);
        this.setTimer(true);
    },
    watch: {
        event: function () {
            this.setDefEvent();
        },
        allSelectVid: function () {
            this.isSelect = this.allSelectVid.indexOf(this.event.vid) !== -1;
        }
    },
    destroyed() {
        this.setPushBind(false);
        this.setTimer(false);
    },
    updated() {
        this.$nextTick(() => {
            // push更新了时间需要同步计时器
            if (+this.event.vsTime !== this.timerTime) {
                this.setTimer(true);
            }
        });
    },
    methods: {
        /**
         * 赛事选择
         */
        selectMarketHandle() {
            this.isSelect = !this.isSelect;
            this.selectHandle(this.event.vid)
        },
        /**
         * 鼠标滑入滑出开关浮窗
         */
        showScoreOverlays() {
            if (this.isHiedScore) return;
            this.mouseTime = setTimeout(() => {
                this.isShowScoreOverlays = true;
            }, 500)
        },
        hideScoreOverlays() {
            if (this.isHiedScore) return;
            clearTimeout(this.mouseTime);
            this.isShowScoreOverlays = false;
        },
        /**
         * 是否显示文字不显示时间
         * @param eventState    对应赛事状态
         */
        isStateTextShow(eventState) {
            let textArrId = ["0", "1", "3", "9", "10", "11", "12", "13"];   // 需要显示文字提示的状态
            return textArrId.indexOf(eventState) !== -1;
        },
        /**
         * 组件的数据判断显示
         */
        setDefEvent: function () {
            let {eventState, vsTime, vid} = this.event;
            let textArrId = ["0", "1", "3", "9", "10", "11", "12"];         // 需要显示文字提示的状态
            this.isSelect = this.allSelectVid.indexOf(vid) !== -1;          // 判断当前赛事是否允许勾中
            let showNoScoreArr = ["0", "1", "11", "12"];                    // 不需要显示比分的赛事状态
            let showText, timeMinute;
            if (textArrId.indexOf(eventState) !== -1) {
                showText = dict.getDictText(_typeDictKey, eventState, "shortText");
                this.isDoing = false;
            } else {
                timeMinute = Math.floor(vsTime / 60);
                timeMinute = timeMinute < 2 ? '1' : timeMinute;
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
                this.isDoing = true;
            }
            this.stateText = showText;
            this.isFinish = eventState === "9";
            this.isHiedScore = showNoScoreArr.indexOf(eventState) !== -1;
        },
        /**
         * 设置定时器
         * @param isAdd
         */
        setTimer(isAdd) {
            let self = this;
            let {vid, eventState, vsTime} = this.event;
            if (!this.isStateTextShow(eventState) && isAdd) {
                Timer.setTimer({
                    key: vid,
                    startTime: +vsTime,
                    callback(duration) {
                        self.timerTime = duration;
                        self.pushUpdate({
                            vid,
                            vsTime: duration
                        });
                    }
                });
            } else {
                Timer.clearTimer(vid);
            }
        },
        /**
         * push绑定以及解绑
         * @param isBind
         */
        setPushBind(isBind) {
            let {vid} = this.event;
            if (isBind) {
                this.fnPushOff = pushClient.onEventInfoUpdate(vid, this.pushUpdate.bind(this));
            } else {
                this.fnPushOff && this.fnPushOff();
                this.fnPushOff = null;
            }
        },
        /**
         * 更新内容操作
         * @param data
         */
        pushUpdate(data) {
            let pushObj;
            if (data.actions) {
                pushObj = data.actions;
                pushObj.vid = data.vid;
                if (data.time) {
                    pushObj.vsTime = data.time;
                }
            } else {
                pushObj = data;
            }
            this.$emit('updateEventItem', pushObj);
        }
    }
});