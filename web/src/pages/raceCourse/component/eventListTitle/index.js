/**
 * Created by easyLottoMac on 2018/9/29.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';
import '../sortButton';

let event_list_title = Vue.component('event-list-title', {
    data() {
        return {
            scroll: '0', //页面滚动的距离
            isFlex: false, //是否固定表头
            eventTitleOffset: 0, //赛事表头的左下角距离顶部的距离
        }
    },
    template: template,
    props: {
        callbackHandle: {}  //回调
    },
    mounted() {
        // 记录页面滚动一定位置的时候表头固定页顶
        let eventDom = document.querySelector('#event_list_title');
        this.eventTitleOffset = eventDom.offsetTop + eventDom.offsetParent.offsetTop;
        window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        /**
         * 根据页面滚动固定表头
         */
        handleScroll() {
            this.scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (this.scroll > this.eventTitleOffset) {
                this.isFlex = true;
                this.callbackHandle(this.isFlex);
            } else {
                this.isFlex = false;
                this.callbackHandle(this.isFlex);
            }
        }
    },
    /**
     * 组件销毁事件，移除组件的滚动事件
     */
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },

});

module.exports = event_list_title;