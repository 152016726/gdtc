import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'
import publishOrderService from '~/services/publishOrderService'
import selfState from './state'
import Account from '#/account'
import games from '@easylotto/bet'

let sortMap = {
    mix: 'twoStickOne',
    dg: 'single',
    tg: 'tg'
};
let _BETMONEY = 100;  //投注金额
let _MULTIPLE = 1;     //倍数

let actions = {
    /**
     * 发布推荐
     * @param reqData
     * @param sort
     * @returns {Function}
     */
    publish(reqData, sort) {
        return ((dispatch, getState) => {
            publishOrderService.getData(reqData).then((resData) => {
                // console.log(resData);
                const {orderState} = Account.getAccountInfo();
                for (p in orderState) {
                    if (p === sortMap[sort]) {
                        orderState[p] = 'false'
                    }
                }
                // console.log(orderState);
                let accountInfo = Account.updateAccountInfo(orderState);
                //发布成功清空投注揽
                games.Betslip.clearBetslip();
                dispatch(actions.clearBetslip({
                    betslipList: [],
                    eventCount: 0,
                    currentKey: ''
                }));
                //更新庄户信息
                dispatch(actions.updateAccountInfo({
                    isExpert: accountInfo.isExpert,
                    needShowSorts: accountInfo.needShowSorts,
                    loginStatus: accountInfo.loginStatus,
                    isReceiveProps: true
                }));
                //更新接口返回状态
                dispatch(actions.updateAllState({
                    isRespond: true
                }));
            }, (rejectData) => {
                console.log(rejectData)
            })
        })
    },
    /**
     * 更新页面state
     */
    updateAllState: createAction(ActionTypes.UPDATE_SENDRECOMMEND_STATE, (obj) => obj),
    /**
     * 初始化默认数据
     */
    initState: createAction(ActionTypes.UPDATE_SENDRECOMMEND_STATE, (selfState) => selfState),
    /**
     * 清空投注揽
     */
    clearBetslip: createAction(ActionTypes.UPDATE_BETSLIP_LIST, (obj) => obj),
    /**
     * 更新专家页面庄户信息
     */
    updateAccountInfo: createAction(ActionTypes.UPDATE_EXPERT_HOME, (obj) => obj)
};
export default actions;