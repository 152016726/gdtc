/**
 * Created by easyLottoMac on 2018/9/27.
 */

import "./index.scss";
import Vue from "vue";
import template from "./index.template";
import games from "@easylotto/bet";
import $ from "jquery";
import "./components/checkBox"
import "./components/combListPanel"
import "../../../../component/selectNumBox"
import "./components/checkBox";
import emitter from "@easylotto/emitter";
import {BetslipPosition} from "../../../../constants/EmitterKey";
import {TICKET_VALUE} from "../../../../constants/bet";
import "../../../../component/bonusDetails";
import "../betsSelections";
import dialog from 'component/dialogCommon';
import {MAX_SELECT_STICK_WAY, PLEASE_SELECT_OUTCOME, PLEASE_SELECT_STICK_WAY, ONE_MARKET_ONE_OUTCOME} from 'constants/Tips';
import _ from "lodash";

/**
 * @description 定位投注揽
 */
function positionBetslip(){
    let doc = $(document);
    let underThingsHeight = $("#betTips").outerHeight() + $($(".footer")[0]).outerHeight() + 20;
    let delta = doc.outerHeight() - doc.scrollTop() - $(window).height();
    if(delta <= underThingsHeight){
        $(".vueBetslipComponent").css("position", "relative");
        $(".vueBetslipComponentShadow").hide();
    }else{
        $(".vueBetslipComponent").css("position", "fixed");
        $(".vueBetslipComponentShadow").show();
    }
}

