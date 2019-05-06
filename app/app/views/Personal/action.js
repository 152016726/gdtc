/**
 * Created by marcus on 2018/11/15.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    /**
     * 隐藏赛事所有玩法回调
     * @returns {Function}
     */
    hideDialog() {
        return ((dispatch, getState) => {
            dispatch(actions.updateState({
                showDialog: false
            }))
        })
    },
    updateState: createAction(ActionTypes.UPDATE_PERSONAL,(obj)=>obj),
    /**
     * 更新弹出窗口
     */
    updateCommonDialog: createAction(ActionTypes.UPDATE_COMMON_DIALOG, (obj) => obj),

    /**
     * 更新专家信息
     */
    updateEHData: createAction(ActionTypes.UPDATE_EXPERT_HOME, (obj) => obj),
    /**
     * 更新专家个人中心
     */
    updateExpertZone: createAction(ActionTypes.UPDATE_EXPERTZONE, (obj)=>obj)
};
export default actions