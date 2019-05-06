/**
 * Created by easyLottoMac on 2018/9/27.
 */

import "./index.scss";
import Vue from "vue";
import template from "./index.template";
import $ from "jquery";


let betslip = Vue.component('SelectNumBox', {
    template: template,
    /**
     * ops: 配置项
     * value: 值
     * min: 最小值
     * max: 最大值
     * delta: 步长 默认0
     * onChange: 点击回调, 默认传参: value - 点击之后的值
     */
    props: ["ops"],
    mount(){
        this.ops.delta = this.ops.delta || 0;
    },
    methods: {
        clickHandle(isAdd){
            let _delta = isAdd ? this.ops.delta : -this.ops.delta;
            let result = parseFloat(this.ops.value) + _delta;
            if(this.ops.min && result < this.ops.min){
                result = this.ops.min;
            }
            if(this.ops.max && result > this.ops.max){
                result = this.ops.max;
            }
            this.ops.value = result;
            this.ops.onClick && this.ops.onClick(result);
        }
    },
    watch: {
        "ops.value"(newValue, oldValue){
            this.ops.onChange && this.ops.onChange(newValue);
        }
    }

});

module.exports = betslip;










































