/**
 * Created by mac-ddt on 2018/8/10.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as eventState from '../../constants/eventState'
import getAwardList from '../../services/getAwardList'
import getMatchListService from '../../services/getMatchListService'
import _ from 'lodash'

let innerFn = {
    /**
     * 将数组分为按日期分组
     * @param arr {Array} 数据数组
     * @param filterObj {Object}  筛选设置对象{leagueId, dataAll} leagueId联赛id数组，dataAll所有备份的所有数据
     */
    initList: function (arr, filterObj) {
        if (filterObj) { //条件过滤
            arr = this.filterArr(filterObj);
        }
        let count = arr.length;  //共多少场比赛已开奖(作用于赛事筛选页)
        let _arr = [];           //按日期分类的赛事数组
        let lArr = [];           //联赛信息数组, 用于赛事筛选
        arr.forEach((ele) => {
            if (ele.eventState != eventState.CANCEL_MATCH) {
                let hadVsDate = false;
                let {date, week} = this.getYMD(ele.completeNo);
                lArr.push({
                    lid: ele.leagueId,
                    lname: ele.leagueShortName
                });
                _arr.forEach((_ele) => {
                    if (_ele.vsDate === date) {
                        _ele.list = _ele.list || [];
                        _ele.list.push(ele);
                        hadVsDate = true;
                    }
                });
                if (!hadVsDate) {
                    _arr.push({
                        vsDate: date,
                        week,
                        list: [
                            ele
                        ]
                    })
                }
            }
        });
        _arr = this.sortArr(_arr);
        lArr = _.uniqBy(lArr, 'lid');
        return {
            arr: _arr,
            lArr,
            count
        };
    },
    /**
     * 排列数组
     */
    sortArr(arr) {
        return arr.sort((a, b) => {
            let aTS = new Date(a.vsDate).getTime();
            let bTS = new Date(b.vsDate).getTime();
            if (aTS > bTS) {
                return -1;
            }
            else {
                return 1;
            }
        })
    },
    /**
     * 根据赛事类型筛选数组
     */
    filterArr(obj) {
        let arr = [];
        arr = _.filter(obj.dataAll, function (o) {
            return obj.leagueId.indexOf(o.leagueId) !== -1;
        });
        return arr;
    },
    /**
     * 截取年月日字符串
     */
    getYMD(dateStr) {
        return {
            date: dateStr.substr(0, 8),
            week: dateStr.substr(-4, 1)
        };
    },
    /**
     * 截取年月日字符串
     */
    getInitDate(arrObj) {
        let date = arrObj.arr[arrObj.arr.length - 1].vsDate;
        let y = date.substr(0, 4);
        let m = date.substr(4, 2);
        let d = date.substr(6, 2);
        return arrObj.arr.length === 0 ? new Date() : Date.prototype.parseISO8601(`${y}-${m}-${d}`);
    },
}
let actions = {
    /**
     * 第一次加载列表
     * @param obj{Object} 请求接口参数
     * @param refreshing{Boolean} 是否设置下拉筛选refreshing
     */
    initAwardList(obj, refreshing) {
        return ((dispatch) => {
            getAwardList.getData(obj).then(rsp => {
                let arrObj = innerFn.initList(rsp.data.list);
                let leagueIdArr = []
                arrObj.lArr.forEach(ele => {
                    leagueIdArr.push(ele.lid);
                });
                let setDataObj = {
                    dataAll: rsp.data.list,
                    leagueId: leagueIdArr,
                    data: arrObj.arr,
                    lArr: arrObj.lArr,
                    showScoreListIndex: 0,
                    matchCanSelect: arrObj.count,
                    initDate: innerFn.getInitDate(arrObj)
                }
                if (refreshing) {
                    setDataObj = {...setDataObj, refreshing: false}
                    dispatch(actions.setData(setDataObj));
                }
                else {
                    dispatch(actions.setData(setDataObj));
                }
            })
        })
    },
    /**
     * 根据赛事类型本地筛选数据
     */
    updateAwardListByMatchType(obj, changeView) {
        return ((dispatch) => {
            let arrObj = innerFn.initList(obj.dataAll, obj);
            if(changeView){
                dispatch(actions.setData({
                    data: arrObj.arr,
                    matchCanSelect: arrObj.count
                }));
            }
            else{
                dispatch(actions.setData({
                    matchCanSelect: arrObj.count
                }));
            }
            return arrObj.count;
        })
    },
    getMarketList() {
        return ((dispatch) => {
            getMatchListService.getData().then(rsp => {
                dispatch(actions.setData({
                    event: rsp.data.events[0]
                }));
            })
        })
    },
    changeSomeProps(data) {
        return ((dispatch) => {
            dispatch(actions.setData(data))
        });
    },
    setData: createAction(ActionTypes.UPDATE_AWARD_LIST, (obj) => obj),
    // setMTSData: createAction(ActionTypes.UPDATE_MATCH_TYPE_SELECT, (obj) => obj)
};
export default actions