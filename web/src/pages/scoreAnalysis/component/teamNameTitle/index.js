/**
 * Created by easyLottoMac on 2018/12/4.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../selectCompent/singleSelection';
import '../selectCompent/multipleSelection';

module.exports = Vue.component('analysis-team-name-title', {
    data() {
        return {}
    },
    template,
    props: {
        typeNum: {           // 0=> 代表主 1=> 代表客
            default: 0
        },
        teamName: {          // 队名
            default: ''
        },
        teamShortName: {
            default: ''
        },
        isShowRight: {       // 是否显示右边筛选框
            default: false
        },
        fieldTitleText: {
            default: ''
        },
        fieldTextLis: {
            default: function () {
                return []
            }
        },
        fieldHandle: {},
        marketTitleText: {
            default: ''
        },
        marketLis: {
            default: function () {
                return []
            }
        },
        leagueSelectHandle: {},
        fieldActiveIndex: {
            default: 0
        },
        fieldMarketTitleText: {
            default: ''
        },
        marketTeams: {
            default: function () {
                return []
            }
        },
        fieldMarketActiveIndex: {
            default: 0
        },
        fieldMarketHandle: {}
    },
    created() {
    }
});