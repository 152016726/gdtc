import Vue from 'vue';
import template from './index.template'
import './index.scss'

let PlayerCycle = Vue.component('player-cycle-vue', {
    props: {
        player: {
            default: {}          //球员
        },
        isHome: {
            default: Boolean     //是否主队
        }
    },
    template: template,
    watch: {
        player(val) {
            this.player = val
        },
        isHome(val) {
            this.isHome = val
        },
    }
});
module.exports = PlayerCycle;
