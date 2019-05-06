/**
 * Created by marcus on 2018/11/28.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    changeState(obj){
        return ((dispatch) => {dispatch(actions.updateState(obj))})
    },
    updateState: createAction(ActionTypes.UPDATE_EVENTLEAGUEINFO,(obj)=>obj),
    updateNextState: createAction(ActionTypes.UPDATE_EVENTLEAGUEDETAIL,(obj)=>obj),
    updateSeasonState: createAction(ActionTypes.UPDATE_SEASONS,(obj)=>obj)
};
export default actions
