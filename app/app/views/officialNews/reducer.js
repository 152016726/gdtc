/**
 * Created by easyLottoMac_Feng on 2019/1/21.
 */
import * as ActionTypes from '~/constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_OFFICIALNEWS]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}