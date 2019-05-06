import { createAction } from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys';

let actions = {
    /**
     * 记录当scrollPageIndex
     *
     */
    saveCurrentTabToRedux(i){
        return ((dispatch, getState) => {
            let { pageIndex } = getState()[ storeKey.SCORE_STORE ];
            if (i > 6) {
                pageIndex = 2;
            }
            else if (i === 6) {
                pageIndex = 0;
            }
            else {
                pageIndex = 1;
            }
            dispatch(actions.updateScorePageIndex({
                pageIndex : pageIndex,
                dateScrollIndex : i,
                isHide : true
            }));
        });
    },
    /**
     * 更新当前页
     */
    updateScorePageIndex : createAction(ActionTypes.UPDATE_SCORE, (obj) => obj),
};
export default actions