/**
 * Created by marcus on 2018/11/28.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    updateState: createAction(ActionTypes.UPDATE_EVENTLEAGUEDETAIL,(obj)=>obj)
};
export default actions