let betslip = Vue.component('betslip', {
    template: template,
    computed: {
        // 投注揽
        betslip: {
            get(){
                // 每次的this.betslip都要从store里面取值
                let betslip = this.$store.state["betslip"] || [];
                // 设置是否显示串关方式
                this.isBetslipEmpty = betslip.length === 0;
                this.isSingleNotDgMatch = false;

                // 获取当前投注揽下所有的串关方式
                !this.isBetslipEmpty && games.Stick.getMStickNList().then((r) => {
                    this.isSingleNotDgMatch = r.length === 0;
                    // 过滤剩下我们需要的串关方式
                    // stick way config... short name
                    // 现在核心已经支持配置需要的串关方式了, 所以swc这个值可以直接等同于r值 2019-4-4 by - GSSL
                    let swc = [].concat(r);

                    // 顺便设置free和comb的值
                    let _free = [];
                    let _comb = [];
                    for(let i = 0; i < swc.length; i++){
                        if(swc[i].n === 1){
                            // 自由串关
                            let objFree = {
                                data: {
                                    m: swc[i].m,
                                    n: 1,
                                    p: swc[i].p,
                                    key: `${swc[i].m}#1#${swc[i].p.join("")}`
                                },
                                text: swc[i].m === 1 ? "单关" : `${swc[i].m}串1`,
                                isChecked: false,
                                isExtend: false,
                                clickHook: (ref) => {
                                    let data = ref.ops.data;
                                    let isCheck = ref.ops.isChecked;
                                    return this.selectStickWay(data, isCheck);
                                }
                            };
                            _free.unshift(objFree);
                        }else{
                            // 组合串关
                            let objComb = {
                                data: {
                                    m: swc[i].m,
                                    n: swc[i].n,
                                    p: swc[i].p,
                                    key: `${swc[i].m}#${swc[i].n}#${swc[i].p.join("")}`
                                },
                                text: `${swc[i].m}串${swc[i].n}`,
                                isChecked: false,
                                isExtend: false,
                                clickHook: (ref) => {
                                    let data = ref.ops.data;
                                    let isCheck = ref.ops.isChecked;
                                    return this.selectStickWay(data, isCheck);
                                }
                            };
                            _comb.unshift(objComb);
                        }
                    }
                    this.comb = _comb;
                    this.free = _free;
                });
                // 重置一下投注揽计算结果
                this.resetBetslip();
                return betslip;
            }
        }
    },
    data(){
        return {
            isBetslipEmpty: true,               // 是否投注揽中是否有赛事
            isSingleNotDgMatch: false,          // 是否选中一场单关比赛
            isShowBetslipListPanel: false,      // 是否展示"已选x场"上拉面板
            isShowCombListPanel: false,         // 是否展示"更多方式"上拉面板
            multipleOps: {                      // 倍数筛选框配置
                value: 1,
                delta: 1,
                min: 1,
                onChange: (v) => {
                    this.computeBonus(v);
                }
            },
            moreOps: {                          // 更多上拉组件参数
                text: "更多方式",
                isChecked: false,
                isExtend: true,
                clickHook: (e) => {
                    this.toggleMoreFree();
                    return this.moreOps.isChecked;
                }
            },
            showMoreFree: false,                // 是否显示过关方式对照表
            free: [],                           // 自由过关
            comb: [],                           // 组合过关
            isShowBonus: false,                 // 奖金优化
            minBonus: 0,                        // 最小奖金
            maxBonus: 0,                        // 最大奖金
            minExpression: "",                  // 最小奖金公式
            maxExpression: "",                  // 最大奖金公式
            amount: 0,                          // 生成的总票数
            money: 0,                           // 投注金额
            singleMoney: 0,                     // 单倍投注金
            stickWays: [],                      // 选过的串关方式
            bonusInfo: {},                      // 奖金信息
            isShowBO: false,                    // 是否显示奖金优化
            rules: {                            // 默认限制
                stickWayMax: 5                  // 最多选5场串关
            }
        }
    },
    mounted(){
        emitter.global.on(BetslipPosition, positionBetslip);
        let doc = $(document);
        $(window).resize(positionBetslip);
        $("body").resize(positionBetslip);
        doc.scroll(positionBetslip);
        // 获取m串n列表
        this.isBetslipEmpty = this.betslip.length !== 0;
        // 看看有没有开单关
        for(let i = 0; i < this.betslip.length; i++){
            if(this.betslip[i].matchInfo.dgStatus === "1") {
                this.isHasSingle = true;
                break;
            }
        }
        // 阻止冒泡
        $(".vueBetslipComponentTemp .right button").click(function(event) {
            event.stopPropagation();
        });
    },
    methods: {
        /**
         * @description 曾经选中过的串关方式, 选中过的串关方式以后不会再计算
         * @param data
         * @param isCheck 此值为点击前的值
         * @returns {boolean}
         */
        selectStickWay(data, isCheck){
            let _isCheck = !!isCheck;
            let _stickWays = [].concat(...this.stickWays);
            // 不能选超5个玩法, 前提是这个串关方式之前是没被选中的
            let selectedWay = 0; // 选中的串关方式
            for(let i = 0; i < _stickWays.length; i++){
                if(_stickWays[i].isCheck){
                    selectedWay = selectedWay + 1;
                }
            }
            if(selectedWay > this.rules.stickWayMax || (selectedWay === this.rules.stickWayMax && !_isCheck)){
                dialog.alert(MAX_SELECT_STICK_WAY);
                return false;
            }
            // isCheck取反才是真正点击的值
            let _stickWay = Object.assign(data, {
                isCheck: !_isCheck
            });
            // 更多方式勾不勾
            this.moreOps.isChecked = false;
            for(let i = 0; i < this.comb.length; i++){
                // 是否comb就是当前选中的串关方式
                if(this.comb[i].data.key === data.key){
                    if(!isCheck){
                        this.moreOps.isChecked = true;
                        break;
                    }
                }else{
                    if(this.comb[i].isChecked === true){
                        this.moreOps.isChecked = true;
                        break;
                    }
                }
            }
            // 进行串关和奖金计算
            new Promise((resolve, reject) => {
                if(!_isCheck){
                    // 新增串关方式
                    games.Stick.addStickWay({
                        m: data.m,
                        n: data.n,
                        p: data.p,
                        isRepeat: false
                    }).then(resolve, reject);
                }else{
                    // 删除串关方式
                    games.Stick.deleteStickWay(data.key);
                    resolve();
                }
            }).then((isDel) => {
                let isFind = false;
                // 先找下有没有记录, 有记录就改下选中状态
                for(let i = 0; i < _stickWays.length; i++){
                    if(_stickWays[i].key === data.key){
                        _stickWays[i].isCheck = !_isCheck;
                        isFind = true;
                        break;
                    }
                }
                // 如果是新增的就补入去
                if(!isFind){
                    let bonus = games.Bonus.getMaxMinBonusQuckly({
                        m: data.m,
                        n: data.n,
                        p: data.p,
                        isRepeat: false
                    }, 1);
                    let stickResultLength = games.Stick.getStickResultLength();
                    _stickWays.push({
                        ticketAmount: stickResultLength,        // 记录串关结果
                        min: bonus.minBonus,                    // 最小奖金
                        minExpression: bonus.minExpression,     // 最小奖金公式
                        max: bonus.maxBonus,                    // 最大奖金
                        maxExpression: bonus.maxExpression,     // 最小奖金公式
                        ..._stickWay
                    });
                }
                this.stickWays = _stickWays;
                // 结算最大最小奖金
                this.computeBonus();
            }, (reason) => {
                dialog.alert(reason.toString());
            });

            return !_isCheck;
        },
        /**
         * @description 计算串关方式
         * @param multiple 倍数
         */
        computeBonus(multiple){
            let _multiple = multiple || parseFloat(this.multipleOps.value);
            let _stickWays = [].concat(...this.stickWays);
            let max = -1;
            let min = -1;
            let maxExp = "";
            let minExp = "";
            let amount = 0;
            let hasCheck = false;
            this.isShowBO = true;
            this.multipleOps.value = _multiple;

            for(let i = 0; i < _stickWays.length; i++){
                if(_stickWays[i].isCheck){
                    hasCheck = true;
                    if(_stickWays[i].m !== games.Betslip.getBetslip().length)
                        this.isShowBO = false;
                    if(max === -1){
                        max = _stickWays[i].max;
                        maxExp = _stickWays[i].maxExpression;
                    }
                    if(min === -1){
                        min = _stickWays[i].min;
                        minExp = _stickWays[i].minExpression;
                    }
                    if(parseFloat(_stickWays[i].max) > parseFloat(max)){
                        max = _stickWays[i].max;
                        maxExp = _stickWays[i].maxExpression;
                    }
                    if(parseFloat(_stickWays[i].min) < parseFloat(min)){
                        min = _stickWays[i].min;
                        minExp = _stickWays[i].minExpression;
                    }
                    amount = amount + parseFloat(_stickWays[i].ticketAmount);
                }
            }
            this.isShowBO = hasCheck && this.isShowBO;
            this.money = amount * TICKET_VALUE * _multiple;
            this.singleMoney = amount * TICKET_VALUE;
            this.maxBonus = max * _multiple;
            this.maxExpression = maxExp;
            this.minBonus = min * _multiple;
            this.minExpression = minExp;
            this.amount = amount;
            this.bonusInfo = {
                max: {
                    bonus: this.maxBonus,
                    expression: `${maxExp} × ${_multiple}倍`
                },
                min: {
                    bonus: this.minBonus,
                    expression: `${minExp} × ${_multiple}倍`
                }
            };
        },
        /**
         * @description 重置投注揽计算结果
         */
        resetBetslip() {
            this.singleMoney = 0;
            this.money = 0;
            this.stickWays = [];
            this.multipleOps.value = 1;
            this.moreOps.isChecked = false;
            this.maxBonus = 0;
            this.minBonus = 0;
        },
        showBetslipListPanel(){
            if(this.betslip.length === 0){
                dialog.alert(PLEASE_SELECT_OUTCOME);
                return;
            }
            this.isShowBetslipListPanel = !this.isShowBetslipListPanel;
            if(this.isShowBetslipListPanel){
                this.showMoreFree = !this.isShowBetslipListPanel;
            }
        },
        showCombListPanel(){
            this.isShowCombListPanel = !this.isShowCombListPanel;
        },
        /**
         * @description 选单过滤
         */
        betslipFilter(){
            console.log("选单过滤");
        },
        /**
         * @description 奖金优化
         */
        bonusOptimization(isClick){
            // 把串关方式放入store
            this.$store.dispatch("setAllStickResult", {
                stickResult: games.Stick.getStickResult(),
                multiple: parseFloat(this.multipleOps.value)
            }).then(() => {
                isClick && (window.open('bonusOptimize.html'));
            });
        },
        /**
         * @description 更多方式 -> 过关方式对照表
         */
        toggleMoreFree(){
            this.showMoreFree = !this.showMoreFree;
            if(this.showMoreFree){
                this.isShowBetslipListPanel = !this.showMoreFree;
            }
        },
        /**
         * @description 奖金明细(父传子控制显示）
         */
        showBonusDetails(){
            let isPass = false;
            for(let i = 0; i < this.stickWays.length; i++){
                if(this.stickWays[i].isCheck){
                    isPass = true;
                    break;
                }
            }
            !isPass && dialog.alert(PLEASE_SELECT_STICK_WAY);
            this.isShowBonus = isPass && !this.isShowBonus;
        },
        /**
         * @description 奖金明细(子传父控制显示)
         */
        setBonus(val){
            this.isShowBonus = val;
        },
        /**
         * @description 已选过关方式(子传父控制显示)
         */
        setSelections(val){
            this.isShowBetslipListPanel = val;
        }


    }
});

module.exports = betslip;










































