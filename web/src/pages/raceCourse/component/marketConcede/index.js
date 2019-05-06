/**
 * Created by easyLottoMac_Feng on 2019/2/22.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';

module.exports = Vue.component('market-concede', {
    data() {
        return {}
    },
    props: {
        marketOdds: {           // 判断是否开售
            default: function () {
                return {}
            }
        },
        dgStatus: {             // 单关是否开售
            default: '0'
        },
        handicap: {             // 让球数
            default: '0'
        },
        isShow: {               // 是否显示
            default: true
        }
    },
    template,
    created() {
    }
});