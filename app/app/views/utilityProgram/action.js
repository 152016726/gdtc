/**
 * Created by easyLottoMac_Feng on 2018/12/10.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'
import * as storeKey from '~/constants/storeKeys'

const EIGHTDATETIME = 8 * 60 * 60 * 1000; // 8小时的毫秒数

let actions = {
    changeSomeProps(data) {
        return ((dispatch) => {
            dispatch(actions.updateDate(data))
        });
    },
    /**
     * 日期筛选赛事
     * @param startDate     开始日期毫秒数
     * @param endDate       截止日期毫秒数
     * @returns {Function}
     */
    selectMarket(startDate, endDate) {
        return ((dispatch, getState) => {
            let {allFlatListData} = getState()[storeKey.PEER_REVIEW_STORE];
            let showFlat = allFlatListData.filter(AFL => {
                let _defaltDate = Date.prototype.parseISO8601(AFL.vsDate).getTime();
                return _defaltDate >= (startDate - EIGHTDATETIME) && _defaltDate <= (endDate + (EIGHTDATETIME * 2))
            });
            dispatch(actions.updatePRData({
                showFlatListData: showFlat
            }))
        })
    },

    updatePRData: createAction(ActionTypes.UPDATE_PEER_REVIEW, (obj) => obj),
    updateDate: createAction(ActionTypes.UPDATE_UTILITY_PROGRAM, (obj) => obj)
};

export default actions