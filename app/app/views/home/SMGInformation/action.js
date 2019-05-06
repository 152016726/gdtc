/**
 * Created by mac-ddt on 2018/8/14.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys'

let actions = {
    /**
     * tab 切换事件
     * @param index
     * @returns {Function}
     */
    changeTitleTab(index){
        return ((dispatch, getState)=>{
            dispatch(actions.updateData({
                activeIndex: index
            }));
            dispatch(actions.updateHomeData({
                MaxHeight: 0
            }))
        });
    },
    updateData:createAction(ActionTypes.UPDATE_HOME_SMG, (MarketObj)=>MarketObj),
    updateHomeData: createAction(ActionTypes.UPDATE_HOME, (MarketObj) => MarketObj)
};
export default actions