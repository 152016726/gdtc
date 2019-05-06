import Vue from 'vue';
import './index.scss';
import template from './index.template';

module.exports = Vue.component('toggle-types',{
    data(){
        return {
            strList: ['全部', '胜平负2串1', '单关', '总进球'],
            activeIndex: 0
        }
    },
    template,
    props:{

    },
    methods:{
       itemClick(val){
           this.activeIndex = val;
           this.$emit('setType', val)
       }
    },
    created(){

    }
});