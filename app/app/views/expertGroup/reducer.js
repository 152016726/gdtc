/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */

import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_EXPERT_GROUP]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}