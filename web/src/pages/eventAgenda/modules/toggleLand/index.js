import Vue from 'vue';
import './index.scss';
import template from './index.template';
import down from '../../images/down.png';
import right from '../../images/right.png';
import '../../components/toggleItem';
import getCountrysService from 'services/getCountrys';

module.exports = Vue.component('toggle-land',{
    data(){
        return{
            down,                 // 展开图标
            right,              // 闭合标签
            isShowIsland: false, // 是否展开
            list: []
        }
    },
    template,
    props: {
        fid:{default: ""},                  // 默认的一级ID
        sid:{default: ""},                  // 默认的二级ID
        lid:{default: ""},                  // 默认的三级ID
        event:{default:{id: '', name: ''}}, // 当前联赛对象
    },
    methods:{
        /**
         * 开关左边赛事区域
         */
        toggleLeagueInfo(){
            this.isShowIsland = !this.isShowIsland;
            if(this.isShowIsland){
                this.$emit('setDefaultFid', this.event.id)
            }
        },
        /**
         * 设置二级id
         */
        setDefaultSid(val){
            this.$emit('setDefaultSid', val)
        },
        /**
         * 设置联赛信息
         */
        setDefaultInfo(val){
            this.$emit('setDefaultRankType', '1');
            this.$emit('setDefaultLid', val.id);
            this.$emit('setDefaultSeasonId', val.seasonId);
            this.$emit('setDefaultName', val);
            this.$emit('setDefaultStageName', val.stageName)
        }
    },
    mounted(){
        if(this.fid === this.event.id){
            this.isShowIsland = true;
        }
    },
    created(){
        getCountrysService.getData({
            id: this.event.id
        }).then(rsp=>{
            this.list = rsp.data.list;
        }, rej=>{
            console.log(rej.rspMsg);
        })
    }
});