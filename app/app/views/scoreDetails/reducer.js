/**
 * Created by easyLottoMac on 2018/10/16.
 */

import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_SCORE_DETAILS]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}