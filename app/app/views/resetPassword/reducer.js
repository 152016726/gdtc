/**
 * Created by marcus on 2018/11/14.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_RESET_PASSWORD]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}