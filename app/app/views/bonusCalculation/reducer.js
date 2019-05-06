/**
 * Created by mac-ddt on 2018/9/4.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_CALCULATION]: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
    [ActionTypes.UPDATE_IS_SHOW_MORE]: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
    [ActionTypes.UPDATE_SELECT_COMBO]: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
    [ActionTypes.UPDATE_MSTICKN_LIST]: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
    [ActionTypes.UPDATE_BET_TIMES]: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
    [ActionTypes.UPDATE_BONUS_INFO]: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
    [ActionTypes.UPDATE_STICK_ALL]: (state, action) => {
        return Object.assign({}, state, action.payload);
    },
}