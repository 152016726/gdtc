import * as ActionTypes from '../../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_INSTANT] : (state, action) => {
        return Object.assign({}, state, action.payload);
    }
}