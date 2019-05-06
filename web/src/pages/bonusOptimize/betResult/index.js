/**
 * 投注结果模块
 * Created by DDT on 2018/10/10.
 */
import template from './index.template';
import Vue from 'vue';
import { mapState } from 'vuex';
import './index.scss';
import localStore from "@easylotto/store";
import {
    ALL_STICK_RESULT_LOCAL_STORE_KEY,
    BETSLIP_LOCAL_STORE_KEY,
    MULTIPLE_LOCAL_STORE_KEY
} from "constants/localStoreKeys";
import "../../../component/bonusDetails";

let betResult = Vue.component('bet-result', {
    data(){
        return{
            isShowBonus:false  // 奖金明细
        }
    },
    template: template,
    computed: mapState([
        'pay', 'bonusInfo', 'ratio', 'result', 'betslipInfo', 'bonusCompute'
    ]),
    created(){},
    methods: {
        showBonusDetails() {
            this.isShowBonus = !this.isShowBonus;
        },
        setBonus(val){
            this.isShowBonus = val;
        }
    }
});

module.exports = betResult;