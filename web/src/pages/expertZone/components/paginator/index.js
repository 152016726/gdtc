import Vue from 'vue';
import './index.scss';
import template from './index.template';

module.exports = Vue.component('paginator', {
    data(){
        return {
            activeIndex: 0
        }
    },
    props:{
        paginations: {default: []},
        count: {default: ''}
    },
    template,
    methods:{
        setIndex(index){
            this.activeIndex = index;
            this.$emit('setPageIndex', index+1)
        }
    },
    created(){

    }
});