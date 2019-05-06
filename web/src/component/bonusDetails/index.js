import './style.scss';
import Vue from "vue";
import $ from "jquery";
import template from './index.template';
import './components/detailItem';

module.exports = Vue.component('bonusDetails', {
    data() {
        return {
            isToggleClass: false,     // 控制页面不让外部滚动
            isBreak: false,           // 是否显示拆分明细
            number: 1,                // 合计中奖注数
            counts: 0,                // 合计注数
            mSnArr: [],               // 串关组合
            isMinStatus: false,       // 最小奖金的状态:true为明细，false为收起
            isMaxStatus: false,       // 最大奖金的状态:true为明细，false为收起
            detailItems: []           // 拆分明细
        }
    },
    props: ['options'],
    template: template,
    watch: {
        isToggleClass: (val) => {
            if (val) {
                $('body').addClass('preventScroll');
            } else {
                $('body').removeClass('preventScroll');
            }
        }
    },
    computed: {
        // 投注详情
        betslip() {
            // 复制获得投注篮信息
            let [...arr] = this.options["betslip"];
            arr.forEach((item) => {
                let oddsList = [];
                item.outcomes.forEach((val) => {
                    oddsList.push(val.odds);
                });
                item.maxOdds = Math.max.apply(null, oddsList);
                item.minOdds = Math.min.apply(null, oddsList);
            });
            this.number = arr.length;
            return arr;
        },
        // 是否展示
        isShowBonus() {
            this.isToggleClass = this.options["isShowBonus"];
            return this.options["isShowBonus"];
        },
        // 过关方式组合
        mSnObj() {
            let mSnObj = {}; // 改为m#n#p: 注数
            let mSnArr = []; // 存储所有的玩法
            this.counts = this.options["amount"];  //总共有多少注
            this.options["stickWays"] && this.options["stickWays"].forEach(function (ele) {
                if(ele.isCheck){
                    mSnObj[ele.key] = ele.ticketAmount;
                    if (mSnArr.indexOf(ele.key) === -1) {
                        mSnArr.push(ele.key);
                    }
                }
            });
            this.mSnArr = mSnArr; //所有的串关方式2#1#2，4#10#3为2串1和4串10等
            return mSnObj;
        },
        // 奖金
        totalBonus() {
            if (Object.keys(this.mSnObj).length === 0) {
                return {};
            } else {
                return this.options["bonusInfo"] ? this.options["bonusInfo"] : {};
            }
        }
    },
    methods: {
        /**
         *
         * @param item   最小奖金数组
         */
        toggleMin(item) {
            this.isMinStatus = !this.isMinStatus;
            if (this.isMinStatus) {
                //奖金明细
                this.detailItems = item;
                if (this.isMaxStatus) {         //与最大奖金状态的联动
                    this.isMaxStatus = false;
                }
                this.isBreak = true;
            } else {
                this.isBreak = false;
            }
        },
        /**
         *
         * @param item  最大奖金数组
         */
        toggleMax(item) {
            this.isMaxStatus = !this.isMaxStatus;
            if (this.isMaxStatus) {
                //奖金明细
                this.detailItems = item;
                if (this.isMinStatus) {      //与最小奖金状态的联动
                    this.isMinStatus = false;
                }
                this.isBreak = true;
            } else {
                this.isBreak = false;
            }
        },
        /**
         * 关闭奖金明细窗口
         */
        close() {
            this.$emit('toggleBonus', false);
            this.isToggleClass = false;
            // 重置状态
            this.isMinStatus = false;
            this.isMaxStatus = false;
            this.isBreak = false;
        }
    },
    mounted() {
        // $(document).click(()=>{
        //     this.$emit('toggleBonus',false);
        // });
        // //阻止冒泡
        // $(".bonusDetails .bonus").click(function(event) {
        //     event.stopPropagation();
        // });
    }
});
