/**
 * 比赛服务定义模块
 * Created by DDT on 2018/10/8.
 */

import getMarketList from 'services/getMarketList';
import _ from 'lodash';
import store from '../store';
import CRStore from '../../chooseRecommend/store';
import MarketSort from 'constants/MarketSort';
import oddDealCtrl from 'constants/oddDealCtrl';

let _originData;

let _dealedEvents;

let _sortOps;

let _arrWeekCn = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];

let _noMktKey = '999';  // 没有market时使用的key

module.exports = {
    /**
     * 获取赛事列表
     * @param arrMarket 指定获取的玩法
     * @param dgStatus  是否获取单关
     * @param isOne     是否只获取最近一天赛事
     */
    getMatchData({arrMarket = [], dgStatus = false, isOne = false}) {
        let objReq = {
            getWay: 'all',
            isFocus: false,
            dgStatus: false
        };
        if (arrMarket && arrMarket.length > 0) {
            Object.assign(objReq, {
                getWay: 'include',
                include: arrMarket
            });
        }
        if (dgStatus) {
            Object.assign(objReq, {
                dgStatus: true
            });
        }
        return getMarketList.getData(objReq).then((reqData) => {
            let RQData = reqData.data;
            if (isOne) {
                // 只展示最近一天的赛事信息
                let MinDate = Math.min.apply(Math, RQData.events.map(RD => RD.completeNo)) + '';
                RQData.events = RQData.events.filter(RF => RF.completeNo.substr(0, 8) === MinDate.substr(0, 8));
            }
            this.initData(RQData, isOne);
            return Promise.resolve(this.dealData());
        }, () => {
            return Promise.resolve({});
        });
    },
    initData(data, isOne) {
        let {events = []} = data;
        // 保存初始化
        _originData = data;
        _dealedEvents = null;
        _sortOps = null;
        // 整理投注存储
        // 专家的 store  赛程页的 store
        isOne ? CRStore.dispatch("initEvents", events): store.dispatch("initEvents", events);
    },
    dealData() {
        let objBackData = {};
        let data = _originData;
        let hideLen = 0;                // 隐藏的赛事数量
        if (data) {
            let events = _dealedEvents;
            let {updateTime = ''} = data;
            let grpEvent = {};
            let objWeek = {};           // 记录共有星期key/value
            let objLeague = {};         // 记录联赛对象
            let objHandicap = {};       // 记录handicap
            let isNewSetObj = !events;  // 没有存在处理数据，则为新数据，重置筛选条件
            events = events || data.events || [];
            // 新数据使用默认排序输出
            isNewSetObj && (events = this.sortDefaultMatch());
            // 遍历数据，分类并初始化参数
            events.forEach((item) => {
                let {completeNo, vsDate} = item;
                let difMinute = 3;  // 截止投注时间与投注时间差距
                let number = completeNo.substr(completeNo.length - 3, 3);                       // 赛事number
                let weekCode = parseInt(completeNo.substr(completeNo.length - 4, 1), 10);       // 赛事所属周几
                let strYear = completeNo.substr(0, 4);
                let strMonth = completeNo.substr(4, 2);
                let strDay = completeNo.substr(6, 2);
                let grpDate = `${strYear}-${strMonth}-${strDay}`;
                let week = _arrWeekCn[weekCode];
                // 处理开赛时间
                let stDate = Date.prototype.parseISO8601(vsDate);   //开赛日期
                let longDate = stDate.format('yyyy-MM-dd');
                let shortDate = stDate.format('MM-dd');
                let startTime = stDate.format('hh:mm');
                // 处理截止投注时间
                let endDate = new Date(stDate.getFullYear(), stDate.getMonth(), stDate.getDate(), stDate.getHours(), stDate.getMinutes() - difMinute, 0);
                let endShortDate = endDate.format('MM-dd');
                let endTime = endDate.format('hh:mm');

                Object.assign(item, {
                    number,         // 场次序号 001
                    weekCode,       // 周次序号 0代表周日，1代表周一，如此类推
                    week,           // 周次 周一
                    longDate,       // 长日期  2018-10-10
                    shortDate,      // 短日期  10-10
                    startTime,      // 开赛时间 10:20
                    endShortDate,   // 截止短日期 10-10
                    endTime         // 截止时间 10:20
                });
                // 分组数据
                if (!grpEvent[grpDate]) {
                    grpEvent[grpDate] = {
                        events: [],
                        week,
                        grpDate
                    }
                }
                // 记录数据 begin
                if (isNewSetObj) {
                    objWeek[grpDate] || (objWeek[grpDate] = {id: weekCode, text: week});
                    objLeague[item.leagueId] || (objLeague[item.leagueId] = {
                        id: item.leagueId,
                        text: item.leagueShortName
                    });
                    // 未开售判断
                    if (item.markets[MarketSort.HANDICAP_WIN_DRAW_WIN]) {
                        let handicap = item.markets[MarketSort.HANDICAP_WIN_DRAW_WIN].handicap;
                        // 数据中没有[+]，全部补全handicap有[+]
                        if (handicap && handicap.charAt(0) !== '+' && parseInt(handicap, 10) > 0) {
                            handicap = '+' + handicap;
                            item.markets[MarketSort.HANDICAP_WIN_DRAW_WIN].handicap = handicap;
                        }
                        objHandicap[handicap] || (objHandicap[handicap] = {id: handicap, text: handicap});
                    } else {
                        objHandicap['未开售'] = {id: _noMktKey, text: '未开售'};
                    }
                }
                // 记录数据end
                grpEvent[grpDate].events.push(item);
            });
            hideLen = _originData.events.length - events.length;
            objBackData = Object.assign({
                grpEvent,
                updateTime,
                hideLen
            }, isNewSetObj ? {
                arrWeek: _.values(objWeek),
                arrLeague: _.values(objLeague),
                arrHandicap: _.values(objHandicap)
            } : {});
        }
        return objBackData;
    },
    /**
     * 根据对应赔率内容，对比赛进行排序，这里只做胜平负排序
     * @param key String      对应需要排序的字段：W 胜,D 平,L 负；HW 让球胜，HD 让球平，HL 让球负
     * @param status Number   1升序，-1降序，0返回默认
     */
    sortMatch(key, status) {
        let arrKeys = ['W', 'D', 'L', 'HW', 'HD', 'HL'];
        let events = _dealedEvents || _originData.events;
        if (events && arrKeys.indexOf(key) !== -1 && status !== 0) {
            let objSort = {};   // 排序对象
            // 一位数是胜平负玩法，对应type为key
            if (key.length === 1) {
                objSort.market = MarketSort.WIN_DRAW_WIN;
                objSort.type = key;
                // 两位数是让球胜平负玩法，对应type为key第二位
            } else if (key.length === 2 && key.charAt(0) === 'H') {
                objSort.market = MarketSort.HANDICAP_WIN_DRAW_WIN;
                objSort.type = key.charAt(1);
            }
            let odds = oddDealCtrl.getOdds(objSort.market);
            objSort.key = _.find(odds, {type: objSort.type}).key;
            objSort.status = status;
            // 记录排序对象
            _sortOps = objSort;
            _dealedEvents = this.sortMatchByOps();
            // 恢复默认排序
        } else if (status === 0) {
            _sortOps = null;
            _dealedEvents = null;
        }
        return this.dealData();
    },
    /**
     * 排序赛事，通过排序参数进行
     * @param ops
     */
    sortMatchByOps(ops) {
        let defOps = {
            market: '',   // 排序的赔率的玩法
            key: '',      // 排序的赔率对应key
            status: 0     // 1升序，-1降序，0返回默认
        };
        // 默认排序方式，不传参使用记录的排序方式
        ops = Object.assign({}, defOps, ops || _sortOps || {});

        if (ops.market !== '' && ops.key !== '') {
            let events = _dealedEvents || _originData.events;
            return _.sortBy(events, [(item) => {
                let mkt = item.markets[ops.market];
                if (mkt) {
                    return parseFloat(mkt[ops.key]) * ops.status;
                }
                return 0;
            }]);
        } else {
            return this.sortDefaultMatch();
        }
    },
    /**
     * 默认排序赛事，默认以completeNo排序
     */
    sortDefaultMatch() {
        let events = _dealedEvents || _originData.events;
        return _.sortBy(events, [(item) => {
            return item.completeNo;
        }]);
    },
    /**
     * 过滤比赛
     * @param ops   过滤参数，参考defOps描述
     */
    filterMatch(ops) {
        let defOps = {
            odd: {          // Object 指定赔率过滤条件，为false不作过滤
                min: -1,    // Number 赔率最小值 -1为不限制
                max: -1     // Number 赔率最大值 -1为不限制
            },
            week: false,    // Array  过滤星期几
            handicap: false,// Array  过滤盘口
            leagueId: false,// Array  过滤联赛
            isSingle: false // Boolean 单关状态，为true，过滤掉只有单关；false，不作过滤
        };
        ops = Object.assign({}, defOps, ops || {});

        let events = _originData.events;    // 使用原数据进行过滤
        let oddDeal = oddDealCtrl.getAllConstants();
        // 开始过滤
        _dealedEvents = events.filter((item) => {
            let flag = true;    // 过滤状态
            // 过滤赔率
            if (
                ops.odd &&
                flag &&
                ((ops.odd.min && ops.odd.min !== -1) || (ops.odd.max && ops.odd.max !== -1))
            ) {
                let oddFlag = false;    // 赔率符合要求标志，默认不通过
                // 比较所有market
                for (let mktKey in item.markets) {
                    // 如果已有赔率符合标准则不再进行其他market判断
                    if (!oddFlag) {
                        let mkt = item.markets[mktKey];     // 数据market
                        let odds = _.find(oddDeal, {sort: mktKey}).odds;    // 配置odds
                        // market下所有赔率都要合乎条件
                        oddFlag = odds.some((odd) => {
                            let tarOdd = parseFloat(mkt[odd.key]);
                            return !isNaN(tarOdd) &&
                                (!ops.odd.min || ops.odd.min === -1 || tarOdd >= ops.odd.min) &&
                                (!ops.odd.max || ops.odd.max === -1 || tarOdd <= ops.odd.max)
                        });
                    }
                }
                flag = oddFlag;
            }
            // 过滤星期几
            if (ops.week && flag) {
                flag = ops.week.indexOf(item.weekCode) !== -1;
            }
            // 过滤盘口
            if (ops.handicap && flag) {
                let mkt = item.markets[MarketSort.HANDICAP_WIN_DRAW_WIN];
                if (mkt) {
                    flag = ops.handicap.indexOf(mkt.handicap) !== -1;
                } else {
                    flag = ops.handicap.indexOf(_noMktKey) !== -1;
                }
            }
            // 过滤联赛
            if (ops.leagueId && flag) {
                flag = ops.leagueId.indexOf(item.leagueId) !== -1;
            }
            // 过滤单关比赛
            if (ops.isSingle && flag) {
                flag = item.dgStatus === '1';
            }
            return flag;
        });
        // 保留之前的排序方式进行重排
        _dealedEvents = this.sortMatchByOps();
        return this.dealData();
    }
};
