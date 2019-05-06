/**
 * Created by easyLottoMac on 2018/9/26.
 */

let Vue = require("vue");
let Vuex = require("vuex");
Vue.use(Vuex);
let games = require("@easylotto/bet");
let store = require("@easylotto/store");
import {
    ALL_STICK_RESULT_LOCAL_STORE_KEY,
    BETSLIP_LOCAL_STORE_KEY,
    MULTIPLE_LOCAL_STORE_KEY
} from "../../constants/localStoreKeys";
const BUNCH = 8; // 允许最多串关数
import {ONE_MARKET_ONE_OUTCOME, MAX_SELECT_EVENTS} from "constants/Tips";

module.exports = new Vuex.Store({
    state: {
        betslip: [],            // 投注揽
        allStickResult: [],     // 缓存所有计算的结果
        money: 0,               // 投注金额,
        bonusInfo: {}
    },
    mutations: {
        setBetslip(state) {
            state.betslip = games.Betslip.getBetslip();
        },
        setAllStickResult(state, value) {
            state.allStickResult = value;
        },
        setMoney(state, value) {
            state.money = value;
        },
        setBonusInfo(state, value) {
            state.bonusInfo = value;
        }
    },
    actions: {
        setBonusInfo({commit}, value) {
            return new Promise((resolve, reject) => {
                commit("setBonusInfo", value);
                resolve();
            });
        },
        setMoney({commit}, value) {
            return new Promise((resolve, reject) => {
                commit("setMoney", value);
                resolve();
            });
        },
        refreshBetslip({commit}) {
            return new Promise((resolve, reject) => {
                commit("setBetslip");
                resolve();
            });
        },
        initEvents({commit}, events) {
            return new Promise((resolve, reject) => {
                games.Betslip.initEvents(events);
                games.Betslip.clearBetslip();
                commit("setBetslip");
                resolve();
            });
        },
        clearBetslip({commit}) {
            return new Promise((resolve, reject) => {
                games.Betslip.clearBetslip();
                commit("setBetslip");
                resolve();
            });
        },
        /**
         * @description 设胆
         * @param commit
         * @param value
         * @returns {Promise<any>}
         */
        setBankerEventToBetslip({commit}, value) {
            return new Promise((resolve, reject) => {
                // 先设胆
                games.Betslip.setBankerEventToBetslip(value.key, value.isBanker);
                // 再检
                games.Rule.setRule(games.Rule.JING_CAI_SOCCER_RULE);
                let reason = games.Rule.checkBetslip();
                if(reason.isPass || reason.reason[0].code === "CTEAL"){
                    commit("setBetslip");
                    resolve();
                }else{
                    // 不行就回滚
                    games.Betslip.setBankerEventToBetslip(value.key, !value.isBanker);
                    reject(reason.reason[0].text);
                }
            });
        },
        /**
         *
         * @param commit
         * @param value 一个字符串数组, 字符串为每个outcome的唯一key
         */
        setOutcomeToBetslip({commit}, value) {
            return new Promise((resolve, reject) => {
                // 先加
                games.Betslip.setOutcomeToBetslip(value);
                // 再检
                games.Rule.setRule(games.Rule.JING_CAI_SOCCER_RULE);
                let reason = games.Rule.checkBetslip();
                if(reason.isPass || reason.reason[0].code === "CTEAL"){
                    commit("setBetslip");
                    resolve();
                }else{
                    // 不行就回滚
                    games.Betslip.deleteFromBetslip(value);
                    reject(reason.reason[0].text);
                }
            });
        },
        deleteFromBetslip({commit}, value) {
            return new Promise((resolve, reject) => {
                // 先删
                games.Betslip.deleteFromBetslip(value);
                commit("setBetslip");
                resolve();
            });
        },
        /**
         *
         * @param commit
         * @param value 一个对象, 缓存所有选中串关的奖金计算结果
         */
        setAllStickResult({commit}, value) {
            return new Promise((resolve, reject) => {
                commit("setAllStickResult", value.stickResult);
                store.erase(ALL_STICK_RESULT_LOCAL_STORE_KEY);
                store.set(ALL_STICK_RESULT_LOCAL_STORE_KEY, value.stickResult);
                store.erase(BETSLIP_LOCAL_STORE_KEY);
                store.set(BETSLIP_LOCAL_STORE_KEY, games.Betslip.getBetslip());
                store.erase(MULTIPLE_LOCAL_STORE_KEY);
                store.set(MULTIPLE_LOCAL_STORE_KEY, value.multiple);

                resolve();
            });
        }
    }
});








































