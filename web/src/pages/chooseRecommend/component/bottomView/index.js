/**
 * Created by easyLottoMac_Feng on 2019/2/22.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import games from "@easylotto/bet";
import dialogCommon from '../../../../component/dialogCommon'
let betTypeMap = {
    'mix': games.Rule.EXPERT_TWO_STICK_ONE,
    'dg': games.Rule.EXPERT_SINGLE,
    'tg': games.Rule.EXPERT_TOTAL_GOALS
};

module.exports = Vue.component('choose-recommend-bottom-view', {
    data() {
        return {}
    },
    props: {},
    template,
    created() {},
    methods: {
        toRecommendHandle() {
            let {sort} = this.$store.state;
            games.Rule.setRule(betTypeMap[sort]);
            let errorObj = games.Rule.checkBetslip();
            if (errorObj.isPass) {
                this.$router.push({path: '/sendRecommend'})
            } else {
                dialogCommon.alert(errorObj.reason[0].text)
            }
        }
    }
});