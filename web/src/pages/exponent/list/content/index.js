import Vue from "vue"
import tpl from "./index.template"
import 'pages/raceCourse/component/betOutCome/index'

module.exports = Vue.component('exponent-list-content', {
    props: {
        data: {
            default: []
        }
    },
    template: tpl,
    methods:{
        getCode(completeNo){
            return completeNo.substr(-3);
        },
        getSortDate(date) {
            return Date.prototype.parseISO8601(date).format('MM-dd hh:mm');
        }
    }
});
