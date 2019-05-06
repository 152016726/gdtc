/**
 * Created by easyLottoMac on 2018/11/8.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';
import '../common';

let _selectArr = [];            // 记录所有的联赛 id
let _propSelect = [];           // 记录点击确认之后的联赛 id 默认为全部联赛 id

let score_match_filter = Vue.component('handicap-filter', {
    data() {
        return {
            selectArr: [],      // 选中的联赛集合
            show: false
        }
    },
    template,
    props: {
        leagueArr: {
            default: []
        },
        submitCb: {}            // 父级回调
    },
    watch: {
        leagueArr: function () {
            this.initSelectArr();
        }
    },
    created() {
        this.initSelectArr();
    },
    methods: {
        initSelectArr(){
            this.selectArr = [];
            _selectArr = [];
            this.leagueArr.forEach((la) => {
                this.selectArr.push(la.id);
                _selectArr.push(la.id)
            });
            _propSelect = _selectArr.slice(0);
        },
        /**
         * 赛事筛选的回调
         */
        updateSubmitCb() {
            this.submitCb({
                selectArr: this.selectArr
            })
        },
        /**
         * 全选事件
         */
        checkAllHandle() {
            this.selectArr = _selectArr;
        },
        /**
         * 反选事件
         */
        reverseSelectionHandle() {
            let select = this.selectArr;
            let newSelect = _selectArr.filter((sl) => {
                return select.indexOf(sl) === -1
            });
            this.selectArr = newSelect;
        },
        /**
         * 确认事件
         */
        enterHandle() {
            this.updateSubmitCb();
            this.show = false;
            _propSelect = this.selectArr;
        },
        /**
         * 取消事件
         */
        cancelHandle() {
            this.show = false;
            this.selectArr = _propSelect;
        },
        /**
         * 赛事筛选框的隐藏与显示
         */
        toggleMainContent(fag) {
            if (fag === 1) {
                this.show = false;
            } else {
                this.show = !this.show;
            }
            this.selectArr = _propSelect;
        }

    }
});

module.exports = score_match_filter;