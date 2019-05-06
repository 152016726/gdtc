/**
 * Created by easyLottoMac_Feng on 2018/12/11.
 */

import * as ActionTypes from '../../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_PEER_REVIEW_DETAILS]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}