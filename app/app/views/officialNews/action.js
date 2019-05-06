/**
 * Created by easyLottoMac_Feng on 2019/1/21.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'
import * as storeKey from '~/constants/storeKeys'

let actions = {

    updateData:createAction(ActionTypes.UPDATE_EVENTINFORMATION,(informationObj)=>informationObj)
};
export default actions