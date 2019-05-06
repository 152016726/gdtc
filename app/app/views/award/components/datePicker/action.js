import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../../constants/ActionTypes'

let actions = {
    /**
     * 更新通用弹窗属性
     */
    updateCommonDialog: createAction(ActionTypes.UPDATE_COMMON_DIALOG, (obj) => obj),
    /**
     * 更新弹出窗口
     */
    toggleCommonDialog: createAction(ActionTypes.TOGGLE_COMMON_DIALOG, (obj) => obj)
};
export default actions