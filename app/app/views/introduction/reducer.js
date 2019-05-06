/**
 * Created by mac-ddt on 2018/8/10.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_INTRODUCTION]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}