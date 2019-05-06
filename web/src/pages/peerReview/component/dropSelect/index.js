/**
 * Created by easyLottoMac_Feng on 2019/2/14.
 */
import './style.scss';
import Vue from 'vue';
import template from './index.template';

module.exports = Vue.component('peer-review-drop-select', {
    data(){
        return{
            isShow: false
        }
    },
    template,
    props:{
        contentArr: { // 下拉展示的内容
            default: function () {
                return []
            }
        },
        selectValue: {     // 选中的选项下拉坐标
            default: 0
        },
        titleText: {       // 选中需要展示的文字
            default: ''
        },
        selectHandleCallBack: {} // 下拉框内容的点击事件
    },
    created(){},
    methods: {
        /**
         * 是否展示下拉框
         */
        showToggleHandle() {
            this.isShow = !this.isShow;
        },
        /**
         * 下拉框内容点击事件
         */
        selectHandle (data){
            this.isShow = false;
            // 父组件回调
            this.selectHandleCallBack && this.selectHandleCallBack (data)
        },
        /**
         * 点击容器以外地方隐藏容器
         */
        handleClose() {
            this.isShow = false;
        }
    },
    directives: {
        //实现点击容器以外的地方隐藏容器
        clickOutside: {
            // 初始化指令
            bind(el, binding, vnode) {
                function documentHandler(e) {
                    // 这里判断点击的元素是否是本身，是本身，则返回
                    if (el.contains(e.target)) {
                        return false;
                    }
                    // 判断指令中是否绑定了函数
                    if (binding.expression) {
                        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                        binding.value(e);
                    }
                }
                // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
                el.__vueClickOutside__ = documentHandler;
                document.addEventListener('click', documentHandler);
            },
            unbind(el, binding) {
                // 解除事件监听
                document.removeEventListener('click', el.__vueClickOutside__);
                delete el.__vueClickOutside__;
            },
        }
    },
});