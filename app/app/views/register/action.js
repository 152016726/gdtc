/**
 * Created by marcus on 2018/11/7.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    changeState(obj){
        return (
            (dispatch) => {
                dispatch(actions.updateState(obj));
            }
        )
    },
    /**
     * 更新个人信息
     */
    updatePersonal: createAction(ActionTypes.UPDATE_PERSONAL, (obj) => obj),
    updateState: createAction(ActionTypes.UPDATE_REGISTER,(obj)=>obj)
};
export default actions
