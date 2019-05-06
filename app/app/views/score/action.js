import { createAction } from 'redux-actions';
import * as ActionTypes from '../../constants/ActionTypes';
import * as storeKey from '../../constants/storeKeys';
import Util from '../../common/js/util';
import getScoreList from '../../services/getScoreList';
import getAttentionMatchList from '../../services/getAttentionMatchList';

let actions = {

    /**
     * 更新日期
     * @param date
     * @returns {function(*, *)}
     */
    handleDate(date){
        return ((dispatch, getState) => {
            dispatch(actions.updateData({
                date : date,
            }));
        });
    },
    /** 筛选比赛
     *
     */
    changeMTSmatchCanSelect(matchCanSelect) {
        return ((dispatch) => {
            dispatch(actions.setMTSData({
                matchCanSelect
            }));
        })
    },
    /**
     * 数组的去重
     * @param array
     * @returns array
     */
    handleDataListFilter(array){
        return ((dispatch) => {
            let r = [];
            for (let i = 0, l = array.length;
                i < l;
                i++) {
                for (let j = i + 1; j < l; j++) {
                    if (array[ i ].lid === array[ j ].lid) {
                        j = ++i;
                    }
                }
                r.push(array[ i ]);
            }
            return r;
        })
    },
    /**
     * 刷新筛选后的各listData
     * @param array 筛选后的联赛id数组
     * @param pageIndex 当前第一选项栏下标
     * @returns {function(*)}
     */
    handFilterListData(array, pageIndex){
        return ((dispatch, getState) => {
            let { dataList, dateScrollIndex } = getState()[ storeKey.SCORE_STORE ];
            let newArr = [];
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < dataList.length; j++) {
                    if (dataList[ j ].leagueId === array[ i ]) {
                        newArr.push(dataList[ j ]);
                    }
                }
            }
            //pageIndex 即时：0   完场：1  赛程：2  关注：3
            if (pageIndex === 0 && dateScrollIndex === 6) {
                //更新当天的即时列表
                dispatch(actions.updateInstantData({
                    instantList : newArr
                }));
            } else if (pageIndex === 1 && dateScrollIndex < 6) {
                //更新昨天的即时列表
                dispatch(actions.updateCompletionData({
                    completionList : newArr
                }));
            } else if (pageIndex === 2 && dateScrollIndex > 6) {
                //更新明天的即时列表
                dispatch(actions.updateGamesData({
                    gamesList : newArr
                }));
            } else if (pageIndex === 3) {
                //更新关注的即时列表
                dispatch(actions.updateAttentionData({
                    attentionList : newArr
                }));
            }

        })
    },
    /**
     * 刷新关注数据 因为跳转不刷新 所以在点击时刷新
     * @returns {function(*=, *)}
     */
    handleAttentionDataRefresh(){
        return ((dispatch, getState) => {
            let { registrationID } = getState()[ storeKey.ROOT_PAGE_STORE ];
            let reqData = { registrationID : registrationID };
            let { dataList } = getState()[ storeKey.SCORE_STORE ];
            let dateArr = Util.getRecentDays();
            new Promise((resolve) => {
                getAttentionMatchList.getData(reqData)
                    .then(data => {
                        let res;
                        if (data) {
                             res = data.data.vids;
                        }

                        if (res.length !== 0) {
                            let defNodeReq = {
                                tabType : 4,
                                to : dateArr[ dateArr.length - 1 ],
                                from : dateArr[ 6 ],
                                vidArray : res
                            };
                            getScoreList.getAttentionData(defNodeReq).then(rsp => {
                                if (rsp.data.events.length > 0) {
                                    for (let i = 0; i < rsp.data.events.length; i++) {
                                        if (rsp.data.events[ i ].isFavourite === undefined) {
                                            rsp.data.events[ i ].isFavourite = true;
                                        }
                                    }
                                    dispatch(actions.updateAttentionData({
                                        attentionList : rsp.data.events,
                                        dataAll : rsp.data.events
                                    }));

                                    dispatch(actions.updateData({
                                        attentionLen : res.length,
                                        dataList : rsp.data.events,
                                        date : ''
                                    }));
                                } else {
                                    dispatch(actions.updateData({
                                        attentionList : [],
                                        attentionLen : 0,
                                        dataList : [],
                                        date : ''
                                    }));
                                    dispatch(actions.updateAttentionData({
                                        attentionList : [],
                                        dataAll : []
                                    }));
                                }
                            }).catch(e => {
                                console.log(e);
                            });
                        }

                    })
                    .catch(e => {
                        console.log(e);
                    });
            })
        })
    },
    //获取关注数量
    handleAttentionDataLenth(){
        return ((dispatch, getState) => {
            let { registrationID } = getState()[ storeKey.ROOT_PAGE_STORE ];
            let reqData = { registrationID : registrationID };
            let dateArr = Util.getRecentDays();
            getAttentionMatchList.getData(reqData)
                .then(data => {
                    let res;
                    if (data) {
                        res = data.data.vids;
                    }

                if (res.length !== 0) {
                    let defNodeReq = {
                        tabType : 4,
                        to : dateArr[ dateArr.length - 1 ],
                        from : dateArr[ 6 ],
                        vidArray : res
                    };

                    getScoreList.getAttentionData(defNodeReq).then(rsp => {
                        if (rsp.data.events.length > 0) {
                            for (let i = 0; i < rsp.data.events.length; i++) {
                                if (rsp.data.events[ i ].isFavourite === undefined) {
                                    rsp.data.events[ i ].isFavourite = true;
                                }
                            }

                            dispatch(actions.updateData({
                                attentionLen : rsp.data.events.length
                            }));
                        } else {
                            dispatch(actions.updateData({
                                attentionLen : 0,
                            }));
                        }
                    }).catch(e => {
                        console.log(e);
                    });
                } else {
                    dispatch(actions.updateData({
                        attentionLen : 0,
                    }));
                }
                }).then(() => {

            })

                .catch(e => {
                    console.log(e);
                });
        })
    },
    updateInstantData : createAction(ActionTypes.UPDATE_INSTANT, (dataObj) => dataObj),
    updateGamesData : createAction(ActionTypes.UPDATE_GAMES, (dataObj) => dataObj),
    updateCompletionData : createAction(ActionTypes.UPDATE_COMPLETION, (dataObj) => dataObj),
    updateAttentionData : createAction(ActionTypes.UPDATE_ATTENTION, (dataObj) => dataObj),
    updateData : createAction(ActionTypes.UPDATE_SCORE, (dataObj) => dataObj),
    setMTSData : createAction(ActionTypes.UPDATE_MATCH_TYPE_SELECT, (obj) => obj)

};
export default actions