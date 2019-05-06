/**
 * Created by marcus on 2019/1/4.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_EXPERT_RANK]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}