import Vue from 'vue';
import './index.scss';
import template from './index.template';

module.exports = Vue.component('toggle-isHistory', {
   data(){
       return{
            strList: ['最新晒单', '昨日晒单'],
            activeIndex: 1
       }
   },
   template,
   props:{

   },
   methods:{
       itemClick(val){
           this.activeIndex = val;
           this.$emit('setIsHistory', val===1);
       }
   },
   created(){

   }
});