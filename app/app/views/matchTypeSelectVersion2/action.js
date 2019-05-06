/**
 * Created by owen on 2018/8/10.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from "../../constants/storeKeys";

let actions = {
    changeSomeProps(data){
        return ((dispatch) => {
            dispatch(actions.setData(data))
        })
    },
    setData: createAction(ActionTypes.UPDATE_MATCH_TYPE_SELECT, (obj) => obj),
};
export default actions