/**
 * Created by ljx on 2018/11/13.
 */
import * as ActionTypes from '../../constants/ActionTypes';

export default {
    [ActionTypes.UPDATE_FORGET_PASSWORD]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}