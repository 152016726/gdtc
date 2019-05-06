import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import getMatchListService from '../../services/getMatchListService'
import * as storeKey from "../../constants/storeKeys";
import _ from 'lodash';
import util from '../../common/js/util'
import games from '@easylotto/bet';
import MarketSort from '../../constants/MarketSort'

let _innerFn = {
    /**
     * 过滤联赛方法
     * @param data
     * @param selLeague
     * @returns {*}
     */
    filterEventByLeague(data, selLeague) {
        return data.filter((evt) => {
            return selLeague.indexOf(evt.leagueId) !== -1
        })
    },

    /**
     * 过滤赔率区间方法
     * @param data
     * @param selRate
     * @param selSort
     * @returns {*}
     */
    filterEventByRate(data, selRate, selSort) {
        return data.filter((evt) => {
            let mkt = evt.showMarkets[selSort];
            let keys = _.keys(_.pick(mkt, ['homeOdds', 'drawOdds', 'awayOdds']));
            // console.log(keys);
            return keys.every((ocType) => {
                let val = Number(mkt[ocType]);
                let flag;
                //取赔率小于1.5
                if (selRate === '0') {
                    flag = val <= 1.5
                } else if (selRate === '1') {
                    //取赔率大于1.5小于2
                    flag = val >= 1.5 && val <= 2
                } else {
                    //取赔率大于2
                    flag = val >= 2
                }
                return flag;
            });
        })
    },
    /**
     * 根据开赛日期分组赛事
     * @param event
     * @param isFocus
     */
    sortEventByDate(event, isFocus) {
        let data = {};
        let focusData = {};
        let obj = focusData['FOCUS_DATA'] = {};
        obj.list = [];
        util.sortCollection(event,['completeNo']);
        event && event.forEach((item) => {
            let stDate = item.vsDate;
            item.vsDateFmt = `${Date.prototype.parseISO8601(stDate).format('MM-dd')} ${Date.prototype.parseISO8601(stDate).format('hh:mm')}`;
            if (isFocus) {
                obj.list.push(item)
            } else {
                let year = item.completeNo.slice(0, 4);
                let month = item.completeNo.slice(4, 6);
                let day = item.completeNo.slice(6, 8);
                let stDateFmt = `${year}-${month}-${day}`;
                if (!data[stDateFmt]) {
                    let tmp = data[stDateFmt] = {};
                    tmp.list = [];
                }
                data[stDateFmt].list.push(item);
            }
        });
        data = isFocus ? focusData : data;
        // console.log(data);
        return data;
    },
    /**
     * 获取当前events对象中的联赛ID以及联赛名
     * */
    getLeagueList(events) {
        let lidArr = [];
        let leaguelist = [];
        events.forEach((evt) => {
            if (lidArr.indexOf(evt.leagueId) === -1) {
                lidArr.push(evt.leagueId);
                leaguelist.push({
                    lid: evt.leagueId,
                    lname: evt.leagueShortName
                })
            }
        });
        return leaguelist
    },
    /**
     *  返回过滤数据
     *  @param store
     *  @param events
     *  @param filterVal
     *  @param isFocus
     *  @returns {*}
     */
    getFilterList(store, events, filterVal, isFocus) {
        const {selSort} = store;
        let showEvents;
        //首先过滤event层
        if(filterVal.sort === 'dg'){
            events = events.filter((event)=>{
                return Number(event.dgStatus) === 1
            })
        }
        showEvents = events.filter((evt) => {
            let week, number;
            //按singleNo 判断的日期
            // week = util.getWeeks(evt.simpleNo.slice(0, 1));
            // number = evt.simpleNo.slice(1);
            week = util.getWeeks(evt.completeNo.slice(8, 9));
            number = evt.completeNo.slice(9);
            // console.log(week);
            evt.week = week;
            evt.number = number;
            let showMarkets = {}; //真正展示的market
            if (evt.markets) {
                let sortArr = [];
                //针对混合过关
                if (filterVal.sort === 'mix' || filterVal.sort === 'dg') {
                    sortArr = ['wdw', 'hwdw', 'cs', 'tg', 'hft'];
                } else {
                    sortArr.push(filterVal.sort)
                }
                evt.showMarkets = _.pick(evt.markets, sortArr);
            }
            return !util.isEmptyObject(evt.showMarkets)
        });
        //只有胜平负（'WDW'）以及让球胜平负（'HWDW'）才有赔率区间过滤
        if ((selSort === MarketSort.HANDICAP_WIN_DRAW_WIN || selSort === MarketSort.WIN_DRAW_WIN) && filterVal.selRate !== '-') {
            showEvents = _innerFn.filterEventByRate(showEvents, filterVal.selRate, selSort)
        }
        return {
            showEvents: _innerFn.sortEventByDate(showEvents, isFocus),
            filterOps: filterVal,
            count: showEvents.length,
            matchCanSelect: showEvents.length
        };
    }
};

