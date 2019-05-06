/**
 * 近期战绩模块
 * Created by easyLottoMac on 2018/12/4.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../component/recentRecordView';

module.exports = Vue.component('analysis-recent-record', {
    data () {
        return {
            textStr:'近期战绩'
        }
    },
    props: {
        vid: {
            default: ''
        }
    },
    template
});