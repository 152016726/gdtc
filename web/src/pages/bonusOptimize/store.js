/**
 * Created by DDT on 2018/10/10.
 */
import Vue from "vue";
import Vuex from "vuex";
import localStore from "@easylotto/store";
import games from '@easylotto/bet';
import {TICKET_VALUE} from "constants/bet";
import {
    ALL_STICK_RESULT_LOCAL_STORE_KEY,
    BETSLIP_LOCAL_STORE_KEY,
    MULTIPLE_LOCAL_STORE_KEY
} from "constants/localStoreKeys";
import _ from "lodash";

Vue.use(Vuex);

let betslipInfo = localStore.get(BETSLIP_LOCAL_STORE_KEY) || [];
let result = localStore.get(ALL_STICK_RESULT_LOCAL_STORE_KEY) || [];
let multi = localStore.get(MULTIPLE_LOCAL_STORE_KEY) || 1;
let resultFormat = [].concat(..._.values(result));


/**
 * @description 生成公式
 * @param item 奖金计算结果里面的一项
 */
function genExpression(item){
    let exp = "";
    for(let i = 0; i < item.data.length; i++){
        exp = `${exp}${item.data[i].outcome.odds} × `
    }
    exp = `${exp}${TICKET_VALUE} × ${item.amount}倍`;
    return exp;
}

const store = new Vuex.Store({
    state: {
        betslipInfo,
        result,
        ratio: multi,
        pay: resultFormat.length * +multi * 2,
        bonusInfo: false,
        bonusCompute: {},
        isCanOptimizeEx: false
    },
    // 同步改变
    mutations: {
        updateBetslip(state){
            let bonusInfo = games.Bonus.getBonusInfo();
            let bonusCompute = {
                max: {
                    bonus: bonusInfo.maxBonus,
                    expression: genExpression(bonusInfo.data[bonusInfo.data.length - 1])
                },
                min: {
                    bonus: bonusInfo.minBonus,
                    expression: genExpression(bonusInfo.data[0])
                }
            };
            state.isCanOptimizeEx = games.Bonus.bonusCanHotCool(state.result);
            state.bonusInfo = bonusInfo;
            state.pay = bonusInfo.pay;
            state.bonusCompute = bonusCompute;
        }
    },
    actions: {
        initBonus({commit, state}, payload){
            let { result, pay } = state;
            let defOps = {
                data: result,
                optimizeType: 0,
                pay
            };
            let ops = Object.assign({}, defOps, payload || {});
            return games.Bonus.computeBonus(ops).then(() => {
                commit('updateBetslip');
            }, (reason) => {
                console.log(reason);
            });
        },
        changeOptimize({commit}, payload){
            let { type } = payload;
            return games.Bonus.changeBonusOptimizeType(type, () => {
                commit('updateBetslip');
            });
        },
        changeBonusPayment({commit}, payload){
            let {key, pay} = payload;
            return games.Bonus.changeBonusPayment(key, pay, () => {
                commit('updateBetslip');
            });
        }
    }
});

module.exports = store;