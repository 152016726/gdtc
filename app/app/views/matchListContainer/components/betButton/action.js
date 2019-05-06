import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'

let actions = {
    /**
     * 更新投注揽信息
     */
    updateBetArea: createAction(ActionTypes.UPDATE_BET_AREA, (obj) => obj)
};
export default actions