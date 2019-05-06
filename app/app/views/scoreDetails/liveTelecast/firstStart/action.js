/**
 * Created by easyLottoMac on 2018/10/16.
 */

import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../../constants/ActionTypes'
import * as storeKey from '../../../../constants/storeKeys'
import getPlayerListService from '../../../../services/getPlayerListService'
import _ from 'lodash';

//主客阵型配置
let lineConfig = [
    'GK-L', 'GK-CL', 'GK-C', 'GK-CR', 'GK-R',
    'D1-L', 'D1-CL', 'D1-C', 'D1-CR', 'D1-R',
    'D2-L', 'D2-CL', 'D2-C', 'D2-CR', 'D2-R',
    'DM-L', 'DM-CL', 'DM-C', 'DM-CR', 'DM-R',
    'M-L', 'M-CL', 'M-C', 'M-CR', 'M-R',
    'AM-L', 'AM-CL', 'AM-C', 'AM-CR', 'AM-R',
    'A-L', 'A-CL', 'A-C', 'A-CR', 'A-R'
];
let actions = {
    /**
     * 获取球员信息列表
     * @returns {Function}
     */
    getPlayerList(vid) {
        return ((dispatch, getState) => {
            getPlayerListService.getData(vid).then((resData) => {
                const {curType} = getState()[storeKey.SCORE_DETAILS_LIVE_FIRST_STORE];
                let showPlayerInfo = actions.getShowPlayerList(resData.data[curType] || []);
                let lineupObj = actions.getLineupFormat(resData.data);
                const {formation, homeLineCfg, awayLineCfg} = lineupObj;
                // console.log(lineup);
                dispatch(actions.setAllData({
                    playerList: resData.data,
                    showPlayerInfo: showPlayerInfo,
                    lineupFormat: formation,
                    homeLineCfg: homeLineCfg,
                    awayLineCfg: awayLineCfg
                }))
            })
        })
    },
    /**
     * 获取主客阵型对象
     * @param data
     */
    getLineupFormat(data) {
        let formation = {};
        let homeLineCfg, awayLineCfg;
        let lineArr = [];
        for (let team in data) {
            if (data.hasOwnProperty(team)) {
                let teamData = data[team];
                let arr = [];
                let lineData = lineConfig.filter((list) => {
                    let flag = false;
                    for (let i = 0; i < teamData.lineups.length; i++) {
                        let item = teamData.lineups[i];
                        if (list === `${item.positionX}-${item.positionY}`) {
                            flag = true;
                            break;
                        }
                    }
                    return flag
                });
                // console.log(arr);
                lineArr = _.groupBy(lineData, (line) => {
                    return line.split('-')[0]
                });
                for (let val in lineArr) {
                    arr.push(lineArr[val])
                }
                // console.log(arr);
                if (team === "home") {
                    homeLineCfg = arr;
                } else {
                    awayLineCfg = arr.reverse();
                }
                formation[team] = teamData.lineups;
            }
        }
        // console.log(homeLineCfg,awayLineCfg);
        return {
            formation,
            homeLineCfg,
            awayLineCfg
        };
    },
    /**
     * 获取当前显示的球员列表
     * @param data
     */
    getShowPlayerList(data) {
        let showPlayerList = [];
        const {formation = '', lineups = [], lineupsBench = [], coachCnShort} = data;
        if (lineups.length > 0) {
            let newStartinglineup = _.uniq(lineups);
            //插入教练
            newStartinglineup.unshift({
                playerCnShort: coachCnShort,
                shirtnumber: '主教练'
            });
            showPlayerList.push(newStartinglineup, lineupsBench);
        }
        return {
            showPlayerList: showPlayerList,
            formation: formation
        }
    },
    /**
     * 更新页面数据方法
     */
    setAllData: createAction(ActionTypes.UPDATE_STRAT_LINEUP_INFO, (obj) => obj),
    /**
     * 切换显示主客
     */
    changeShowList(type) {
        return ((dispatch, getState) => {
            const {playerList = []} = getState()[storeKey.SCORE_DETAILS_LIVE_FIRST_STORE];
            dispatch(actions.setAllData({
                showPlayerInfo: actions.getShowPlayerList(playerList[type] || []),
                curType: type
            }))
        })
    }
};

export default actions;