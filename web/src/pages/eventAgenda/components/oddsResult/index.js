import Vue from 'vue';
import './index.scss';
import template from './index.template';

module.exports = Vue.component('odds-result', {
    data(){
        return {

        }
    },
    template,
    props:{
        homeOdds:{default: ''},
        drawOdds:{default: ''},
        awayOdds:{default: ''},
        homeGoalsScored:{default: ''},
        awayGoalsScored:{default: ''}
    },
    methods:{

    }
});