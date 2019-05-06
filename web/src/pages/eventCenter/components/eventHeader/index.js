import './index.scss';
import Vue from 'vue';
import template from './index.template';

module.exports = Vue.component('event-header',{
    data(){
        return {
            defaultIndex: 0             // 默认选中的蓝
        }
    },
    props: {
        list:{default:[]}
    },
    template,
    methods:{
        /**
         * 头部点击事件
         * @param index
         * @param id        一级ID
         */
        itemClick(index, id){
            this.defaultIndex = index;
            this.$emit('setCountryList', id)
        }
    }
});