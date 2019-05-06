/**
 * Created by easyLottoMac_Feng on 2018/12/18.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';


let _objSelectMarketBox = {}; //保存所有filter-box组件

module.exports = Vue.component('analysis-select-common-view', {
    data() {
        return {
            isShow: false
        }
    },
    props: {
        titleText: {
            default: ''
        }
    },
    template,
    created() {
        _objSelectMarketBox[`uid_${this._uid}`] = this;
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
    methods: {
        /**
         * 鼠标移入展示弹窗
         */
        mouseOverHandle() {
            this.isShow = true;
            this.hideOtherSelectMarketBox();
        },
        /**
         * 影藏其他弹窗
         */
        hideOtherSelectMarketBox() {
            for(let i in _objSelectMarketBox) {
                if(this.isShow && _objSelectMarketBox[i]._uid !== this._uid) {
                    _objSelectMarketBox[i].isShow = false;
                }
            }
        },
        /**
         * 点击容易以外的地方隐藏容器
         * @param e
         */
        handleClose(e){
            this.isShow = false;
        }
    }
});
