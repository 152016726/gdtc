/**
 * Created by mac-ddt on 2018/9/4.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_BONUS_INFO]: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
    [ActionTypes.UPDATE_OPTIMIZE]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}