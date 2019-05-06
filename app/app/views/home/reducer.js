/**
 * Created by mac-ddt on 2018/8/14.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_HOME]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}