/**
 * Created by marcus on 2018/11/13.
 */
import {createAction} from 'redux-actions';
import * as ActionTypes from '../../constants/ActionTypes';
import * as storeKey from '../../constants/storeKeys';

let actions = {
    changeState(obj){
        return (
            (dispatch) => {
                dispatch(actions.updateState(obj));
            }
        )
    },
    updateState: createAction(ActionTypes.UPDATE_FORGET_PASSWORD,(obj)=>obj)
};
export default actions