/**
 * Created by marcus on 2018/11/26.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_SOLUTION_INTRO]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}