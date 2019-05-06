import {createAction} from "redux-actions";
import * as ActionTypes from "../../constants/ActionTypes";
import state from './state';

/**
 * Created by DDT on 2018/11/27.
 */

let actions = {
    closeDialog() {
        return ((dispatch, getState) => {
            // 关闭窗口同时清空数据
            dispatch(actions.updateDialog(state));
        });
    },
    updateDialog: createAction(ActionTypes.UPDATE_COMMON_DIALOG, (obj) => obj)
};

export default actions;