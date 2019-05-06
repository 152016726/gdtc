import Vue from 'vue';
import './index.scss';
import template from './index.template';
import getStageList from 'services/getStages';

module.exports = Vue.component('stage-list', {
    data(){
        return {
            stageList: [],
            currentIndex: ''
        }
    },
    template,
    props:{
        lid: {default: ''},
        seasonId: {default: ''}
    },
    watch:{
        // 监测seasonId改变后重新请求数据
        seasonId(val){
            getStageList.getData({
                lid: this.lid,
                seasonId: val
            }).then(rsp=>{
                this.stageList = rsp.data.list;
                rsp.data.list.every((item, index)=>{
                    if(item.isCurrentStage === 'true'){
                        this.currentIndex = index;
                        this.$emit('setStage', item.stageId);
                        this.$emit('setStageName', item.stageName);
                        return false;
                    }else{
                        return true;
                    }
                })
            }, rej=>{
                this.stageList = [];
                console.log(rej.rspMsg);
            })
        }
    },
    methods:{
        /**
         * 选择阶段
         * @param val
         * @param index
         */
        itemClick(val, index){
            this.currentIndex = index;
            this.$emit('setStage', val.stageId);
            this.$emit('setStageName', val.stageName);
        }
    },
    created(){
        getStageList.getData({
            lid: this.lid,
            seasonId: this.seasonId
        }).then(rsp=>{
            this.stageList = rsp.data.list;
            rsp.data.list.forEach((item, index)=>{
                if(item.isCurrentStage === 'true'){
                    this.currentIndex = index;
                    this.$emit('setStage', item.stageId);
                    this.$emit('setStageName', item.stageName);
                }
            })
        }, rej=>{
            console.log(rej.rspMsg);
        })
    }
});