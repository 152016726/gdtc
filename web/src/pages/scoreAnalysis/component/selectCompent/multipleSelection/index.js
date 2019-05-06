/**
 * Created by easyLottoMac_Feng on 2018/12/18.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../common';

module.exports = Vue.component('analysis-multiple-selection-view', {
    data() {
        return {
            selectMarket: []
        }
    },
    template,
    props: {
        titleText: {
            default: ''
        },
        marketLis: {
            default: []
        },
        selectHandelCallBack: {}
    },
    methods: {
        selectHandel(index) {
            this.selectHandelCallBack(index);
        }
    }
});