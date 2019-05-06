import { createAction } from 'redux-actions'
import * as ActionTypes from '../../../../../constants/ActionTypes'
import * as storeKey from '../../../../../constants/storeKeys';

let actions = {
    updateGoalSound(ele){
        return((dispatch, getState) => {
            dispatch(actions.updateScoreSetting({
                isGoalSoundTips:!ele
            }));
        })
    },
    updateGoalShake(ele){
        return((dispatch, getState) => {
            dispatch(actions.updateScoreSetting({
                isGoalShakeTips:!ele
            }));
        })
    },
    updateGoalDialog(ele){
        return((dispatch, getState) => {
            dispatch(actions.updateScoreSetting({
                isGoalDialog:!ele
            }));
        })
    },
    updateFoulSound(ele){
        return((dispatch, getState) => {
            dispatch(actions.updateScoreSetting({
                isFoulSoundTips:!ele
            }));
        })
    },
    updateFoulShake(ele){
        return((dispatch, getState) => {
            dispatch(actions.updateScoreSetting({
                isFoulShakeTips:!ele
            }));
        })
    },
    updateFoulDialog(ele){
        return((dispatch, getState) => {
            dispatch(actions.updateScoreSetting({
                isFoulDialog:!ele
            }));
        })
    },

    updateScoreSetting : createAction(ActionTypes.UPDATE_SCORE_SETTING, (obj) => obj)

};
export default actions