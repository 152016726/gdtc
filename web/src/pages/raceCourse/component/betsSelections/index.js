import './style.scss';
import $ from 'jquery';
import Vue from 'vue';
import template from './index.template';
import dialog from 'component/dialogCommon';

module.exports = Vue.component('betsSelections', {
    props: {
        isSelected: {default: false}
    },
    template: template,
    computed: {
        // 投注详情
        betslip() {
            if (this.$store.state.betslip.length === 0) {
                this.$emit('toggleSelection', false);
            }
            return this.$store.state.betslip;
        }
    },
    methods: {
        /**
         * description   设胆
         * @param id     vid
         * @param $event 当前被点击DOM
         */
        setBanker(id, $event) {
            const flag = $($event.target).prop("checked");
            let value = {key: id, isBanker: flag};
            this.$store.dispatch('setBankerEventToBetslip', value);
        },
        /**
         * description   去除整个比赛
         * @param id
         */
        deleteItem(id) {
            this.$store.dispatch('deleteFromBetslip', id);
        },
        /**
         * description   去除指定玩法
         * @param arr    {Array}keys 型如"比赛id#玩法缩写#注项缩写"
         */
        deleteVal(keys) {
            this.$store.dispatch('deleteFromBetslip', keys);
        },
        /**
         * 关闭奖金明细窗口
         */
        close() {
            this.$emit('toggleSelection', false);
        },
        /**
         * 清空投注揽
         */
        clearBetslip() {
            dialog.alert("确定清空所有已选的比赛吗？", "提示", (el) => {
                el.close();
                this.$emit('clearBetslip');
            }, function (el) {
                el.close();
            });
        }
    }
});