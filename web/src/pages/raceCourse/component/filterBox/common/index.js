import template from './index.template';
import Vue from 'vue';
import './index.scss';

let _zIndex = 3; //防止后面的filter-box组件挡住前面的filter-box组件，每创建组件一次加一
let _objFilterBox = {}; //保存所有filter-box组件
/**
 *需要调用这同时传show(是否显示内容)和toggleMainContent(内容的显示隐藏切换)
 */
module.exports = Vue.component('filter-box', {
    template: template,
    data() {
        return {
            zIndexBackUp: 1,
            show: false
        }
    },
    props: {
        text: String,
        showCloseBtn: {
            default: false   //是否显示关闭按钮
        },
        // show: {
        //     default: false   //是否显示内容
        // },
        toggleMainContent: {} //内容的显示隐藏切换
    },
    created() {
        _zIndex++;
        this.zIndexBackUp = _zIndex;
        _objFilterBox[`uid_${this._uid}`] = this;
    },
    // destroyed() {
    //     _zIndex--;
    //     delete _objFilterBox[`uid_${this._uid}`];
    // },
    computed: {
        zIndex: function () {
            if (this.show) {
                return this.zIndexBackUp + 100;
            }
            else {
                return this.zIndexBackUp;
            }
        }
    },
    methods: {
        /**
         * 显示或隐藏
         */
        toggleMainContentSelf() {
            // if (!this.show) {
            //     this.hideOtherFilterBox();
            // }
            this.show = !this.show;
            // this.toggleMainContent();
        },
        /**
         * 隐藏其他filter-box
         */
        hideOtherFilterBox() {
            for (let i in _objFilterBox) {
                if (_objFilterBox[i].show && _objFilterBox[i]._uid !== this._uid) {
                    _objFilterBox[i].toggleMainContentSelf();
                }
            }
        },
        /**
         * 容器的展示与隐藏
         */
        handleClose() {
            //切换箭头方向
            this.show = false;
            // this.hideOtherFilterBox();

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