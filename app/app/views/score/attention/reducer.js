import * as ActionTypes from '../../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_ATTENTION] : (state, action) => {
        return Object.assign({}, state, action.payload);
    }
}