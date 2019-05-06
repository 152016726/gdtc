import Vue from "vue"
import './style.scss'
import './header'
import './content'
import tpl from "./index.template"
import getExponentData from 'services/getExponentData'
import {MARKET_NAME} from 'constants/localStoreKeys'
import '../filterBox/matchFilter'
import '../filterBox/companyFilter'
import '../filterBox/handicapFilter'
import layDate from 'plugin/laydate/laydate.js'
import _ from 'lodash'
let oneDay = 86400000; //一天的毫秒数
let innerFn = {
    getLeagueList(events) {
        let arr = [];
        let arrLeagueId = [];
        events.forEach((ele) => {
            let index = arrLeagueId.indexOf(ele.leagueId);
            if (index === -1) {
                arr.push({
                    id: ele.leagueId,
                    text: ele.leagueShortName,
                    len: 1
                });
                arrLeagueId.push(ele.leagueId);
            }
            else {
                arr[index].len += 1;
            }
        });
        return arr;
    },
    getCompaniesList(companies) {
        let arr = [];
        companies.forEach((ele) => {
            arr.push({
                text: ele.cnShort,
                id: ele.cid
            });
        });
        return arr;
    }
};

module.exports = Vue.component('exponent-list', {
    data() {
        return {
            events: [],       //列表数据
            eventsAll: [],     //列表数据（原始数据）
            leagueArr: [],     //联赛数据
            companyFilterArr: [], //公司筛选条件
            handicapFilterArr: [],  //盘口筛选条件
            handicapArr: [
                {
                    text: '平手',
                    id: '0'
                },
                {
                    text: '受半球/一球',
                    id: '0.75'
                },
                {
                    text: '半球/一球',
                    id: '-0.75'
                },
                {
                    text: '平手/半球',
                    id: '-0.25'
                },
                {
                    text: '受平手/半球',
                    id: '0.25'
                },
                {
                    text: '半球',
                    id: '-0.5'
                },
                {
                    text: '球半/两球',
                    id: '-1.75'
                },
                {
                    text: '一球',
                    id: '-1'
                },
                {
                    text: '受半球',
                    id: '0.5'
                },
                {
                    text: '两球/两球半',
                    id: '-2.25'
                },
                {
                    text: '一球/球半',
                    id: '-1.25'
                }
            ]
        }
    },
    mounted: function () {
        this.companyFilterArr = this.initCompanyArr;
        let dateTime = new Date().getTime();
        let date = new Date(dateTime).format('yyyy-MM-dd');
        let minDate = new Date(dateTime - 6 * oneDay).format('yyyy-MM-dd');
        let maxDate = new Date(dateTime + 3 * oneDay).format('yyyy-MM-dd');
        let self = this;
        this.updateList(date);
        lay('.dateScreen').each(function (i, el) {
            layDate.render({
                elem: this,
                theme: "#eb812b",
                max: maxDate,
                min: minDate,
                format: 'yyyy-MM-dd',
                value: date,
                showBottom: false,
                trigger: 'click',
                done: function (value, date) {
                    self.updateList(value);
                }
            });
        });
    },
    props: {
        vid: {
            default: ''
        },
        initCompanyArr: {
            default: function () {
                return ['1', '5', '16']
            }
        }
    },
    methods: {
        updateList(date){
            getExponentData.getData({
                selectDate: date,
                isMain: true
            }).then(rsp => {
                if (rsp.data) {
                    const {events = []} = rsp.data;
                    this.leagueArr = innerFn.getLeagueList(events);
                    this.events = events;
                    this.eventsAll = events;
                }
            });
        },
        getDataByFilter(data) {
            let {markets, vid} = data;
            let arr;
            arr = this.companyFilterArr.map((item, index) => {
                let wdwObj = _.find(markets.wdw, function (o) {
                    return o.cid === item;
                });
                let ahObj = _.find(markets.ah, function (o) {
                    return o.cid === item;
                });
                let obj = null;
                if (wdwObj || ahObj) {
                    wdwObj = wdwObj || {};
                    ahObj = ahObj || {};
                    obj = {
                        companyCnShort: wdwObj.companyCnShort,
                        //亚盘
                        homeOddsInitAH: ahObj.homeOddsInit,
                        homeOddsCurrAH: ahObj.homeOddsCurr,
                        homeTrendAH: ahObj.homeTrend,
                        handicapInitAH: ahObj.handicapInit,
                        handicapCurrAH: ahObj.handicapCurr,
                        handTrendAH: ahObj.handTrend,
                        awayOddsInitAH: ahObj.awayOddsInit,
                        awayOddsCurrAH: ahObj.awayOddsCurr,
                        awayTrendAH: ahObj.awayTrend,
                        //欧赔
                        homeOddsInit: wdwObj.homeOddsInit,
                        homeOddsCurr: wdwObj.homeOddsCurr,
                        homeTrend: wdwObj.homeTrend,
                        drawOddsInit: wdwObj.drawOddsInit,
                        drawOddsCurr: wdwObj.drawOddsCurr,
                        drawTrend: wdwObj.drawTrend,
                        awayOddsInit: wdwObj.awayOddsInit,
                        awayOddsCurr: wdwObj.awayOddsCurr,
                        awayTrend: wdwObj.awayTrend,
                        vid
                    };
                }
                return obj;
            });
            arr = arr.filter((item) => {
                if (item === null) {
                    return false;
                }
                else if (this.handicapFilterArr.length === 0) {
                    return true;
                }
                else return this.handicapFilterArr.indexOf(item.handicapCurrAH) !== -1;
            });
            return arr;
        },
        showAllEvents(){
            let {checkAllHandle, enterHandle} = this.$refs.matchFilterComponent;
            checkAllHandle();
            enterHandle();
        },
        matchFilterCb: function (obj) {
            let {selectArr} = obj;
            this.events = this.eventsAll.filter((item) => {
                return selectArr.indexOf(item.leagueId) !== -1;
            });
        },
        handicapFilterCb: function (obj) {
            let {selectArr} = obj;
            this.handicapFilterArr = selectArr;
        },
        companyFilterCb: function (obj) {
            let {selectArr} = obj;
            this.companyFilterArr = selectArr;
        }
    },
    template: tpl
});

