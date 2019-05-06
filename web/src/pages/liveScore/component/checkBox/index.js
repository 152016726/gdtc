/**
 * Created by easyLottoMac on 2018/9/27.
 */

import "./index.scss";
import Vue from "vue";
import template from "./index.template";

let betslip = Vue.component('checkBox', {
    template: template,
    /**
     * ops: 配置项
     * isChecked: 是否被选中
     * clickHook: 点击事件的勾, 返回一个bool值以控制isChecked状态
     */
    props: {
        ops: {}
    },
    methods: {
        clickHandle() {
            this.ops.isChecked = this.ops.clickHook ? this.ops.clickHook(this) : !this.ops.isChecked;
            this.ops.afterClick && this.ops.afterClick();
        }
    }
});

module.exports = betslip;










































