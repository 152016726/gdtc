/**
 * Created by DDT on 2018/10/9.
 */
import template from './index.template';
import Vue from 'vue';
import './index.scss';
import $ from 'jquery'

let matchHeader = Vue.component('match-header', {
    template: template,
    data() {
        return {
            show: true //是否显示
        }
    },
    props: {
        week: String,
        date: String,
        matchLength: Number
    },
    methods: {
        toggleMainContent(e) {
            this.show = !this.show;
        }
    }
});

module.exports = matchHeader;