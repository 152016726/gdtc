import Vue from 'vue';
import template from './index.template'
import './index.scss'

let LiveItem = Vue.component('live-item-vue', {
    template: template,
    props: {
        text: {
            default: String
        },
        time: {
            default: String
        },
        sysTime: {
            default: String
        },
        isLast: {
            default: Boolean
        },
        isFirst: {
            default: Boolean
        }
    }
});
module.exports = LiveItem;