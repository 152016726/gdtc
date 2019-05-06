/**
 * 未来五场模块
 * Created by easyLottoMac on 2018/12/5.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../component/subTitleView';
import '../component/teamNameTitle';
import getFiveFuture from 'services/getFiveFuture';

module.exports = Vue.component('analysis-future-five', {
    data() {
        return {
            textStr: '未来五场',
            dataList: [
                {
                    title: 'home',
                    teamName: '',
                    teamShortName: ''
                },
                {
                    title: 'away',
                    teamName: '',
                    teamShortName: ''
                }
            ],
            eventsList:{},          // 赛事信息列表
            homeName: '',           // 主队全称
            awayName: '',           // 客队全称
            homeShortName: '',      // 主队简称
            awayShortName: '',      // 客队简称
            eventInfo: {}           // 比赛信息
        }
    },
    template,
    props: {
        vid: {
            default: ''
        }
    },
    created() {
        let vid = this.vid;
        getFiveFuture.getData({vid, count: '5'}).then(rsp => {
            let rspData = rsp.data;
            if(rspData.home && rspData.home.length) {
                this.eventsList = rspData;
            }else {
                this.$store.dispatch('setFutureFive');
            }
        },req => {
            this.$store.dispatch('setFutureFive');
        })
    },
    updated() {
        // 获取比赛的赛事信息
        this.eventInfo = this.$store.state["eventInfo"];
        this.dataList.forEach(DL => {
            DL.teamName = this.eventInfo[DL.title + 'Name'];
            DL.teamShortName = this.eventInfo[DL.title + 'ShortName'];
        });
    }
});