/**
 * Created by mac-ddt on 2018/9/3.
 */
import * as ActionTypes from '../../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_WINNING]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}