/**
 * Created by easyLottoMac_Feng on 2019/3/7.
 */
import './style.scss';
import Vue from 'vue';
import template from './index.template';
import '../expertLi';
import getExpertGetExperts from '../../../services/getExpertGetExperts';

const PAGESIZE = 40;   // 请求的专家数量

module.exports = Vue.component('expert-group-content-view', {
    data() {
        return {
            showExpertNum: 0,           // 选中的展示专家状态
            expertLists: []             // 专家列表
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
                orderBy: "2",
                pageIndex: '0',
                pageSize: PAGESIZE
            };
            getExpertGetExperts.getData(reqObj).then(rsp => {
                this.expertLists = rsp.data.list
            })
        },
        /**
         * 头部切换按钮事件
         * @param index
         */
        searchHandle(index) {
            this.showExpertNum = index;
        }
    }
});