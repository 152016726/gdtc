/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'
import * as storeKey from '~/constants/storeKeys'

import getRecommendationList from '~/services/getRecommendationList';
import getExpertRLeagueList from '~/services/getExpertRLeagueList';
import _ from "lodash";

const PAGESIZE = '20';      // 每页条数

let actions = {
    /**
     * 数据请求
     * @returns {Function}
     */
    getRecommendationData() {
        return ((dispatch, getState) => {
            let {orderBy, type, pageIndex, lids, flatListData} = getState()[storeKey.NEW_RECOMMEND_STORE];
            let reqObj = {
                type,
                orderBy,
                lids,
                pageIndex,
                isHistory: 'false',
                pageSize: PAGESIZE
            };
            flatListData = parseInt(pageIndex) ? flatListData : [];

            getRecommendationList.getData(reqObj).then(rsp => {
                dispatch(actions.updateData({
                    flatListData: flatListData.concat(rsp.data.list),
                    isFooter: rsp.data.list.length < PAGESIZE,
                    isNoRecommend: !(parseInt(pageIndex)) && !(rsp.data.list.length)
                }));
            })
        })
    },

    /**
     * 获取有荐单的联赛列表
     * @returns {Function}
     */
    getExpertRLeagueListData() {
        return ((dispatch, getState) => {
            getExpertRLeagueList.getData().then(rsp => {
                dispatch(actions.updateData({
                    leagueList: rsp.data.list,
                    lids: _.map(rsp.data.list, 'lid')
                }));
                dispatch(actions.getRecommendationData())
            }, err => {
                console.log('LLLLLL', err);
            })
        })
    },

    /**
     * 赛事选择回调
     * @param data
     * @returns {Function}
     */
    selectHandle(data) {
        return ((dispatch, getState) => {
            let dataObj = {
                flatListData: [],
                pageIndex: 0
            };
            let AssObj = data.typeNum ? {
                orderBy: data.statusNum
            } : {
                type: data.statusNum
            };
            dataObj = Object.assign(dataObj, AssObj);
            dispatch(actions.updateData(dataObj));
            dispatch(actions.getRecommendationData())
        })
    },

    /**
     * 上拉加载更多
     * @returns {Function}
     */
    pullUpLoad() {
        return ((dispatch, getState) => {
            let {pageIndex, isFooter} = getState()[storeKey.NEW_RECOMMEND_STORE];
            if (isFooter) return;
            pageIndex++;
            dispatch(actions.updateData({pageIndex}));
            dispatch(actions.getRecommendationData())
        })
    },

    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle() {
        return ((dispatch, getState) => {
            dispatch(actions.updateData({
                pageIndex: '0',
                flatListData: []
            }));
            dispatch(actions.getRecommendationData())
        })
    },

    updateData: createAction(ActionTypes.UPDATE_NEW_RECOMMEND, (obj) => obj)
};

export default actions;