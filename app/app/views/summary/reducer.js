/**
 * Created by marcus on 2018/11/27.
 */
import * as ActionTypes from '../../constants/ActionTypes';

export default {
    [ActionTypes.UPDATE_SUMMARY]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}