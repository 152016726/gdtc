import Vue from 'vue';
import template from './index.template'
import './index.scss'

require('../teamVs');
require('../playerCycle');

let Lineup = Vue.component('lineup-vue', {
    props: {
        formation: {
            default: {}       //主客阵型对象
        },
        awayLineCfg: {
            default: Array    //客队阵型数组
        },
        homeLineCfg: {
            default: Array    //主队阵型数组
        },
        isData: {
            default: Boolean   //是否有数据
        },
        homeFormation: {
            default: String    //主队阵型字符串
        },
        awayFormation: {
            default: String    //客队阵型字符串
        }
    },
    template: template,
    computed: {
        isShowPlayground() {
            return JSON.stringify(this.formation) !== '{}'
        }
    },
    watch: {
        formation(val) {
            this.formation = val
        },
        homeLineCfg(val) {
            this.homeLineCfg = val
        },
        awayLineCfg(val) {
            this.awayLineCfg = val
        }
    }
});
module.exports = Lineup;
