import Vue from "vue";
import tpl from "./index.template";
import getExponentialListDetail from '../../../../services/getExponentialListDetail'
import '../../../../pages/raceCourse/component/betOutCome/index'
import '../../style.scss'
import store from '@easylotto/store';
import {MARKET_NAME} from 'constants/localStoreKeys';
module.exports = Vue.component('exponent-detail-common', {
    data() {
        return {
            list: [],     //列表数据
            initData: {}  //初盘数据
        }
    },
    mounted: function () {
        let type = this.type;
        let vid = this.vid;
        let cid = this.cid;
        // store.erase(MARKET_NAME); //删除localStorage
        getExponentialListDetail.getData({
            vid,
            cid,
            market: type
        }).then((rsp) => {
            let data = rsp.data[type];
            let list = rsp.data[type].list;
            let obj = {
                awayOddsInit: data.awayOddsInit,
                homeOddsInit: data.homeOddsInit,
                updateTimeInit: data.updateTimeInit
            }
            if(type === 'ah'){
                obj.handicapInit = data.handicapInit;
            }
            else{
                obj.drawOddsInit = data.drawOddsInit;
            }
            this.initData = obj;
            this.list = list;
        });
    },
    props: {
        vid: {
            default: ''
        },
        cid: {
            default: ''
        },
        type: {
            default: ''
        },
        dateStr: {
            default: ''
        },
        home: {
            default: ''
        },
        away: {
            default: ''
        },
        cname: {
            default: ''
        },
        gridConf: {
            default: function () {
                return {
                    ah: [
                        {text: '主队', key: 'homeOddsCurr', typeKey: 'homeTrend'},
                        {text: '盘口', key: 'handicapCurr', typeKey: 'handTrend'},
                        {text: '客队', key: 'awayOddsCurr', typeKey: 'awayTrend'},
                        {text: '变化时间', key: 'updateTimeCurr', typeKey: 'time'}
                    ],
                    wdw: [
                        {text: '主队', key: 'homeOddsCurr', typeKey: 'homeTrend'},
                        {text: '平局', key: 'drawOddsCurr', typeKey: 'drawTrend'},
                        {text: '客队', key: 'awayOddsCurr', typeKey: 'awayTrend'},
                        {text: '变盘时间', key: 'updateTimeCurr', typeKey: 'time'}
                    ]
                }
            }
        }
    },
    methods: {
        getTimeStr: function(str){
            if(!str){
                return ''
            }
            return new Date(str).format('MM-dd hh:mm')
        },
        // getInnerContent: function (ele, ele_d) {
        //     return ele.typeKey ==='time'? this.getTimeStr(ele_d[ele.key]):<bet-outcome :isResult='true' :trend='ele_d[ele.typeKey]' :num='ele_d[ele.key]'/>
        // }
        }
    ,
    template: tpl
});

