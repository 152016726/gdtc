/**
 * Created by easyLottoMac_Feng on 2018/12/11.
 */

import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys'

import getPeerReviewDetails from '../../../services/getPeerReviewDetails';

const PAGESIZE = '40';            // 每页请求的条数

let actions = {
    /**
     * 数据接口请求
     * @param oddObj            请求参
     * @param pageIndex         请求的页码
     * @param maxHeight
     * @returns {Function}
     */
    getFlatList(oddObj, pageIndex = '0', maxHeight = 0) {
        return ((dispatch, getState) => {
            let {allFlatListData, isSingle,} = getState()[storeKey.PEER_REVIEW_DETAILS_STORE];
            let rspObj = {
                isSingle: isSingle,
                oddsState: '0',
                pageIndex: pageIndex,
                pageSize: PAGESIZE
            };
            allFlatListData = !parseInt(pageIndex) ? [] : allFlatListData;
            if (!oddObj.win && !oddObj.draw && !oddObj.defeat) {
                dispatch(actions.updateData({
                    isNoData: true
                }))
            } else {
                rspObj = Object.assign(rspObj, oddObj || {});
                getPeerReviewDetails.getData(rspObj).then(rsp => {
                    dispatch(actions.updateData({
                        allFlatListData: allFlatListData.concat(rsp.data.list),
                        maxHeight: maxHeight,
                        isNoData: !parseInt(pageIndex) && !(rsp.data.list.length)
                    }))
                })
            }

        })
    },

    /**
     * 筛选单关固定事件
     * @returns {Function}
     */
    singleSelectHandle() {
        return ((dispatch, getState) => {
            let {isSingle, winOdds, flatOdds, loseOdds} = getState()[storeKey.PEER_REVIEW_DETAILS_STORE];
            let rspObj = Object.assign(
                {},
                winOdds && {win: winOdds},
                flatOdds && {draw: flatOdds},
                loseOdds && {defeat: loseOdds}
            );
            dispatch(actions.updateData({
                isSingle: !isSingle,
                pageIndex: 0,
                maxHeight: 0
            }));
            dispatch(actions.getFlatList(rspObj))
        })
    },

    /**
     * 上拉加载更多
     * @param eNative
     * @returns {Function}
     */
    onScrollHandle(eNative) {
        return ((dispatch, getState) => {
            let {pageIndex, MaxHeight, winOdds, flatOdds, loseOdds} = getState()[storeKey.PEER_REVIEW_DETAILS_STORE];
            let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height;         // 计算页面的总高度
            // 确保只有滑到页面底部才开始重新请求数据且只请求一次
            if (parseInt(contentHeight) === parseInt(eNative.contentSize.height) && eNative.contentSize.height > MaxHeight) {
                ++pageIndex;
                dispatch(actions.getFlatList({
                    winOdds, flatOdds, loseOdds
                }, pageIndex, eNative.contentSize.height))
            }
        })
    },

    updateData: createAction(ActionTypes.UPDATE_PEER_REVIEW_DETAILS, (obj) => obj)
};

export default actions