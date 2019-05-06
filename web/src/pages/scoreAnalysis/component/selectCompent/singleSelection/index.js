/**
 * Created by easyLottoMac_Feng on 2018/12/18.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../common';

module.exports = Vue.component('analysis-single-selection-view', {
    data() {
        return {

        }
    },
    props: {
        titleText: {                // title 文字展示
            default: ''
        },
        textLi: {                   // 下拉文字展示
            default: []
        },
        activeIndex: {              // 选中的下拉文字
            default: 0
        },
        selectHandelCallBack: {}    // 父级回调
    },
    template,
    methods: {
        selectHandel(index) {
            this.selectHandelCallBack(index)
        }
    }
});