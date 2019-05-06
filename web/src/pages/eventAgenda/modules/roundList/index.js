import Vue from 'vue';
import $ from 'jquery';
import './index.scss';
import template from './index.template';
import getRoundList from 'services/getRounds';

module.exports = Vue.component('round-list', {
    data() {
        return {
            roundList: [],        // 轮次List
            currentIndex: '',     // 默认展示的轮次索引
            activeIndex: '',      // 正在进行的轮次索引
            roundName: ''         // 轮次名
        }
    },
    template,
    props: {
        lid: {default: ''},           // 联赛ID
        seasonId: {default: ''},      // 赛季ID
        stageId: {default: ''},       // 阶段ID
        stageName: {default: ''}
    },
    watch: {
        stageId(val) {
            getRoundList.getData({
                lid: this.lid,
                seasonId: this.seasonId,
                stageId: val
            }).then(rsp => {
                this.roundList = rsp.data.list;
                // 标记位
                let flag = true;
                rsp.data.list.every((item, index) => {
                    if (item.isCurrentRound === 'true') {
                        flag = false;
                        this.currentIndex = index;
                        this.activeIndex = index;
                        this.roundName = item.roundName;
                        this.$emit('setRound', item.roundId);
                        return false
                    } else {
                        return true
                    }
                });
                // 如果没有当前轮次则默认第一个
                if(flag){
                    this.currentIndex = 0;
                    this.activeIndex = 0;
                    this.roundName = rsp.data.list[0].roundName;
                    this.$emit('setRound', rsp.data.list[0].roundId);
                }
            }, rej => {
                this.roundList = [];
                console.log(rej.rspMsg);
            })
        }
    },
    methods: {
        itemClick(val, index){
            this.currentIndex = index;
            this.roundName = val.roundName;
            this.$emit('setRound', val.roundId);
        }
    },
    created() {
        getRoundList.getData({
            lid: this.lid,
            seasonId: this.seasonId,
            stageId: this.stageId
        }).then(rsp => {
            this.roundList = rsp.data.list;
            rsp.data.list.every((item, index) => {
                if (item.isCurrentRound === 'true') {
                    this.currentIndex = index;
                    this.activeIndex = index;
                    this.roundName = item.roundName;
                    this.$emit('setRound', item.roundId);
                    return false
                } else {
                    return true
                }
            })
        }, rej => {
            console.log(rej.rspMsg);
        })
    }
});