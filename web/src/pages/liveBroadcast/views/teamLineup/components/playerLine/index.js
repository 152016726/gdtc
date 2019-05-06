import Vue from 'vue';
import template from './index.template'
import './index.scss'


let PlayerLine = Vue.component('player-line-vue', {
    props: {
        player: {
            default: {}         //球员
        },
        isHome: {
            default: Boolean    //是否主
        },
        index: {
            default: Boolean    //下标
        }
    },
    template: template,
    watch: {
        player(val) {
            this.player = val
        },
        isHome(val) {
            this.isHome = val
        }
    }
});
module.exports = PlayerLine;