let actions = {
    /**
     * 获取betslip已选注项
     * @returns {Function}
     */
    getbetslipList() {
        return ((dispatch, getState) => {
            let betslipList = games.Betslip.getBetslip();
            dispatch(actions.setBetsilpList({eventCount: betslipList.length}))
        });
    },
    /**
     * 获取投注揽存储的选中注项Key
     * @returns {Function}
     */
    getChooseOutcomes() {
        return ((dispatch, getState) => {
            let outcomeList = games.Betslip.getChooseOutcomes();
            dispatch(actions.setChooseOutcomes({
                outcomeList: outcomeList,
                outcomeCount: outcomeList.length
            }))
        })
    },
    /**
     * 获取赛事列表信息
     * @param isFocus
     * @returns {Function}
     */
    getMatchList(isFocus) {
        return ((dispatch, getState) => {
            const store = getState()[storeKey.MATCH_LIST_STORE];
            const {filterOps} = store;
            let reqData = {
                isFocus: false, ///是否只获取焦点赛事
                include: [],  //需要过滤玩法
                getWay: 'all'
            };
            getMatchListService.getData(Object.assign({}, reqData, {isFocus})).then((data) => {
                //先过滤联赛--玩法--区间
                const {events = []} = data.list || [];
                games.Betslip.initEvent(events);
                let leagueList = _innerFn.getLeagueList(events);
                let showEvents = filterOps.selLeague.length > 0 ? _innerFn.filterEventByLeague(events, filterOps.selLeague) : events;
                let objUpdate = _innerFn.getFilterList(store, showEvents, filterOps, isFocus);
                dispatch(actions.setAllEvents(Object.assign(objUpdate, {
                    allEvents: events,
                    leagueList: leagueList,
                    isRefreshing: false
                })));
            });
        });
    },
    /**
     *赛事过滤方法
     * @param filterVal
     *  @param isFocus
     * @returns {Function}
     */
    handleFilterEvent(filterVal, isFocus) {
        return ((dispatch, getState) => {
            const store = getState()[storeKey.MATCH_LIST_STORE];
            const {allEvents} = store;
            let showEvents = filterVal.selLeague.length > 0 ? _innerFn.filterEventByLeague(allEvents, filterVal.selLeague) : allEvents;
            let updateObj = _innerFn.getFilterList(store, showEvents, filterVal, isFocus);
            dispatch(actions.setShowEvents(updateObj));
            dispatch(actions.setMTSData({matchCanSelect: updateObj.count}))
        })
    },
    /**
     * 更新刷新状态
     * @param obj
     * @returns {Function}
     */
    updateRefreshStatus(obj) {
        return ((dispatch, getState) => {
            dispatch(actions.setRefreshStatus(obj))
        })
    },
    setBetsilpList: createAction(ActionTypes.UPDATE_BETSLIP_LIST, (obj) => obj),
    setChooseOutcomes: createAction(ActionTypes.UPDATE_CHOOSE_OUTCOMES, (obj) => obj),
    /**
     * 更新所有赛事对象方法
     * */
    setAllEvents: createAction(ActionTypes.UPDATE_ALL_EVENTS, (obj) => obj),
    updateCanSelMatch: createAction(ActionTypes.UPDATE_MATCH_TYPE_SELECT, (obj) => obj),
    /**
     * 更新显示赛事对象方法
     */
    setShowEvents: createAction(ActionTypes.UPDATE_SHOW_EVENTS, (obj) => obj),
    /**
     * 更新当前选择的玩法
     */
    updateSelSort: createAction(ActionTypes.UPDATE_SEL_SORT, (obj) => obj),

    setRefreshStatus: createAction(ActionTypes.UPDATE_REFRESH_STATUS, (obj) => obj),

    updateSelectOutcomeCount: createAction(ActionTypes.UPDATE_SEL_OUTCOME_COUNT, (obj) => obj),
    /**
     * 更新赛事涮选
     */
    setMTSData: createAction(ActionTypes.UPDATE_MATCH_TYPE_SELECT, (obj) => obj)
};
export default actions