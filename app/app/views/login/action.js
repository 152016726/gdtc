/**
 * Created by marcus on 2018/11/7.
 */
import { createAction } from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    isLoginState(){
        return ((dispatch, getState) => {
            dispatch(actions.updateTitle({ isLogin : true }));
        })
    },
    updateTitle : createAction(ActionTypes.UPDATE_LOGIN, (obj) => obj),
    /**
     * 更新个人信息
     */
    updatePersonal: createAction(ActionTypes.UPDATE_PERSONAL, (obj) => obj),
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
