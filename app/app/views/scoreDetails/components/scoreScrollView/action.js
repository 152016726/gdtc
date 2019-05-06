/**
 * Created by easyLottoMac on 2018/10/22.
 */

import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../../constants/ActionTypes'
import * as storeKey from '../../../../constants/storeKeys'

let actions = {
    /**
     * 页面滚动事件
     * @param e
     */
    onScrollHandle(e){
        return ((dispatch, getState)=>{
            const {topNum, defOffSetY} = getState()[storeKey.SCORE_DETAILS_STORE];
            let offSetY = e.contentOffset.y;
            let offSetTop = 0;
            //计算页面滚动高度设置页面的绝对定位高度
            if(Math.abs(defOffSetY - offSetY) > 5){
                offSetTop = topNum - offSetY;
                if(offSetTop <= 44){
                    offSetTop = 44;
                    dispatch(actions.updateState(
                        {
                            isShowICon: true
                        }
                    ));
                }else if (offSetTop >= 190){
                    offSetTop = 190;
                }else if( 44 <= offSetTop <= 190){
                    dispatch(actions.updateState(
                        {
                            isShowICon: false
                        }
                    ));
                }
                dispatch(actions.updateState(
                    {
                        topNum: offSetTop,
                        defOffSetY: offSetY
                    }
                ));
            }
        })
    },
    updateState: createAction(ActionTypes.UPDATE_SCORE_DETAILS, (obj) => obj)
};

export default actions;