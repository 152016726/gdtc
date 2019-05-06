/**
 * Created by marcus on 2018/11/7.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_REGISTER]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}