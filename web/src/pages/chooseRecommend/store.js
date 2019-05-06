/**
 * Created by easyLottoMac on 2018/9/26.
 */

import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import games from '@easylotto/bet';
import {ONE_MARKET_ONE_OUTCOME, MAX_SELECT_EVENTS} from "constants/Tips";

module.exports = new Vuex.Store({
    state: {
        sort: 'mix',            // 选中的玩法 sortKey
        betslip: [],            // 投注揽
        marketList: [],         // 赛事信息
        maxBonus: '000'         // 最高奖金
    },
    mutations: {
        setBetsLip(state) {
            state.betslip = games.Betslip.getBetslip();
        },
        setSortValue(state, value) {
            state.sort = value;
        },
        setMarketListValue(state, value) {
            state.marketList = value;
        },
        setMaxBonusValue(state, value) {
            state.maxBonus = value
        }
    },
    actions: {
        initEvents({commit}, events) {
            return new Promise((resolve, reject) => {
                games.Betslip.initEvents(events);
                games.Betslip.clearBetslip();
                commit("setBetsLip");
                commit("setMarketListValue", events);
                resolve();
            });
        },
        /**
         * 设置当前玩法的 sort
         * @param commit
         * @param sort
         * @returns {Promise<any>}
         */
        setSort({commit}, sort) {
            return new Promise((resolve, reject) => {
                commit("setSortValue", sort);
                resolve();
            });
        },
        /**
         * 设置所有赛事信息
         * @param commit
         * @param maxBonus
         * @returns {Promise<any>}
         */
        setMaxBonus({commit}, maxBonus) {
            return new Promise((resolve, reject) => {
                commit("setMaxBonusValue", maxBonus);
                resolve();
            });
        },
        /**
         *
         * @param commit
         * @param value 一个字符串数组, 字符串为每个outcome的唯一key
         */
        setOutcomeToBetslip({commit}, value) {
            return new Promise((resolve, reject) => {
                games.Betslip.setOutcomeToBetslip(value);
                commit("setBetsLip");
                resolve();
            });
        },
        /**
         * 删除赛事
         * @param commit
         * @param value
         * @returns {Promise<any>}
         */
        deleteFromBetslip({commit}, value) {
            return new Promise((resolve, reject) => {
                games.Betslip.deleteFromBetslip(value);
                commit("setBetsLip");
                resolve();
            });
        },
        /**
         * 清空选中投注项
         * @param commit
         * @returns {Promise<any>}
         */
        clearBetslip({commit}) {
            return new Promise((resolve, reject) => {
                games.Betslip.clearBetslip();
                commit("setBetsLip");
                resolve();
            });
        },
    }
});








































