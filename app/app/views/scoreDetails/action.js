/**
 * Created by easyLottoMac on 2018/10/16.
 */

import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'
import getEventScoreDetails from '../../services/getEventScoreDetails'
import getAttentionMatchList from '../../services/getAttentionMatchList'
import getScoreList from '../../services/getScoreList'
import Util from '../../common/js/util';

let actions = {
    /**
     * 每次进入比分详情页面默认不置顶
     * @returns {Function}
     */
    resetData() {
        return ((dispatch, getState) => {
            dispatch(actions.updateState({
                topNum: 190,
                isShowICon: false
            }))
        })
    },
    /**
     * 数据接口请求
     * @returns {Function}
     */
    getScoreData(vid) {
        return ((dispatch, getState) => {
            getEventScoreDetails.getData({vid}).then((rsp) => {
                dispatch(actions.updateState({
                    eventInfo: rsp.data
                }))
            })
        })
    },
    getAllEvent(){
        let date = new Date();
        let dateStr = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
        return ((dispatch, getState) => {
            let defNodeReq = {
                tabType : 4,
                to : dateStr,
                from : dateStr
            };
            let { registrationID } = getState()[storeKey.ROOT_PAGE_STORE];
            let reqData = { registrationID : registrationID };
            //获取比赛列表
            getScoreList.getInstantData(defNodeReq).then(rsp => {
                new Promise((resolve) =>{
                    if (rsp.data.events.length > 0) {
                        resolve(rsp.data.events);
                    }else{
                        resolve([]);
                    }
                }).then((data)=>{
                    dispatch(actions.updateState({
                        eventAll : data
                    }));
                })
            }).catch(e=>{
                console.log('请求错误',e);
            });

        })
    },
    getFavouriteMatch(){
        return ((dispatch,getState)=> {
            let vidsArr = [];
            let dateArr = Util.getRecentDays();
            let { registrationID } = getState()[ storeKey.ROOT_PAGE_STORE ];
            let reqData = { registrationID : registrationID };
            getAttentionMatchList.getData(reqData)
                .then(data => {
                    let res = data.data.vids;
                    if (res) {
                        for (let i = 0;
                            i < res.length;
                            i++) {
                            vidsArr.push(res[ i ]);
                        }
                    }

                    if(vidsArr.length !== 0) {
                        defNodeReq = {
                            tabType : 4,
                            to : dateArr[ dateArr.length - 1 ],
                            from : dateArr[ 6 ],
                            vidArray : vidsArr
                        }
                        //获取以收藏的比赛列表
                        getScoreList.getAttentionData(defNodeReq).then(rsp => {
                            if (rsp.data.events.length > 0) {

                                dispatch(actions.updateState({
                                    favoriteGame : rsp.data.events,
                                }))
                            } else {
                                dispatch(actions.updateState({
                                    favoriteGame : [],
                                }))
                            }
                        }).catch(e => {
                            console.log('数据错误', e);
                        });
                    }else {
                        dispatch(actions.updateState({
                            favoriteGame : []
                        }))
                    }
                })
        })
    },
    getDataManager(data){
        return ((dispatch, getState) =>{
            let obj = JSON.parse(data)[0];
            dispatch(actions.updateState({
                isGoalDialog        :obj.isGoalDialog,
                isGoalShakeTips     :obj.isGoalShakeTips,
                isGoalSoundTips     :obj.isGoalSoundTips,
                isFoulSoundTips     :obj.isFoulSoundTips,
                isFoulShakeTips     :obj.isFoulShakeTips,
                isFoulDialog        :obj.isFoulDialog,
                allGame             :obj.allGame,
            }));
        })
    },
    updateState: createAction(ActionTypes.UPDATE_SCORE_DETAILS, (obj) => obj)
};

export default actions;