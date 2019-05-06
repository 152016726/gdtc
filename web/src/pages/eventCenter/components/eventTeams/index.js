import './index.scss';
import template from './index.template';
import Vue from 'vue';

module.exports = Vue.component('event-teams', {
    data(){
        return{
            defaultIndex: 0,
        }
    },
    props: ["options"],
    template,
    methods:{
        /**
         * 点击事件
         * @param index
         */
        itemClick(index){
            this.defaultIndex = index;
        }
    }
});