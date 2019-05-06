/**
 * Created by easyLottoMac on 2018/9/29.
 */

import './index.scss';
import template from './index.template';
import Vue from 'vue';

let sort_button = Vue.component('sort-button', {
    data(){
        return {
            isUp: false  //是否显示容器
        }
    },
    props:{
        titleText:{
            default: ''
        }
    },
    template: template,
    created(){},
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
    methods: {
        /**
         * 容器的展示与隐藏
         */
        clickHandle(){
            //切换箭头方向
            this.isUp = !this.isUp;
        },
        /**
         * 点击容易以外的地方隐藏容器
         * @param e
         */
        handleClose(e){
            this.isUp = false;
        }
    }
});

module.exports = sort_button;