import './style.scss';
import Vue from "vue";
import template from './index.template';

module.exports = Vue.component('detailItem', {
    data() {
        return {
            strArr: []                  // 展示的公式
        }
    },
    props: {
        number: {default: 0},          // 场数
        detailItems: {                 // 拆分详细的对象数组
            type: [Object, Array],
            default: () => {
                return {}
            }
        },
        ratio: {default: 0}           // 倍数
    },
    template: template,
    watch: {                         // 监测拆分数组的变化并转化格式为可展示的公式
        detailItems: function (cur, old) {
            console.log(cur);
            this.strArr = cur.expression.split("*");
        }
    }
});
