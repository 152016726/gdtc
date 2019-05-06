/**
 * 投注计划模块
 * Created by DDT on 2018/10/10.
 */
import template from './index.template';
import Vue from 'vue';
import { mapState } from 'vuex';
import selectNumBox from 'component/selectNumBox';
import dialogCommon from 'component/dialogCommon';
import introduction from './introduction';

import './index.scss';

let betPlan = Vue.component('bet-plan', {
    template: template,
    data() {
        let self = this;
        return {
            getOcHcapClass(oc) {
                return oc.data.handicap.charAt(0) === '-' ? 'minus_hcap_font' : 'plus_hcap_font';
            },
            getOddClass(oc) {
                let oddMatch = {
                    'homeOdds': 'win_font',
                    'drawOdds': 'draw_font',
                    'awayOdds': 'lose_font'
                };
                return oddMatch[oc.outcomeKey];
            },
            handleClickItem(item, value) {
                self.changeOnePrice(item, value);
            },
            toPay: 0,               // 将要设置金额
            minPay: 0,              // 最小购买金额
            optimizeType: 0         // 优化类别  平均优化 0、搏冷优化 1、博热优化 2
        }
    },
    computed: {
        // 计划总购买金额
        pay: {
            get() {
                let pay = this.$store.state.pay;
                return pay === 0 ? this.toPay : pay;
            }
        },
        ...mapState([
            'result', 'bonusInfo', 'isCanOptimizeEx'
        ])
    },
    methods: {
        /**
         * 初始化奖金
         */
        initBonus(){
            let type = this.optimizeType;
            this.$store.dispatch('initBonus', { type }).then(() => {
                this.minPay = this.bonusInfo ? this.bonusInfo.amount * this.bonusInfo.ticketValue : 0;
            });
        },
        /**
         * 改变优化方案触发
         * @param type
         */
        changeOptimize(type) {
            if(type === this.optimizeType){
                return;
            }
            if(type !== 0 && !this.isCanOptimizeEx){
                return;
            }
            if(this.toPay !== 0){
                this.changePlanPay(this.toPay);
            }
            if(this.pay < this.minPay){
                dialogCommon.alert('计划购买金额不得小于' + this.minPay + '，请重新输入再进行优化');
                return;
            }
            if(this.pay%2 !== 0){
                dialogCommon.alert('请输入偶数金额进行优化');
                return;
            }

            if(type >= 0){
                this.$store.dispatch('changeOptimize', { type }).then(() => {
                    this.optimizeType = type;
                });
            }else{
                this.optimizeType = type;
            }
        },
        /**
         * 改变单注金额时触发
         * @param item  对应串关方式
         * @param value 对应改变注数
         */
        changeOnePrice(item, value) {
            this.$store.dispatch('changeBonusPayment', {
                key: item.key,
                pay: +value * 2
            });
        },
        /**
         * 改变计划购买金额
         * @param value
         */
        changePlanPay(value) {
            this.$store.dispatch('changeBonusPayment', {
                key: '',
                pay: +value
            });
        },
        /**
         * 捕获输入金额
         * @param e
         */
        handlePayEnter(e) {
            let tar = e.currentTarget;
            let val = tar.value;
            let reg = /^\d+$/;
            if(!reg.test(val) && val !== ''){
                val = +val.replace(/[^\d]/g,'');
                tar.value = val;
            }
            this.toPay = val;       // 设置toPay值
            if(this.toPay !== this.pay){
                this.optimizeType = -1; // 改变优化方案为非默认
                this.changePlanPay(0);  // 置空注项注数
            }
        }
    },
    created() {
        this.initBonus();
    }
});

module.exports = betPlan;