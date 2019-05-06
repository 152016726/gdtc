import template from './index.template';
import Vue from 'vue';
import './index.scss';
import '../common';
import dialogCommon from '../../../../../component/dialogCommon';

module.exports = Vue.component('odds-filter', {
    template: template,
    data() {
        return {
            btnVal: '',   //选中的按钮值
            minVal: '',   //自定义输入框开始值
            maxVal: '',   //自定义输入框结束值
        }
    },
    props: {
        buttonsArr: { //赔率按钮数组
            default: function () {
                return [
                    {
                        text: '全部',
                        id: '-1#-1'
                    },
                    {
                        text: '1.5以下',
                        id: '-1#1.5'
                    },
                    {
                        text: '1.5-2.0',
                        id: '1.5#2.0'
                    },
                    {
                        text: '2.0以上',
                        id: '-1#2.0'
                    }
                ]
            }
        },
        submitCb: {} //父级回调
    },
    computed: {
        getMinAndMax: function () {
            let min, max, arr;
            if (this.minVal === '' && this.maxVal === '') {
                arr = this.btnVal.split('#');
                min = arr[0];
                max = arr[1];
            }
            else {
                min = this.minVal;
                max = this.maxVal;
            }
            return {
                min,
                max
            }
        },
        _minVal() {
            return this.minVal;
        },
        _maxVal() {
            return this.maxVal;
        },
        nochecked: function () {
            return this.minVal !== '' || this.maxVal !== '';
        },
    },
    created() {
        this.btnVal = this.buttonsArr[0].id; //设置buttonsArr第一个id为btnVal默认值
    },
    methods: {
        changeBtnVal(id) {
            if (this.nochecked) {
                return;
            }
            this.btnVal = id;
        },
        /**
         * 提交表单
         */
        submitFilter() {
            let {min, max} = this.getMinAndMax;
            if (min !== '' && max !== '' && max - min < 0) {
                dialogCommon.alert('最大值不能小于最小值！');
            }
            else {
                this.submitCb({
                    min: Number(min),
                    max: Number(max)
                });
                this.$refs.filterBox.toggleMainContentSelf();
            }
        },
        /**
         * 取消按钮
         */
        cancelFilter() {
            this.show = false;
            this.$refs.filterBox.toggleMainContentSelf();
        },
        /**
         * 输入框值改变处理Min
         */
        changeMinInputVal(e) {
            this.changeInputVal(e, 'minVal');
        },
        /**
         * 输入框值改变处理Max
         */
        changeMaxInputVal(e) {
            this.changeInputVal(e, 'maxVal');
        },
        /**
         * 同一处理输入框值改变处理
         */
        changeInputVal(e, type) {
            let val = e.target.value;
            if (/(^(-){0,1}\d+(?=\.{0,1}\d*$|$)|^$)/.test(val)) {
                this[type] = val;
            } else {
                e.target.value = this[type];
            }
        },
    }
});