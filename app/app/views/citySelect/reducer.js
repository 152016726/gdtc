/**
 * Created by owen on 2018/8/10.
 */
import * as ActionTypes from '../../constants/ActionTypes'

export default {
    [ActionTypes.UPDATE_CITY_SELECT]: (state, action)=> {
        return Object.assign({}, state, action.payload);
    }
}