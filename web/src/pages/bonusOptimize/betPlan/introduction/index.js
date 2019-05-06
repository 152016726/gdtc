import Vue from 'vue';
import './index.scss';
import $ from 'jquery';
import template from './index.template';

module.exports = Vue.component('introduction', {
    data() {
        return {
            isFold: false     // 是否展开
        }
    },
    template,
    props: {

    },
    methods: {
        /**
         * 点击展开与收起选项栏
         */
        tabClick() {
            console.log(123);
            this.isFold = !this.isFold;
        }
    },
    mounted() {
        $(document).click(() => {
            this.isFold = false;
        });
        // 阻止冒泡
        $(".introduction").click(function (event) {
            event.stopPropagation();
        });
    }
});