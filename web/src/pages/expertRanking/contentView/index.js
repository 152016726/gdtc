/**
 * Created by easyLottoMac_Feng on 2019/3/11.
 */
import './style.scss';
import Vue from 'vue';
import template from './index.template';
import getExpertGetExperts from '../../../services/getExpertGetExperts';

const PAGESIZE = 40;   // 请求的专家数量


module.exports = Vue.component('expert-ranking-view',{
    data() {
        return {
            activeNum: 0,       // 当前选中的赛事
            rankingList: []     // 专家信息
        }
    },
    template,
    created() {
        this.getExpertData();
    },
    methods: {
        /**
         * 请求专家数据
         */
        getExpertData() {
            let reqObj = {
                keywords: "",
                isAttention: 'false',
                orderBy: this.activeNum + '',
                pageIndex: '0',
                pageSize: PAGESIZE
            };
            getExpertGetExperts.getData(reqObj).then(rsp => {
                this.rankingList = rsp.data.list;
            })
        },
        /**
         * 左边导航栏切换事件
         * @param index
         */
        tabChangeHandle(index) {
            if(this.activeIndex === index) return;
            this.activeNum = index;
            this.getExpertData();
        }
    }
});