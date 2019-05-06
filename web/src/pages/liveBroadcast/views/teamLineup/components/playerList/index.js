import Vue from 'vue';
import template from './index.template'
import './index.scss'
import '../../components/playerLine'

let PlayerList = Vue.component('player-list-vue', {
    props: {
        playerList: {
            default: Array       //球员对象
        }
    },
    template: template,
    watch: {
        playerList(val) {
            this.playerList = val;
        }
    }
});
module.exports = PlayerList;
