import './index.scss';
import Vue from 'vue';
import template from './index.template';
import localStore from "@easylotto/store";
import '../modules/toggleLand';
import '../modules/filterSeason';
import '../modules/stageList';
import '../modules/roundList';
import '../modules/teamList';
import '../modules/rankList';
import getAllContinentService from 'services/getMuseumGetAllContinent';
import getLeagueById from 'services/getLeagueById';
import getRuleForleague from 'services/getRuleForleague';
import {
    EVENT_LOCALL_STORE_KEY
} from "constants/localStoreKeys";

let eventAgenda = Vue.component('event-agenda', {
    data() {
        return {
            fid: '',                 // 当前联赛一级id
            sid: '',                 // 当前联赛二级id
            lid: '',                 // 当前联赛id
            seasonId: '',            // 当前赛季id
            seasonName: '',          // 当前赛季名称
            stageId: '',             // 当前阶段Id
            roundId: '',             // 当前轮次Id
            name: '',                // 当前联赛名
            shortName: '',           // 当前联赛简称
            stageName: '',           // 当前阶段名
            rankType: '1',           // 当前展示的排行榜（1:总积分；2：阶段积分；3：小组积分）
            isShowIsland: true,      // 是否展示欧洲赛事
            list: [],
            system: ''               // 赛制介绍
        }
    },
    props:{
        vid: {default: ''}
    },
    watch:{
        seasonId(val){
            getRuleForleague.getData({
                lid: this.lid,
                seasonId: val
            }).then(rsp => {
                this.system = rsp.data.system;
            }, rej => {
                console.log(rej.rspMsg);
            });
        }
    },
    template,
    methods: {
        /**
         * 设置一级联赛id
         */
        setDefaultFid(val) {
            this.fid = val;
        },
        /**
         * 设置二级联赛id
         */
        setDefaultSid(val) {
            this.sid = val;
        },
        /**
         * 设置联赛id
         */
        setDefaultLid(val) {
            this.lid = val;
        },
        /**
         * 设置联赛名称
         */
        setDefaultName(val){
            this.name = val.name;
            this.shortName = val.shortName;
        },
        /**
         * 设置赛季id
         * @param val
         */
        setDefaultSeasonId(val) {
            this.seasonId = val;
        },
        /**
         * 设置赛季名称
         * @param val
         */
        setDefaultSeasonName(val) {
            this.seasonName = val
        },
        /**
         * 设置阶段id
         * @param val
         */
        setDefaultStageId(val) {
            this.stageId = val;
        },
        /**
         * 设置阶段名称
         * @param val
         */
        setDefaultStageName(val){
            this.stageName = val;
        },
        /**
         * 设置轮次id
         * @param val
         */
        setDefaultRoundId(val) {
            this.roundId = val;
        },
        /**
         * 设置展示的积分榜类型
         * @param val
         */
        setDefaultRankType(val){
            this.rankType = val;
        }
    },
    created() {
        getAllContinentService.getData().then(rsp => {
            this.list = rsp.data.list;
        }, rej => {
            console.log(rej.rspMsg);
        });
        let eventInfo = localStore.get(EVENT_LOCALL_STORE_KEY);

        // 通过联赛id跳转进入
        if(!!this.vid){
            getLeagueById.getData({lid: this.vid}).then(rsp=>{
                this.lid = rsp.data.id;
                this.seasonId = rsp.data.seasonId;
                this.name = rsp.data.name;
                this.shortName = rsp.data.shortName;
                this.seasonName = rsp.data.seasonName;
            }, rej=>{
                console.log(rej.rspMsg);
            });
        }else if (!!eventInfo) {
            // 通过资料库首页点击进入（区别于联赛Id跳转多了fid,sid）
            // ps.通过联赛id获取不到一二级列表id才造成这种尴尬的处境
            let eventObj = JSON.parse(eventInfo);
            this.fid = eventObj.fid;
            this.sid = eventObj.sid;
            this.lid = eventObj.id;
            this.seasonId = eventObj.seasonId;
            this.stageId = eventObj.stageId;
            this.roundId = eventObj.roundId;
            this.name = eventObj.name;
            this.stageName = eventObj.stageName;
            this.shortName = eventObj.shortName;
            this.seasonName = eventObj.seasonName;
        }
    }
});

module.exports = eventAgenda;