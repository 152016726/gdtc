/**
 * Created by mac-ddt on 2018/8/10.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import getExponentDataService from '../../services/getExponentDataService'
import getCompanies from '../../services/getCompanies'
import Util from "../../common/js/util"
import _ from 'lodash'

let innerFn = {
    getLeagueList(events) {
        let arr = [];
        let arrLeagueId = [];
        events.forEach((ele) => {
            if (arrLeagueId.indexOf(ele.leagueId) === -1) {
                arr.push({
                    lid: ele.leagueId,
                    lname: ele.leagueShortName
                });
                arrLeagueId.push(ele.leagueId);
            }
        });
        return arr;
    },
    getCompaniesList(companies) {
        let arr = [];
        companies.forEach((ele) => {
            arr.push({
                text: ele.cnShort,
                id: ele.cid
            })
        });
        return arr;
    }
}
let actions = {
    getExponentData(obj) {
        return ((dispatch, getState) => {
            //获取前三后七日期数组
            let dateList = Util.getRecentDays();
            getExponentDataService.getData(obj).then((data) => {
                const {events = []} = data.data;
                let leagueList = innerFn.getLeagueList(events);
                dispatch(actions.setAllData({
                    eventsAll: events,
                    events,
                    dateList,
                    leagueList,
                    count: events.length,
                }));
                // dispatch(actions.setMTSData({
                //     matchCanSelect: events.length
                // }));
            });
        });
    },
    getCompanies() {
        return ((dispatch, getState) => {
            getCompanies.getData({
                isMain: true,
                markets: 'wdw'
            }).then((rsp) => {
                let list = innerFn.getCompaniesList(rsp.data.companies);
                let index = _.findIndex(list, function (o) { //中国竞彩的index，亚盘没有中国竞彩
                    return o.id === '1';
                });
                let index_lb = _.findIndex(list, function (o) { //立博的index，立博放在后面
                    return o.id === '2';
                });
                let lb = list.splice(index_lb, 1);
                list = list.concat(lb);
                let listWDW = [...list];
                list.splice(index, 1);
                let listAH = list;
                dispatch(actions.setAllData({
                    companiesWDW: listWDW,
                    companiesAH: listAH
                }));
            })
        });
    },
    changeSomeProps(data) {
        return ((dispatch) => {
            dispatch(actions.setAllData(data));
        });
    },
    changeMTSmatchCanSelect(matchCanSelect) {
        return ((dispatch) => {
            dispatch(actions.setAllData({
                count: matchCanSelect
            }));
            // dispatch(actions.setMTSData({
            //     matchCanSelect
            // }));
        })
    },
    setAllData: createAction(ActionTypes.UPDATE_EXPONENT_DATA, (obj) => obj),
    setMTSData: createAction(ActionTypes.UPDATE_MATCH_TYPE_SELECT, (obj) => obj)
};
export default actions