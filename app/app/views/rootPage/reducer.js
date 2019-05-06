/**
 * Created by mac-ddt on 2018/8/9.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_ROOT_PAGE_STORE]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}