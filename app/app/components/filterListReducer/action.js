/**
 * Created by mac-ddt on 2018/8/10.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'

let actions = {
    changeSomeState(obj){
        return ((dispatch, getState) => {
            dispatch(actions.setData(obj));
        })
    },
    setData: createAction(ActionTypes.UPDATE_FILTER_LIST, (obj) => obj)
};
export default actions