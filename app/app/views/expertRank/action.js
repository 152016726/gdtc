/**
 * Created by marcus on 2019/1/4.
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
    updateState: createAction(ActionTypes.UPDATE_EXPERT_RANK, (obj)=>obj)
};
export default actions