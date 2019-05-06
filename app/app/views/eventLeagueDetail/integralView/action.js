/**
 * Created by marcus on 2018/11/28.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys'

import getIntegralData from '../../../services/getIntegral';
import getSeasonList from '../../../services/getSeasonsList';

let actions = {
    /**
     * 赛季数据的请求
     * @param lid       联赛 Id
     * @param seasonId  赛季 Id
     * @returns {Function}
     */
    getSeasonData(lid, seasonId) {
        return ((dispatch, getState) => {
            let integralsArr = [];
            getSeasonList.getData({lid}).then((rsp) => {
                let season = rsp.list.list.filter((li) => {
                    return li.seasonId === seasonId;
                })[0];
                if (season.isHasScoreboard === 'true') {
                    integralsArr.push({
                        integralName: '总积分',
                        integralType: '1',
                        integralId: season.seasonId
                    });
                }
                dispatch(actions.updateState({
                    integralsArr
                }));
                dispatch(actions.getStagesData());
            })
        })
    },

    /**
     * 阶段数据请求
     * @returns {Function}
     */
    getStagesData() {
        return ((dispatch, getState) => {
            let {stageList} = getState()[storeKey.COURSE_STORE];
            let {integralsArr} = getState()[storeKey.INTEGRALVIEW_STORE];
            stageList.forEach((stage) => {
                if (stage.isHasScoreboard === 'true') {
                    integralsArr.push({
                        integralName: stage.stageName + '总积分',
                        integralType: '2',
                        integralId: stage.stageId
                    })
                }
            });
            dispatch(actions.updateState({
                integralsArr: integralsArr.concat([])
            }));
            dispatch(actions.getDataList(integralsArr[0]))
        })
    },

    /**
     * 积分数据请求
     * @param integral
     * @returns {Function}
     */
    getDataList(integral) {
        return ((dispatch, getState) => {
            if (!!integral.integralType && !!integral.integralId) {
                getIntegralData.getData({
                    type: integral.integralType,            // 积分榜类型, 1: 赛季, 2: 阶段, 3: 轮次"
                    id: integral.integralId                 // 赛季, 或阶段, 或轮次的id
                }).then((rsp) => {
                    dispatch(actions.updateState({
                        dataList: rsp.data.list,
                        colorsArr: rsp.data.colors
                    }));
                })
            }

        })
    },

    updateState: createAction(ActionTypes.UPDATE_INTEGRALVIEW, (obj) => obj)
};
export default actions
