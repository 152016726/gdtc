import * as ActionTypes from '../../../constants/ActionTypes';

export default {
    [ActionTypes.UPDATE_SCORE_SETTING] : (state, action) => {
        return Object.assign({}, state, action.payload);
    }
}