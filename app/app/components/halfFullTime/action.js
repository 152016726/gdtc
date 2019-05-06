import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'

let actions = {
    /**
     * 更新投注揽信息
     */
    updateBetSlipList: createAction(ActionTypes.UPDATE_BETSLIP_LIST, (obj) => obj)
};
export default actions