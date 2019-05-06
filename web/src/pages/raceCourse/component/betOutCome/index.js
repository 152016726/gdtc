/**
 * Created by easyLottoMac on 2018/9/27.
 */

import "./index.scss";
import Vue from "vue";
import template from "./index.template";
import dialogCommon from '../../../../component/dialogCommon'
import games from "@easylotto/bet";

let betTypeMap = {
    'mix': games.Rule.EXPERT_TWO_STICK_ONE,
    'dg': games.Rule.EXPERT_SINGLE,
    'tg': games.Rule.EXPERT_TOTAL_GOALS
};
let bet_outcome = Vue.component('bet-outcome', {
    data() {
        return {
            isUpNum: false, //赔率上升的状态
            isDownNum: false //赔率下降的状态
        }
    },
    props: {
        //默认按钮只有bet_outcome，只有text和num
        text: {        //显示的名称
            default: ''
        },
        num: {         //赔率
            default: 0.00
        },
        trend: {       //赔率的上升或下降的变化标识
            default: 0
        },
        vertical: {    //是否是垂直排列
            default: false
        },
        isHorizontal: {  //是否左对齐展示 ==> 只作用于混合过关
            default: false
        },
        checked: {     //是否是选中状态
            default: false
        },
        vid: {         //赛事id
            default: ''
        },
        sort: {        //当前玩法
            default: ''
        },
        outcomeName: { //当前注项名
            default: ''
        },
        isDisabled: { //是否禁用
            default: false
        },
        isResult: {   //是否是赛果
            default: false
        },
        isPrize: {   //是否为开奖结果
            default: false
        },
        pressCb: {   //点击回调，有该值并且是函数就会执行该函数，不会执行增加删除投注篮
            default: null,
            type: Function
        },
        isRecommend: {  // 是否是推单列表
            default: false
        },
        recommendSort: {
            default: 'mix'
        }
    },
    template: template,
    created() {
        //根据值判断上升或下降的状态
        switch (this.trend) {
            case "-1":
                this.isDownNum = true;
                break;
            case "1":
                this.isUpNum = true;
        }
    },
    computed: {
        isSelected: function () {
            let {vid, sort, outcomeName, isPrize, isResult} = this;
            if (isPrize || isResult) {
                return false;
            }
            let selectStr = `${vid}#${sort}#${outcomeName}`;
            let betslip = this.$store.state.betslip;
            let isSelected;
            isSelected = betslip.some((ele) => {
                return ele.outcomes.some((ele_c) => {
                    return ele_c.key === selectStr
                })
            });
            return isSelected;
        }
    },
    methods: {
        /**
         * 切换选中状态
         * @param el
         */
        clickHandle(el) {
            let {vid, sort, outcomeName, isSelected, isDisabled, isResult, num, pressCb} = this;
            if (isDisabled || isResult || !num) {
                return;
            }
            let selectedArr = [];
            let selectStr = `${vid}#${sort}#${outcomeName}`;
            if (pressCb) { //有回调执行回调
                this.pressCb(selectStr);
                return;
            }
            selectedArr.push(selectStr);
            if (!isSelected) {
                this.$store.dispatch('setOutcomeToBetslip', selectedArr).then(() => {
                    this.callbackAfterAdd();
                }, (msg) => {
                    dialogCommon.alert(msg);
                });
            }
            else {
                this.$store.dispatch('deleteFromBetslip', selectedArr).then(() => {
                    this.callbackAfterDelete();
                });
            }

        },
        callbackAfterAdd() {
        },
        callbackAfterDelete() {
        }
    }
});

module.exports = bet_outcome;

