import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_SCORE_ITEM] : (state, action) => {
        return Object.assign({}, state, action.payload);
    }
}