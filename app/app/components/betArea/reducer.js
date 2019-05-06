import * as ActionTypes from '~/constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_BET_AREA]: (state, action) => {
        return Object.assign({}, state, action.payload)
    }
}