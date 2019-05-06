/**
 * Created by marcus on 2018/11/16.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    changeState(obj){
        return (
            (dispatch) => {
                dispatch(actions.updateState(obj))
            }
        )
    },
    updateState: createAction(ActionTypes.UPDATE_PERSONAL_INFORMATION,(obj)=>obj),
    updatePersonal: createAction(ActionTypes.UPDATE_PERSONAL,(obj)=>obj)
};
export default actions