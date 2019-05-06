/**
 * Created by marcus on 2018/11/28.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_EVENTCENTER]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}