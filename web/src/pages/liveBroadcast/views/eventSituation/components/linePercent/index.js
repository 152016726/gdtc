import Vue from 'vue';
import template from './index.template';
import './index.scss';
import {
    SUBSTITUTION_OF_PLAYERS,
    FULL_TIME_END
} from 'constants/matchEventType';
import typeImageMap from '../../typeImageMap';

let EventTimeSide = Vue.component('line-percent', {
    data() {
        return {
            percent: '0'    // 显示百分比
        }
    },
    props: {
        type: {
            default: ''     // 事件类别
        },
        title: {            // 数据标题
            default: false
        },
        left: {             // 左数据
            default: '0'
        },
        right: {            // 右数据
            default: '0'
        }
    },
    template: template,
    /**
     * 页面加载完成
     */
    created() {
        let left = this.left;
        let right = this.right;
        let percent = 0;
        left = +left;
        right = +right;
        if(+left !== 0 || +right !== 0){
            percent = left/(left + right) * 100;
        }
        if(+left === 0 && +right === 0){
            percent = 50;
        }
        this.percent = percent + '';
    }
});

module.exports = EventTimeSide;