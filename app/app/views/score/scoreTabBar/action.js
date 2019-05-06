import { createAction } from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';

let actions = {
    /**
     * 记录当scrollPageIndex
     * pageIndex 第一选项栏的下标
     */
    handlePageIndex(pageIndex){
        return ((dispatch, getState) => {
            let { dateScrollIndex, isHide } = getState()[ storeKey.SCORE_STORE ];
            if (pageIndex === 0) {
                //当天
                dateScrollIndex = 6;
                isHide = true;
            }
            else if (pageIndex === 1) {
                //昨天
                dateScrollIndex = 5;
                isHide = true;
            }
            else if (pageIndex === 2) {
                //明天
                dateScrollIndex = 7;
                isHide = true;
            }
            dispatch(actions.updateScorePageIndex({
                dateScrollIndex : dateScrollIndex,
                pageIndex : pageIndex,
                isHide : isHide
            }));
        });
    },
    /**
     * 更新当前页
     */
    updateScorePageIndex : createAction(ActionTypes.UPDATE_SCORE, (obj) => obj),
};
export default actions