/**
 * Created by easyLottoMac on 2018/10/16.
 */

import * as ActionTypes from '../../../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_LIVE_ALL_DATA]: (state, action) => {
        return Object.assign({}, state, action.payload)
    },
    [ActionTypes.INIT_WORDS_STATE]: (state, action)=>{
        return Object.assign({}, state, action.payload)
    }
}