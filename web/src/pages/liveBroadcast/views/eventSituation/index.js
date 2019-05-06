import Vue from 'vue';
import template from './index.template'
import util from '@easylotto/util';
import './index.scss';
import './eventTimeBar';
import './strokeAnalysis';

let EventSituation = Vue.component('event-situation-vue', {
    data() {
        return{
            vid: '',
            isTimeData: true,
            isStrokeData: true
        };
    },
    template: template,
    /**
     * 页面加载完成
     */
    created() {
        let vars = util.getUrlVars();
        if(vars.vid){
            this.vid = vars.vid;
        }
    },
    methods: {
        updateNoTimeData() {
            this.isTimeData = false;
        },
        updateNoStrokeData() {
            this.isStrokeData = false;
        }
    }
});

module.exports = EventSituation;