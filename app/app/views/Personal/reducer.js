/**
 * Created by marcus on 2018/11/15.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_PERSONAL]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}