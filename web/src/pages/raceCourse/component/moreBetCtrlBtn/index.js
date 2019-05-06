/**
 * Created by owen on 2018/10/12.
 */

import "./index.scss";
import Vue from "vue";
import template from "./index.template";
import games from '@easylotto/bet';

let _objMoreBetCtrlBtn = {}; //保存所有moreBetCtrlBtn组件
let bet_outcome = Vue.component('moreBetCtrlBtn', {
    data() {
        return {     //是否展开
            active: false
        }
    },
    props: {
        hidingText: {  //收起时的文字
            default: '展开'
        },
        openingText: { //展开时的文字
            default: '收起'
        },
        selectedBet: { //选中多少场比赛
            default: 0
        },
        row: {         //属于第几行
            default: 0
        },
        marketSort: {
            default: ''
        },
        isCenter: {
            default: false
        },
        clickHandleCb: {} //外面点击回调
    },
    created() {
        _objMoreBetCtrlBtn[`uid_${this._uid}`] = this;
    },
    destroyed() {
        delete _objMoreBetCtrlBtn[`uid_${this._uid}`];
    },
    template: template,
    methods: {
        /**
         * 切换选中状态
         * @param el
         */
        clickHandle(el) {
            let active = !this.active;
            if (active) {
                this.hideOtherMoreBetCtrlBtn();
            }
            this.active = active;
            this.clickHandleCb(active, this.marketSort);
        },
        /**
         * 隐藏其他moreBetCtrlBtn
         */
        hideOtherMoreBetCtrlBtn() {
            for (let i in _objMoreBetCtrlBtn) {
                if (_objMoreBetCtrlBtn[i].active &&
                    _objMoreBetCtrlBtn[i].row === this.row &&
                    _objMoreBetCtrlBtn[i]._uid !== this._uid) {
                    _objMoreBetCtrlBtn[i].active = false;
                }
            }
        }
    }
});

module.exports = bet_outcome;

