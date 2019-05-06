/**
 * Created by marcus on 2018/11/14.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    changeTitle(){
        return (
            (dispatch,getState) => {
                const   {title} = getState()[storeKey.RESET_PASSWORD_STORE];
                let obj = {
                    title: title +"啊"
                };
                dispatch(actions.updateTitle(obj))
            }
        )
    },
    /**
     * 更新个人信息
     */
    updatePersonal: createAction(ActionTypes.UPDATE_PERSONAL, (obj) => obj),
    updateTitle: createAction(ActionTypes.UPDATE_RESET_PASSWORD,(obj)=>obj)
};
export default actions