import { createAction } from 'redux-actions'
import * as ActionTypes from '../../../../../constants/ActionTypes'
import * as storeKey from '../../../../../constants/storeKeys';

let actions = {
    updateAllGame(ele){
        return((dispatch, getState) => {
            let { favouriteGame } = getState()[ storeKey.SCORE_SETTING ];
            dispatch(actions.updateScoreSetting({
                allGame:!ele,
                favouriteGame:!favouriteGame
            }));
        })
    },
    updateFavouriteGame(ele){
        return((dispatch, getState) => {
            let { allGame } = getState()[ storeKey.SCORE_SETTING ];
            dispatch(actions.updateScoreSetting({
                favouriteGame:!ele,
                allGame: !allGame
            }));
        })
    },

    updateScoreSetting : createAction(ActionTypes.UPDATE_SCORE_SETTING, (obj) => obj)

};
export default actions