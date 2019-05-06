import Vue from 'vue';
import './index.scss';
import template from './index.template';
import '../modules/expertList';
import '../modules/slipsList';

let expertView = Vue.component('expert-view', {
    data(){
        return{

        }
    },
    template,
    methods:{

    },
    created(){
    }
});

module.exports = expertView;