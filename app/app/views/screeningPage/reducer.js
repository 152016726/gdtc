/**
 * Created by easyLottoMac_Feng on 2018/12/12.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_SCREENINGPAGE]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}