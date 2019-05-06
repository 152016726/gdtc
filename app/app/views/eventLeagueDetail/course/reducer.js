/**
 * Created by marcus on 2018/12/11.
 */
import * as ActionTypes from '../../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_COURSE]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}