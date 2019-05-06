/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */

import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_NEW_RECOMMEND]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}