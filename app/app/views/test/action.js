/**
 * Created by mac-ddt on 2018/8/10.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    changeTitle(){
        return ((dispatch,getState)=>{
            const {title} = getState()[storeKey.TEST_STORE];
            let obj = {
                title: title + '啊'
            };
            dispatch(actions.updateTitle(obj))
        })
    },
    updateTitle: createAction(ActionTypes.UPDATE_TEST_TITLE,(obj)=>obj)
};
export default actions