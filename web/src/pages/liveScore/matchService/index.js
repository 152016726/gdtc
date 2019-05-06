/**
 * Created by easyLottoMac on 2018/11/9.
 */

import getScoreList from 'services/getScoreList';
import _ from 'lodash';

let _originData;

let _dealedEvents;

let _sortOps;

let _arrWeekCn = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];
let _doingEventIDArr = ["2", "3", "4", "5", "6", "7", "8", "10"];   // 正在打的赛事状态 id
let _finishEventIDArr = ["9", "13"];                                // 完场比赛状态 id
let _futureEventIDArr = ["0", "1", "11", "12"];                     // 未开赛的赛事状态 id

module.exports = {
    /**
     * 获取赛事列表
     * @param objReq 赛事筛选条件
     */
    getScoreData(objReq) {
        let defDate = new Date();
        let defDateStr = defDate.getFullYear() + '-' + (defDate.getMonth() + 1 ) + '-' + defDate.getDate();
        let defObjReq = {
            tabType: '4',       // 默认获取所有赛事状态的赛事
            from: defDateStr,   // 默认获取当天的赛事
            to: defDateStr
        };
        if(objReq){
            Object.assign(defObjReq, objReq);
        }
        return getScoreList.getData(defObjReq).then((reqData) => {
            this.initData(reqData.data);
            return Promise.resolve(this.dealData());
        }, () => {
            return Promise.resolve({});
        });
    },
    initData(data){
        let {events=[]} = data;
        // 保存初始化
        _originData = data;
        _dealedEvents = null;
        _sortOps = null;
        // 整理投注存储
        // store.dispatch("initEvents", events);
    },
    /**
     * 赛事数据处理
     * @param eventType String 赛事状态 1=>正在打的赛事 2=>完场赛事 3=>未开赛事
     */
    dealData(eventType) {
        let objBackData = {};
        let data = _originData;
        let hideLen = 0; // 隐藏赛事场数
        eventType = eventType || ['1', '2', '3'];
        if(data){
            let events = _dealedEvents;
            let objLeague = {};         // 记录联赛对象
            let isNewSetObj = !events;  // 没有存在处理数据，则为新数据，重置筛选条件
            events = events || data.events || [];
            // 新数据使用默认排序输出
            events = this.screenMarket(eventType);
            // 遍历数据，分类并初始化参数
            events.forEach((item) => {
                let {completeNo, vsDate} = item;
                let number = completeNo.substr(completeNo.length - 3, 3);                    // 赛事number
                let weekCode = parseInt(completeNo.substr(completeNo.length - 4, 1), 10);    // 赛事所属周几
                let week = _arrWeekCn[weekCode];
                // 处理开赛时间
                let stDate = Date.prototype.parseISO8601(vsDate);   //开赛日期
                let longDate = stDate.format('yyyy-MM-dd');
                let shortDate = stDate.format('MM-dd');
                let startTime = stDate.format('hh:mm');

                Object.assign(item, {
                    number,         // 场次序号 001
                    weekCode,       // 周次序号 0代表周日，1代表周一，如此类推
                    week,           // 周次 周一
                    longDate,       // 长日期  2018-10-10
                    shortDate,      // 短日期  10-10
                    startTime       // 开赛时间 10:20
                });
                // 记录数据 begin
                if(isNewSetObj){
                    let len = events.filter((ev)=>{
                        return ev.leagueId === item.leagueId;
                    }).length;
                    objLeague[item.leagueId] || (objLeague[item.leagueId] = {id: item.leagueId, text: item.leagueShortName, len: len});
                }
            });
            //计算隐藏赛事
            hideLen = _originData.events.length - events.length;
            objBackData = Object.assign({
                events
            },{ hideLen }, isNewSetObj ? {
                arrLeague: _.values(objLeague)
            } : {});
        }
        return objBackData;
    },
    /**
     * 赛事排序
     * @param eventType 不传默认为所有状态的赛事 1=>代表正在打的赛事 2=>代表已完场的赛事 3=>未开赛的赛事
     * @returns {Array}
     */
    screenMarket(eventType){
        let allEvent = [];                                           // 所有赛事
        let doingEvent = this.sortDefaultMatch(_doingEventIDArr);    // 正在打的赛事
        let finishEvent = this.sortDefaultMatch(_finishEventIDArr);  // 完场比赛
        let futureEvent = this.sortDefaultMatch(_futureEventIDArr);  // 未开赛的赛事
        if(eventType.indexOf('1') !== -1){
            allEvent = allEvent.concat(doingEvent);
        }
        if(eventType.indexOf('3') !== -1) {
            allEvent = allEvent.concat(futureEvent);
        }
        if(eventType.indexOf('2') !== -1) {
            allEvent = allEvent.concat(finishEvent);
        }
        return allEvent
    },
    /**
     * 默认排序赛事，默认先以vsDate排序，若 vsDate 相同则以 completeNo来排序
     */
    sortDefaultMatch(sortIdArr) {
        let events = _dealedEvents || _originData.events;
        let sortEvent = events.filter((ev)=>{
            return sortIdArr.indexOf(ev.eventState) !== -1
        });
        return _.sortBy(sortEvent, ['vsDate', 'completeNo'])
    },
    /**
     * 根据联赛过滤比赛
     * @param ops   过滤参数，参考defOps描述
     */
    filterMatch(ops) {
        let defOps = {
            leagueId: false,// Array  过滤联赛
            eventType: ['1', '2', '3']
        };
        ops = Object.assign({}, defOps, ops || {});
        let events = _originData.events;    // 使用原数据进行过滤
        // 开始过滤
        _dealedEvents = events.filter((item) => {
            let flag = true;    // 过滤状态
            // 过滤联赛
            if(ops.leagueId && flag){
                flag = ops.leagueId.indexOf(item.leagueId) !== -1;
            }
            return flag;
        });
        return this.dealData(ops.eventType);
    },
    /**
     * 隐藏指定赛事
     */
    hideMatch(ops){
        let defOps = {
            marketVid:[]
        };
        ops = Object.assign({}, defOps, ops || {});
        let events = _originData.events;    // 使用原数据进行过滤
        // 开始过滤
        _dealedEvents = events.filter((item) => {
            let flag = true;    // 过滤状态
            // 过滤联赛
            if(ops.marketVid && flag){
                flag = ops.marketVid.indexOf(item.vid) !== -1;
            }
            return flag;
        });
        return this.dealData();
    }
};