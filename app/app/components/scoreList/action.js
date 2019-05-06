import { createAction } from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys';
import DataManager from '../../dataManager/commonDataManager';
import getAttentionMatchList from '../../services/getAttentionMatchList';
import getScoreList from '../../services/getScoreList';
import Util from '../../common/js/util';

let actions = {
    getDataManager(data){
      return ((dispatch, getState) =>{
              let obj = JSON.parse(data)[0];
          dispatch(actions.updateScoreList({
                  isGoalDialog        :obj.isGoalDialog,
                  isGoalShakeTips     :obj.isGoalShakeTips,
                  isGoalSoundTips     :obj.isGoalSoundTips,
                  isFoulSoundTips     :obj.isFoulSoundTips,
                  isFoulShakeTips     :obj.isFoulShakeTips,
                  isFoulDialog        :obj.isFoulDialog,
                  allGame             :obj.allGame,
                  favouriteGame       :obj.favouriteGame,
                  isShowRanking       :obj.isShowRanking,
                  isShowRedYellowCard :obj.isShowRedYellowCard,
              }));
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
                                for (let i = 0; i < rsp.data.events.length; i++) {
                                    if (rsp.data.events[ i ].isFavourite === undefined) {
                                        rsp.data.events[ i ].isFavourite = true;
                                    }
                                }

                                dispatch(actions.updateScoreList({
                                    attentionList : rsp.data.events,
                                }))
                            } else {
                                dispatch(actions.updateScoreList({
                                    attentionList : [],
                                }))
                            }
                        }).catch(e => {
                            console.log('数据错误', e);
                        });
                    }else {
                        dispatch(actions.updateScoreList({
                            attentionList : []
                        }))
                    }
                })
        })


    },
    updateScoreList : createAction(ActionTypes.UPDATE_SCORE_ITEM, (obj) => obj)
};
export default actions