import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import games from "@easylotto/bet";

let actions = {
    /**
     * 删除已选中的所有赛事
     * @returns {Function}
     */
    deleteAll() {
        return ((dispatch, getState) => {
            dispatch(actions.setBetsilpList({
                eventCount: 0
            }))
        })
    },
    /**
     * 获取betslip已选注项
     * @returns {Function}
     */
    getbetslipList() {
        return ((dispatch, getState) => {
            let betslipList = games.Betslip.getBetslip();
            dispatch(actions.setBetsilpList({eventCount: betslipList.length}))
        });
    },
    setBetsilpList: createAction(ActionTypes.UPDATE_BET_AREA, (obj) => obj),
    /**
     * 更新投注揽信息
     */
    updateBetSlipList: createAction(ActionTypes.UPDATE_BETSLIP_LIST, (obj) => obj)
};
export default actions