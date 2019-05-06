import $ from 'jquery';
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import localStore from "@easylotto/store";
import getLeagueList from 'services/getLeagueList';
import getSeasonList from 'services/getSeasonList';
import getHostInfo from 'services/getHostsInfo';
import {
    EVENT_LOCALL_STORE_KEY
} from "constants/localStoreKeys";

module.exports = Vue.component('eventNations', {
    data() {
        return {
            webPath: '',            // 图片头部
            defaultIndex: 0,        // 行中要展示第几个元素
            leagueActiveIndex: '', // 被点击的联赛的Index
            sid: '',                // 联赛二级分类id
            leagueObj: '',          // 被选中的联赛对象
            isShowSeason: false,
            leagueArr: [],         // 联赛列表
            seasonArr: []          // 赛季列表
        }
    },
    template,
    props: {
        fid: {default: -1},             // 一级分类id
        itemList: {default: []},        // 二级列表
        sort: {default: 0},             // 当前行所在数组中的索引
        activeSort: {default: ''}       // 正在展示的行的索引
    },
    mounted() {
        $(document).click(() => {
            this.isShowSeason = false;
        });
    },
    created() {
        getHostInfo.getData().then(rsp => {
            this.webPath = rsp.data.staticResourceHost;
        }, rej => {
            console.log(rej.rspMsg);
        })
    },
    methods: {
        /**
         * 点击当前国家通过id获取当前国家下的联赛,并改变defaultIndex
         * @param id
         * @param index
         */
        getAreas(id, index) {
            // 将正在展示的行的索引设置为当前行的索引
            this.$emit('setActiveSort', this.sort);
            this.defaultIndex = index;
            this.sid = id;
            getLeagueList.getData({fid: this.fid, sid: this.sid}).then(rsp => {
                this.leagueArr = rsp.data.list;
            }, rej => {
                this.leagueArr = [{id: '', name: '暂无联赛'}];
                console.log(rej.rspMsg);
            })
        },
        /**
         * 获取到被选择的联赛Obj
         * @param val
         * @param index
         */
        getSeason(val, index) {
            this.leagueActiveIndex = index;
            // 显示赛季列表
            this.isShowSeason = true;
            this.leagueObj = val;
            getSeasonList.getData({lid: val.id}).then(rsp => {
                this.seasonArr = rsp.data.list;
            }, rej => {
                this.seasonArr = [];
                console.log(rej.rspMsg);
            })
        },
        selectSeason(val) {
            let objStr = JSON.stringify(Object.assign({}, this.leagueObj, {fid: this.fid, sid: this.sid}, val));
            localStore.set(EVENT_LOCALL_STORE_KEY, objStr);
            location.href = './eventAgenda.html'
        }
    }
});