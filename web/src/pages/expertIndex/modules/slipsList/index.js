import Vue from 'vue';
import './index.scss';
import template from './index.template';
import tagIcon from '../../images/paixu.png';
import '../../components/toggleIsHistory';
import '../../components/toggleTypes';
import '../../components/selections';
import '../../components/matchFilter';
import '../../components/expertsOrder';
import getRecommendOrder from 'services/getRecommendOrder';
import getExperts from 'services/getExperts';
import getOrderLeague from 'services/getOrderLeague';
import dialogCommon from 'component/dialogCommon';

/**
 * 获取日期
 * @param dayCount   number
 * @returns {string}
 */
let getDateStr = (dayCount)=>{
    if(null == dayCount){
        dayCount = 0;
    }
    let dd = new Date();
    dd.setDate(dd.getDate()+dayCount);//设置日期
    let y = dd.getFullYear();
    let m = dd.getMonth()+1;//获取当前月份的日期
    let d = dd.getDate();
    if(m < 10) m='0'+m;
    if(d < 10) d='0'+d;
    return y+"-"+m+"-"+d;
};
let today = getDateStr();
let yesterday = getDateStr(-1);

// 排序规则list
const _ORDERBY = [
    {
        name: '综合排序',
        id: '0'
    },
    {
        name: '近5场',
        id: '1'
    },
    {
        name: '连胜',
        id: '2'
    },
    {
        name: '周命中率',
        id: '3'
    },
    {
        name: '月命中率',
        id: '4'
    }
];

module.exports = Vue.component('slips-list', {
    data() {
        return {
            isHistory: true,            // 是否历史荐单
            date: yesterday,            // 日期
            type: 0,                    // 默认荐单类型默认
            orderBy: '0',               // 默认排序规则
            lids: [],                   // 联赛id的List
            orderList: [],              // 推荐单列表
            focusList: [],              // 关注列表
            leagueList: [],             // 最新推荐包含的联赛列表
            orderByList: _ORDERBY,      // 排序规则list
            tagIcon,                    // 综合排序的icon
            isFocused: false,           // 是否展示我的关注
        }
    },
    template,
    props: {},
    methods: {
        /**
         * 筛选是否为历史推荐单
         * @param val boolean
         */
        setIsHistory(val) {
            this.isHistory = val;
            if(!val){
                this.date = today;
                this.getLeagueList(this.getOrderList)
            }else{
                this.date = yesterday;
                this.getLeagueList(this.getOrderList)
            }
        },
        /**
         * 筛选荐单累类型
         * @param val string
         */
        setType(val) {
            this.type = val;
            this.getOrderList()
        },
        /**
         * 筛选排序规则
         * @param val Object
         */
        setOrderBy(val) {
            this.orderBy = val.id;
            this.getOrderList()
        },
        /**
         * 筛选联赛id的List
         * @param val array
         */
        setLids(val) {
            this.lids = val;
            this.getOrderList()
        },
        /**
         * 筛选出关注的专家的晒单
         */
        setIsFocused(){
            if(!this.isFocused){
                // 获取关注的专家列表
                getExperts.getData({
                    isAttention: true,
                    pageIndex: '0',
                    pageSize: '999999'
                }).then(rsp => {
                    let list = rsp.data.list;
                    let arr = [];
                    if (list.length > 0) {
                        list.forEach(item => {
                            arr.push(item.eid);
                        });
                        this.focusList = arr;
                        this.getOrderList();
                    }else{
                        this.orderList = [];
                    }
                    this.isFocused = true;
                }, rej => {
                    if(rej.rspMsg === 'logout'){
                        dialogCommon.alert('请登录');
                    }else{
                        dialogCommon.alert(rej.rspMsg);
                    }
                });
            }else {
                this.isFocused = false;
                this.focusList = [];
                this.getOrderList()
            }
        },
        /**
         * 获取推荐单
         */
        getOrderList(){
            getRecommendOrder.getData({
                type: this.type,
                orderBy: this.orderBy,
                lids: this.lids,
                isHistory: this.isHistory,
                date: this.date,
                pageIndex: '0',
                pageSize: '999999'
            }).then(rsp=>{
                if(this.focusList.length > 0){
                    this.orderList = rsp.data.list.map(item=>{
                        if(this.focusList.indexOf(item.eid) !== -1){
                            return item;
                        }
                    })
                }else{
                    this.orderList = rsp.data.list;
                }
            }, rej=>{
                console.log(rej.rspMsg);
            })
        },
        /**
         * 获取联赛列表
         * @param callback 回调
         */
        getLeagueList(callback){
            getOrderLeague.getData({date: this.date}).then(rsp => {
                let arr = [];
                if(rsp.data.list.length > 0){
                    rsp.data.list.forEach(item=>{
                        arr.push(item.lid)
                    });
                }
                this.lids = arr;
                this.leagueList = rsp.data.list;
                callback && callback()
            }, rej => {
                console.log(rej.rspMsg);
            })
        }
    },
    created() {
        // 获取联赛列表
        this.getLeagueList(this.getOrderList);
    }
});