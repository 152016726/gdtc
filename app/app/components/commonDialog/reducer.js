/**
 * Created by DDT on 2018/11/27.
 */

import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_COMMON_DIALOG]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    },
    [ActionTypes.SHOW_COMMON_DIALOG]: (state)=> {
        return Object.assign({}, state, {
            show: true
        });
    },
    [ActionTypes.HIDE_COMMON_DIALOG]: (state)=> {
        return Object.assign({}, state, {
            show: false
        });
    },
    [ActionTypes.TOGGLE_COMMON_DIALOG]: (state, action)=> {
        return Object.assign({}, state, action.payload || {}, {
            show: !state.show
        });
    }
};