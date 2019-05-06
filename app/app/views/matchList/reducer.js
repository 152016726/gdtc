import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_SHOW_EVENTS]: (state, action) => {
        return Object.assign({}, state, action.payload)
    },
    [ActionTypes.UPDATE_ALL_EVENTS]: (state, action) => {
        return Object.assign({}, state, action.payload)
    },
    [ActionTypes.UPDATE_SEL_SORT]: (state, action) => {
        return Object.assign({}, state, action.payload)
    },
    [ActionTypes.UPDATE_REFRESH_STATUS]: (state, action) => {
        return Object.assign({}, state, action.payload)
    },
    [ActionTypes.UPDATE_BETSLIP_LIST]: (state, action) => {
        return Object.assign({}, state, action.payload)
    },
    [ActionTypes.UPDATE_SEL_OUTCOME_COUNT]: (state, action) => {
        return Object.assign({}, state, action.payload)
    },
    [ActionTypes.UPDATE_CHOOSE_OUTCOMES]: (state, action) => {
        return Object.assign({}, state, action.payload)
    },
}