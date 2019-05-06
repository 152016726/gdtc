import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import {PAGE_SIZE, DEVICER_TYPE} from '../../../constants/articleConfig';
import AttentionDataManager from '../../../dataManager/attentionDataManager';
import getScoreList from '../../../services/getScoreList';
import Util from '../../../common/js/util';
import getAttentionMatchList from '../../../services/getAttentionMatchList';

let actions = {
    /**
     * 数据请求
     * @param pageIndexNum 页码
     * @returns {Function}
     */
    reqData(isCache) {
        return ((dispatch, getState) => {
            let {attentionList} = getState()[storeKey.SCORE_ATTENTION];
            let vidsArr = [];
            let dateArr = Util.getRecentDays();
            let { registrationID } = getState()[storeKey.ROOT_PAGE_STORE];
            let reqData = { registrationID : registrationID };
            // 获取收藏列表的比赛vid
                getAttentionMatchList.getData(reqData)
                    .then(data => {
                        let res;
                        if (data) {
                            res = data.data.vids;
                        }

                        if(res.length !== 0) {
                            let defNodeReq = {
                                tabType : 4,
                                to : dateArr[ dateArr.length - 1 ],
                                from : dateArr[ 6 ],
                                vidArray : res
                            }
                            //获取以收藏的比赛列表
                            getScoreList.getAttentionData(defNodeReq).then(rsp => {
                                if (rsp.data.events.length > 0) {
                                    for (let i = 0; i < rsp.data.events.length; i++) {
                                        if (rsp.data.events[ i ].isFavourite === undefined) {
                                            rsp.data.events[ i ].isFavourite = true;
                                        }
                                    }

                                    dispatch(actions.updateData({
                                        attentionList : rsp.data.events,
                                        dataAll : rsp.data.events
                                    }))
                                }
                            }).catch(e => {
                                console.log('数据错误', e);
                            });
                        }else {
                            dispatch(actions.updateData({
                                attentionList : [],
                                dataAll : []
                            }))
                        }

                        dispatch(actions.updateScoreList());

                    })
                    .catch(e => {
                    });

        })
    },
    /**
     * 数组对比 是否相同
     * @param a 数组
     * @param b
     * @returns {function(*, *)}
     */
    equar(a, b) {
        return ((dispatch, getState) => {
            // 判断数组的长度
            if (a.length !== b.length) {
                return false
            } else {
                // 循环遍历数组的值进行比较
                for (let i = 0; i < a.length; i++) {
                    if (a[i].vid !== b[i].vid) {
                        return false
                    }
                }
                return true;
            }
        })
    },
    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle() {
        return ((dispatch, getState) => {
            dispatch(actions.reqData(true));
            // console.log('下拉刷新');
        })
    },
    /**
     * 筛选时传数据到外层进行筛选操作
     * @returns {function(*, *)}
     */
    updateScoreList() {
        return ((dispatch, getState) => {
            let {dataAll} = getState()[storeKey.SCORE_ATTENTION];

            dispatch(actions.updateScoreData({
                dataList: dataAll
            }));
        })
    },
    updateScoreData: createAction(ActionTypes.UPDATE_SCORE, (dataObj) => dataObj),

    updateData: createAction(ActionTypes.UPDATE_ATTENTION, (dataObj) => dataObj)
};

export default actions