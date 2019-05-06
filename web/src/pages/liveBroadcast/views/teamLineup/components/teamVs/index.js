import Vue from 'vue';
import template from './index.template'
import './index.scss'

let TeamVs = Vue.component('team-vs-vue', {
    template: template,
    props: {
        homeFormation: {
            default: String   //主队阵型
        },
        awayFormation: {
            default: String   //客队阵型
        }
    }
});

module.exports = TeamVs;