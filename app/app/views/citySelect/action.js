/**
 * Created by owen on 2018/8/10.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'

let actions = {
    changeSomeProps(data){
        return ((dispatch) => {
            dispatch(actions.setData(data))
        })
    },
    setData: createAction(ActionTypes.UPDATE_CITY_SELECT, (obj) => obj),
};
export default actions