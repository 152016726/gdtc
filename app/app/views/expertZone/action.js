/**
 * Created by marcus on 2019/1/2.
 */
import {createAction} from 'redux-actions';
import * as ActionTypes from '../../constants/ActionTypes';
import * as storeKey from '../../constants/storeKeys';

let actions = {
    /**
     * 更新个人信息
     */
    updatePersonal: createAction(ActionTypes.UPDATE_PERSONAL, (obj) => obj),
    updateState: createAction(ActionTypes.UPDATE_EXPERTZONE, (obj)=>obj)
};
export default actions