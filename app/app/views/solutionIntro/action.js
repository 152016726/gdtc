/**
 * Created by marcus on 2018/11/26.
 */
import {createAction} from 'redux-actions';
import * as ActionTypes from '../../constants/ActionTypes';
import * as storeKey from '../../constants/storeKeys';

let actions = {
    changeState(obj){
        return (
            (dispatch) => {
                dispatch(actions.updateState(obj))
            }
        )
    },
    updateState: createAction(ActionTypes.UPDATE_SOLUTION_INTRO,(obj)=>obj)
};
export default actions