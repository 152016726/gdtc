/**
 * Created by easyLottoMac on 2018/12/3.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';

module.exports = Vue.component('analysis-sub-title-view', {
    props: {
        text: {
            default: '对赛往绩'
        },
        idName: {
            default: '#'
        }
    },
    template,
    created() {

    }
});