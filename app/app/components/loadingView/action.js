/**
 * Created by ycl on 16/7/8.
 */

import { createAction } from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'

let actions = {
    loadingShow: createAction(ActionTypes.LOADING_SHOW_VIEW),
    loadingHide: createAction(ActionTypes.LOADING_HIDE_VIEW),
};

export default actions
