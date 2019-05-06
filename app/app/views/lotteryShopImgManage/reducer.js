/**
 * Created by owen on 2019/03/05.
 */
import * as ActionTypes from "../../constants/ActionTypes";

export default {
    [ActionTypes.UPDATE_LOTTERY_SHOP_IMG_MANAGE]: (state, action) => {
        return Object.assign({}, state, action.payload);
    }
}