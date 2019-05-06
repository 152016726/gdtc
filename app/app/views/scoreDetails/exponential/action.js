/**
 * Created by easyLottoMac on 2018/10/16.
 */

import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'

let actions = {
    setData: createAction(ActionTypes.UPDATE_SCORE_EXPONENTIAL_LIVE, (obj) => obj),
};

export default actions;