import * as ActionTypes from '../../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_COMPLETION] : (state, action) => {
        return Object.assign({}, state, action.payload);
    }
}