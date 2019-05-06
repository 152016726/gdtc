/**
 * Created by easyLottoMac on 2018/9/17.
 */
import * as ActionTypes from '../../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_HOME_SMG]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}