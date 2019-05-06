import { createAction } from 'redux-actions';
import * as ActionTypes from '../../../constants/ActionTypes';
import * as storeKey from '../../../constants/storeKeys';
import DataManager from '../../../dataManager/commonDataManager';
const SCORE_SETTING = 'ScoreSetting';

let actions = {
    getDataManager(data){
        return ((dispatch, getState) =>{
            let obj = JSON.parse(data)[0];
            // console.log('scoreSetting第二次进入',obj);
            dispatch(actions.updateScoreSetting({
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
    updateInitProps(){
        return((dispatch, getState)=>{
            let { isGoalSoundTips, isGoalShakeTips, isGoalDialog, isFoulSoundTips, isFoulShakeTips,
                isFoulDialog, allGame, favouriteGame, isShowRanking, isShowRedYellowCard,
                isPushMyFavouriteGame} = getState()[storeKey.SCORE_SETTING];
                // console.log('scoreSetting第一次进入',isGoalSoundTips, isGoalShakeTips, isGoalDialog, isFoulSoundTips, isFoulShakeTips,
                //     isFoulDialog, allGame, favouriteGame, isShowRanking, isShowRedYellowCard,
                //     isPushMyFavouriteGame);
            return new Promise((resolve)=>{
                DataManager.clearAll(SCORE_SETTING);
                DataManager.put(SCORE_SETTING,
                    {
                        isGoalDialog:isGoalDialog,
                        isGoalShakeTips:isGoalShakeTips,
                        isGoalSoundTips:isGoalSoundTips,
                        isFoulSoundTips:isFoulSoundTips,
                        isFoulShakeTips:isFoulShakeTips,
                        isFoulDialog:isFoulDialog,
                        allGame:allGame,
                        favouriteGame:favouriteGame,
                        isShowRanking:isShowRanking,
                        isShowRedYellowCard:isShowRedYellowCard,
                        isPushMyFavouriteGame:isPushMyFavouriteGame
                    }
                );
            });


        })
    },
    updateScoreSetting : createAction(ActionTypes.UPDATE_SCORE_SETTING, (dataObj) => dataObj)

};
export default actions