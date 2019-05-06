import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../component/filterBox/companyFilter';
import '../component/filterBox/matchFilter';
import 'component/vueListLazyComponent';
import '../component/matchTeam';
import matchService from '../matchService';
import layDate from 'plugin/laydate/laydate.js';
import _ from 'lodash';
import {
    DOUBLE_YELLOW_TO_RED,
    ENTER_THE_BALL,
    OOLONG_BALL,
    PENALTY_KICK,
    MISS_PENALTY_KICK,
    RED_CARD,
    YELLOW_CARD
} from "constants/matchEventType";
import typeImageMap from './typeImageMap';

// 定义底部显示内容及顺序
const _showType = [
    ENTER_THE_BALL,
    PENALTY_KICK,
    MISS_PENALTY_KICK,
    OOLONG_BALL,
    DOUBLE_YELLOW_TO_RED,
    RED_CARD,
    YELLOW_CARD
];
const ONEDATETIME = 24 * 60 * 60 * 1000; // 一天的毫秒数

let _defSelect = [];                    // 储存所有赛事
let _selectIdArr = [];                  // 储存所有赛事 id

let live = Vue.component('live-view', {
    data() {
        return {
            eventList: [],              // 赛事列表
            activeType: 0,              // 当前 tab 页标识
            leagueArr: [],              // 联赛集合
            arrScreen: ['1', '2', '3'], // 选中的赛事状态
            hideLen: 0,                 // 隐藏的赛事场数
            allSelectVid: [],           // 被选中的赛事 id 数组
            isAllSelect: false,         // 是否全选
            defDate: new Date(),        // 当前日期
            isTenHourBefore: false,     // 是否是10点半前
            hasSelectSt: false,          // 是否部分选中
            exampleList: _showType.map(type => typeImageMap[type])  // 底部tips
        }
    },
    template,
    created() {
        //数据请求处理
        this.toggleActiveHandle();
    },
    methods: {
        /**
         * 切换页面的 tab 事件 0=>即时赛事  1=>完场赛事  2=>未来赛事
         * @param index
         */
        toggleActiveHandle(index) {
            if (this.activeType === index) return;
            // 时间初始化
            this.setDefTime();
            let defDate = this.defDate; // 当天日期
            let newDefDate = '';
            let defDateStr = '';        // 日期字符串
            let reqObj = {};            // 请求参 obj
            index = index || 0;
            switch (index) {
                case 0:                 // 即时赛事
                    defDateStr = defDate.format('yyyy-MM-dd');
                    reqObj = {
                        tabType: "4",
                        from: defDateStr,
                        to: defDateStr
                    };
                    this.setData(reqObj);
                    break;
                case 1:                 // 完场赛事
                    newDefDate = new Date(defDate.getTime() - ONEDATETIME);
                    defDateStr = newDefDate.format('yyyy-MM-dd');
                    reqObj = {
                        tabType: "2",
                        from: defDateStr,
                        to: defDateStr
                    };
                    this.setData(reqObj);
                    break;
                case 2:                 // 未来赛事
                    newDefDate = new Date(defDate.getTime() + ONEDATETIME);
                    defDateStr = newDefDate.format('yyyy-MM-dd');
                    reqObj = {
                        tabType: "3",
                        from: defDateStr,
                        to: defDateStr
                    };
                    this.setData(reqObj);
                    break;
            }
            this.activeType = index;
            this.renderDate();
        },
        /**
         * 赛事保留功能
         */
        retainHandle() {
            if (this.allSelectVid.length <= 0) return;
            let ops = {
                marketVid: this.allSelectVid
            };
            this.eventList = matchService.hideMatch(ops).events;
            this.hideLen = matchService.hideMatch(ops).hideLen;
        },
        /**
         * 完整赛事按钮操作
         */
        closeHideHandle() {
            if (this.hideLen === 0) return;
            let ops = {
                marketVid: _selectIdArr
            };
            this.allSelectVid = [];                     // 清空所有赛事选中状态
            this.isAllSelect = false;                   // 重置全选状态呢
            this.hasSelectSt = false;                   // 重置选有但是不全选的状态
            this.arrScreen = ['1', '2', '3'];           // 重置筛选框的的选中状态
            this.leagueArr = this.leagueArr.slice(0);   // 触发联赛赛筛选框里的选中状态更新
            this.eventList = matchService.hideMatch(ops).events;
            this.hideLen = matchService.hideMatch(ops).hideLen;
        },
        /**
         * 全选功能
         */
        allSelectHandle() {
            this.hasSelectSt = false;
            if (this.isAllSelect) {
                this.isAllSelect = false;
                this.allSelectVid = [];
            } else {
                this.isAllSelect = true;
                this.allSelectVid = _selectIdArr.slice(0);
            }
        },
        /**
         * 数据处理
         */
        setData(reqObj) {
            matchService.getScoreData(reqObj).then((rsp) => {
                this.eventList = rsp.events;
                this.leagueArr = rsp.arrLeague;
                this.hideLen = rsp.hideLen;
                this.allSelectVid = [];
                _selectIdArr = [];
                rsp.events.forEach((el) => {
                    _selectIdArr.push(el.vid);
                });
                // 记录所有赛事
                _defSelect = rsp.events;
            })
        },
        /**
         * 即时赛事页筛选赛事状态
         * @param texType
         */
        screenMarketHandle(texType) {
            let index = this.arrScreen.indexOf(texType);
            if (index !== -1) {
                this.arrScreen.splice(index, 1);
            } else {
                this.arrScreen.push(texType);
            }
            this.eventList = matchService.dealData(this.arrScreen).events;
            this.hideLen = matchService.dealData(this.arrScreen).hideLen;
        },
        /**
         * 赛事筛选回调
         * @param value 选中的赛事信息
         */
        screenHandle(value) {
            let obj = {
                leagueId: value.selectArr,
                eventType: this.arrScreen
            };
            this.eventList = matchService.filterMatch(obj).events;
            this.hideLen = matchService.filterMatch(obj).hideLen;
        },
        /**
         *单场赛事选择回调
         */
        selectHandle(vid) {
            let defArr = this.allSelectVid;
            if (defArr.indexOf(vid) === -1) {
                defArr.push(vid);
            } else {
                defArr.splice(defArr.indexOf(vid), 1);
            }
            this.allSelectVid = defArr;
            this.isAllSelect = _defSelect.length === defArr.length;
            this.hasSelectSt = (defArr.length > 0) && (_defSelect.length !== defArr.length);
        },
        /**
         * 更新event数据
         * @param objUpdate 更新的比赛数据
         */
        updateEventItem(objUpdate) {
            let {vid} = objUpdate;
            let evts = this.eventList;
            if (vid) {
                let evt = _.find(evts, {vid});
                let idx = _.findIndex(evts, {vid});
                evt = Object.assign({}, evt, objUpdate);
                Vue.set(this.eventList, idx, evt);
            }
        },
        /**
         * 渲染日期组件
         */
        renderDate() {
            let {defDate, setData, isTenHourBefore} = this;
            let _defDate = '';
            let _max = -1;      // 允许选择最大的日期
            let _min = -8;      // 允许选择最小的日期
            lay('.dateScreen').each(function (i, el) {
                if (i === 1) {  // 未来赛程日期框
                    _max = 3;
                    _min = 1;
                    _defDate = new Date(defDate.getTime() + ONEDATETIME);
                } else {        // 完场赛事日期框
                    _defDate = new Date(defDate.getTime() - ONEDATETIME);
                }
                // 如果是当天十点半前，则范围需要减一同步
                if (isTenHourBefore) {
                    _max = _max - 1;
                    _min = _min - 1;
                }
                layDate.render({
                    elem: this,
                    theme: "#eb812b",
                    max: _max,
                    min: _min,
                    format: 'yyyy-MM-dd',
                    value: _defDate,
                    showBottom: false,
                    trigger: 'click',
                    done: function (value, date) {
                        let reqObj = {
                            tabType: i === 0 ? '2' : '3',
                            from: value,
                            to: value
                        };
                        setData(reqObj);
                    }
                });
            });
        },
        /**
         * 时间初始化
         */
        setDefTime() {
            this.isTenHourBefore = false;
            let defDate = new Date();       // 当天日期
            let str = defDate.format('yyyy/MM/dd') + ' 10:30';
            let StrDate = new Date(str);
            // 判断当前时间是否大于10点半 若大于10点半则为今天，若小于10点半则为昨天
            if (defDate.getTime() < StrDate.getTime()) {
                defDate = new Date(defDate.getTime() - ONEDATETIME);
                this.isTenHourBefore = true;
            }
            this.defDate = defDate;
        }
    }
});

module.exports = live;