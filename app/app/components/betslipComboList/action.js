import {createAction} from 'redux-actions';
import * as ActionTypes from '../../constants/ActionTypes';
import * as storeKey from '../../constants/storeKeys';

let actions = {
    /**
     * 更新投注倍数并触发更新奖金计算信息
     * @param val
     * @returns {Function}
     */
    changeBetTimes(val) {
        return ((dispatch, getState) => {
            let {minOrgin, maxOrgin, orgin } = getState()[storeKey.CALCULATION_STORE];
            dispatch(actions.setBonusInfo({
                    minBonus: Math.floor(minOrgin * val),
                    maxBonus: Math.floor(maxOrgin * val),
                    pay: Math.floor(orgin * val),
                    multiple : val
            }));

        })
    },
    setBonusInfo: createAction(ActionTypes.UPDATE_BONUS_INFO,(obj)=>obj),
};
export default actions