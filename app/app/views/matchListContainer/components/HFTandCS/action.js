import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'

let actions = {
    /**
     * 更新投注揽信息
     */
    updateBetArea: createAction(ActionTypes.UPDATE_BET_AREA, (obj) => obj),
    /**
     * 更新投注揽信息
     */
    updateBetSlipList: createAction(ActionTypes.UPDATE_BETSLIP_LIST, (obj) => obj),
    /**
     * 更新弹出窗口
     */
    toggleCommonDialog: createAction(ActionTypes.TOGGLE_COMMON_DIALOG, (obj) => obj),
    /**
     * 更新弹出窗口
     */
    hideCommonDialog: createAction(ActionTypes.HIDE_COMMON_DIALOG)
};
export default actions