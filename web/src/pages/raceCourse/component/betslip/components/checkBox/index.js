/**
 * Created by easyLottoMac on 2018/9/27.
 */

import "./index.scss";
import Vue from "vue";
import template from "./index.template";
import $ from "jquery";


let betslip = Vue.component('betslipCheckBox', {
    template: template,
    /**
     * ops: 配置项
     * isChecked: 是否被选中
     * text: 文本
     * isExtend: 是否扩展(右侧多了箭头)
     * clickHook: 点击事件的勾, 返回一个bool值以控制isChecked状态
     */
    props: {
        ops: {},
        useIsDownFromParent: false,
        isDownFromParent: false
    },
    data() {
        return {
            isDown: false
        }
    },
    computed: {
        _isDown: function () {
            return this.useIsDownFromParent ? this.isDownFromParent : this.isDown;
        }
    },
    methods: {
        clickHandle() {
            this.ops.isChecked = this.ops.clickHook ? this.ops.clickHook(this) : !this.ops.isChecked;
            this.ops.afterClick && this.ops.afterClick(this);
        }
    }
});

module.exports = betslip;










































