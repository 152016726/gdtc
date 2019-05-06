import Vue from 'vue';
import $ from 'jquery';
import './index.scss';
import template from './index.template';
import '../modules/expertHeader';
import '../components/toggleTypes';
import '../components/orderCells';
import '../components/paginator';
import getRecommendOrder from 'services/getRecommendOrder';

let getDateStr = (dayCount) => {
    if (null == dayCount) {
        dayCount = 0;
    }
    let dd = new Date();
    dd.setDate(dd.getDate() + dayCount);//设置日期
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1;//获取当前月份的日期
    let d = dd.getDate();
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    return y + "-" + m + "-" + d;
};
let today = getDateStr();
let yesterday = getDateStr(-1);
const PAGESIZE = 10;                 // 分页

module.exports = Vue.component('expert-zone', {
    data() {
        return {
            latestOrder: [],            // 最新晒单
            historyOrder: [],           // 历史晒单
            totalOrder: [],             // 历史总共晒单
            type: '0',                  // 晒单类型
            paginations: [],            // 分页器
            pageIndex: '1'              // 页码
        }
    },
    template,
    props: {
        eid: {default: ''}
    },
    methods: {
        /**
         * 筛选荐单累类型
         * @param val string
         */
        setType(val) {
            this.type = val;
            this.getOrderList()
        },
        /**
         * 设置页码
         * @param val
         */
        setPageIndex(val) {
            this.pageIndex = val;
            this.getHistoryOrder()
        },
        /**
         * 历史推荐
         */
        getHistoryOrder() {
            getRecommendOrder.getData({
                eid: this.eid,
                type: this.type,
                isHistory: true,
                pageIndex: this.pageIndex,
                pageSize: PAGESIZE
            }).then(rsp => {
                this.historyOrder = rsp.data.list;
            }, rej => {
                console.log(rej.rspMsg);
            });
        },
        /**
         * 获取最新和历史推荐单
         */
        getOrderList() {
            // 历史推荐
            this.getHistoryOrder();
            // 最新推荐
            getRecommendOrder.getData({
                eid: this.eid,
                type: this.type,
                isHistory: false,
                date: today,
                pageIndex: '0',
                pageSize: '999999'
            }).then(rsp => {
                this.latestOrder = rsp.data.list;
            }, rej => {
                console.log(rej.rspMsg);
            })
        }
    },
    created() {
        this.getOrderList();
        getRecommendOrder.getData({
            eid: this.eid,
            type: this.type,
            isHistory: true,
            pageIndex: this.pageIndex,
            pageSize: '9999999'
        }).then(rsp => {
            this.totalOrder = rsp.data.list;
            let len = Math.ceil(rsp.data.list.length / PAGESIZE);
            console.log(len);
            if (len > 1) {
                let arr = [];
                for (let i = 0; i < len; i++) {
                    arr.push(i + 1)
                }
                this.paginations = arr;
            }
        }, rej => {
            console.log(rej.rspMsg);
        });
    }
});