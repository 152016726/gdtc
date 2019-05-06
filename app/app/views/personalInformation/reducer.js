/**
 * Created by marcus on 2018/11/16.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_PERSONAL_INFORMATION]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}