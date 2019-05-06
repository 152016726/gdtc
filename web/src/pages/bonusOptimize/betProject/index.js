/**
 * 投注方案模块
 * Created by DDT on 2018/10/10.
 */
import template from './index.template';
import Vue from 'vue';
import { mapState } from 'vuex';
import './index.scss';

let betProject = Vue.component('bet-project', {
    template: template,
    data() {
        return {
            getOcHcapClass(oc) {
                return oc.data.handicap.charAt(0) === '-' ? 'minus_hcap_font' : 'plus_hcap_font';
            },
            getOddClass(oc) {
                let oddMatch = {
                    'homeOdds': 'win_font',
                    'drawOdds': 'draw_font',
                    'awayOdds': 'lose_font'
                };
                return oddMatch[oc.outcomeKey];
            }
        };
    },
    computed: mapState([
        'betslipInfo'
    ]),
    created(){}
});

module.exports = betProject;