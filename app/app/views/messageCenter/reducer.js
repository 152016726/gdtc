/**
 * Created by easyLottoMac_Feng on 2019/3/5.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_MESSAGECENTER]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}