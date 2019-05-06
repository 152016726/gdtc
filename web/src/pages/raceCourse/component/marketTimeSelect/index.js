/**
 * Created by easyLottoMac on 2018/10/10.
 */

import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../sortButton';

let marketTimeSelect  = Vue.component('market-time-select', {
    data(){
        return {
            titleText: '赛事时间',
            otherText:'截止时间',
            defText: '开赛时间'
        }
    },
    template: template,
    props: {
        noSort: {
            default: false
        }
    },
    methods: {
        /**
         * 切换赛事时间事件
         */
        timeHandle(){
            let str = this.titleText;
            this.titleText = this.otherText;
            this.otherText = str;
            // 调用父组件方法
            this.$emit('marketTimeHandleChild', this.otherText);
        }
    }
});

module.exports = marketTimeSelect;