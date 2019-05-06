/**
 * Created by marcus on 2018/11/22.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_LOTTERY_SHOP]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}