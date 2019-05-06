/**
 * Created by marcus on 2018/11/17.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    /**
     * 改变resetName里的nickname
     * @param name
     * @returns {function()}
     */
    setNickname(name){
        return (
            (dispatch) => {
                let obj = {
                    nickname: name
                };
                dispatch(actions.updateNickname(obj))
            }
        )
    },
    updateNickname: createAction(ActionTypes.UPDATE_RESET_NAME,(obj)=>obj),
    /**
     * 更新personalInformation和Personal页面的里的nickname
     * @returns {function()}
     */
    resetNickname(){
        return(
            (dispatch, getState) => {
                const {nickname} = getState()[storeKey.RESET_NAME_STORE];
                dispatch(actions.updatePersonnalInformation({nickname}))
                dispatch(actions.updatePersonal({nickname}))
            }
        )
    },
    updatePersonnalInformation: createAction(ActionTypes.UPDATE_PERSONAL_INFORMATION,(obj)=>obj),
    updatePersonal: createAction(ActionTypes.UPDATE_PERSONAL,(obj)=>obj)
};
export default actions