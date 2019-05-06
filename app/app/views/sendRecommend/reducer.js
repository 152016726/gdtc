import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_SENDRECOMMEND_STATE]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}