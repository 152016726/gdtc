/**
 * Created by easyLottoMac_Feng on 2019/1/16.
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

module.exports = new Vuex.Store({
    state: {
        hasMatchBeforeData: true,          // 是否有对赛往绩数据
        hasPointRankingData: true,         // 是否有联赛积分排名数据
        hasRecentRecordData: true,         // 是否有近期战绩数据
        hasLeagueTrendData: true,          // 是否有联赛盘路走势数据
        hasHistorySameData: true,          // 是否有相同历史亚赔数据
        hasFutureFiveData: true,           // 是否有未来五场数据
        eventInfo: {},                      // 赛事信息
    },
    mutations: {
        /**
         * 更新当场比赛的赛事
         * @param state
         * @param value
         */
        updateEventInfo(state, value) {
            state.eventInfo = value;
        },
        /**
         * 更新对赛往绩
         * @param state
         * @param value
         */
        updateMatchBeforeData(state, value) {
            state.hasMatchBeforeData = false
        },
        /**
         * 更新联赛积分排名
         * @param state
         * @param value
         */
        updatePointRankingData(state, value) {
            state.hasPointRankingData = false
        },
        /**
         * 更新近期战绩
         * @param state
         * @param value
         */
        updateRecentRecordData(state, value) {
            state.hasRecentRecordData = false
        },
        /**
         * 更新联赛盘路走势数
         * @param state
         * @param value
         */
        updateLeagueTrendData(state, value) {
            state.hasLeagueTrendData = false
        },
        /**
         * 更新相同历史亚赔
         * @param state
         * @param value
         */
        updateHistorySameData(state, value) {
            state.hasHistorySameData = false
        },
        /**
         * 更新未来五场
         * @param state
         * @param value
         */
        updateFutureFiveData(state, value) {
            state.hasFutureFiveData = false
        }
    },
    actions: {
        setEventInfo({commit}, value) {
            return new Promise((resolve, reject) => {
                commit('updateEventInfo', value);
                resolve();
            })
        },
        setMatchBefore({commit}, value) {
            return new Promise((resolve, reject) => {
                commit('updateMatchBeforeData');
                resolve();
            })
        },
        setPointRanking({commit}, value) {
            return new Promise((resolve, reject) => {
                commit('updatePointRankingData');
                resolve();
            })
        },
        setRecentRecord({commit}, value) {
            return new Promise((resolve, reject) => {
                commit('updateRecentRecordData');
                resolve();
            })
        },
        setLeagueTrend({commit}, value) {
            return new Promise((resolve, reject) => {
                commit('updateLeagueTrendData');
                resolve();
            })
        },
        setHistorySame({commit}, value) {
            return new Promise((resolve, reject) => {
                commit('updateHistorySameData');
                resolve();
            })
        },
        setFutureFive({commit}, value) {
            return new Promise((resolve, reject) => {
                commit('updateFutureFiveData');
                resolve();
            })
        },
    }
});