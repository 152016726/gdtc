/**
 * Created by marcus on 2018/12/4.
 */
import * as ActionTypes from '../../../constants/ActionTypes';

export default {
    [ActionTypes.UPDATE_SEASONS]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}