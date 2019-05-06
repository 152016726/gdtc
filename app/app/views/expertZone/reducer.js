/**
 * Created by marcus on 2019/1/2.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_EXPERTZONE]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}