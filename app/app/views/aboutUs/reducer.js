import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_ABOUT_US]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}