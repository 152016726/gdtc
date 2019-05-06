/**
 * Created by easyLottoMac_Feng on 2019/3/7.
 */

import './style.scss';
import Vue from 'vue';
import template from './index.template';

module.exports = Vue.component('expert-group-li-view', {
    data() {
        return {
            fiveRate: '0',       // 近5中几
            isAttention: false
        }
    },
    props: {
        expertInfo: {       // 专家信息
            default: function () {
                return {}
            }
        },
        expertIcon: {       // 专家头像
            default: ''
        },
        nickname: {         // 专家昵称
            default: ''
        },
        expertSummary: {    // 专家简介
            default: ''
        },
        comboWin: {         // 连胜
            default: ''
        },
        fiveWinRate: {      // 近5中几的浮点数
            default: ''
        },
        eid: {              // 专家 Id
            default: ''
        }
    },
    template,
    created() {
        // 转换近5中几
        this.fiveRate = Math.round(5 * this.fiveWinRate);
    },
    methods: {
        /**
         * 关注按钮事件
         * @param flag
         */
        attentionHandle(flag) {
            // console.log(flag);
            this.isAttention = flag;
        }
    }
});