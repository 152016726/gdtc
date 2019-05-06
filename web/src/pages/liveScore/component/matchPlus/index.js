import './style.scss';
import template from './index.template';
import Vue from 'vue';

module.exports = Vue.component('match-plus', {
    data() {
        return {}
    },
    template,
    props: {
        event: {
            default: {}
        }
    },
    created() {},
    methods: {}
});