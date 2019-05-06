let Vue = require("vue");
let Vuex = require("vuex");
Vue.use(Vuex);

module.exports = new Vuex.Store({
    state: {
        eventInfo: {}       // 赛事信息
    },
    mutations: {
        /**
         * 更新当场比赛的赛事
         * @param state
         * @param value
         */
        updateEventInfo(state, value) {
            state.eventInfo = value;
        }
    },
    actions: {
        setEventInfo({commit}, value) {
            return new Promise((resolve, reject) => {
                commit('updateEventInfo', value);
                resolve();
            })
        }
    }
});