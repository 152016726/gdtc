import Vue from "vue";
import tpl from "./index.template";
import getExponentialList from '../../../../services/getExponentialList'
import '../../../../pages/raceCourse/component/betOutCome/index'
import '../../style.scss'
import urlUtil from '../../urlUtil'
import store from '@easylotto/store';
import {MARKET_NAME} from 'constants/localStoreKeys';
let type = 'ah';

module.exports = Vue.component('exponent-ah-table', {
    data() {
        return {
            list: [],    //列表数据
            maxData: {}, //最大值数据
            minData: {}  //最小值数据
        }
    },
    mounted: function () {
        getExponentialList.getData({
            vid: this.vid,
            market: type
        }).then(rsp => {
            if (rsp.data && rsp.data[type]) {
                let {list = []} = rsp.data[type];
                this.initMaxOrMinData(list)
                this.list = list;
            }

        })
    },
    props: {
        vid: {
            default: ''
        },
        home: {
            default: ''
        },
        away: {
            default: ''
        }
    },
    methods: {
        /**
         * 增加最大最小值数据
         */
        initMaxOrMinData: function (list) {
            let obj = {},
                objMax = {},
                objMin = {},
                arrProps = ['homeOddsInit', 'handicapInit', 'awayOddsInit', 'homeOddsCurr', 'handicapCurr', 'awayOddsCurr'];
            list.forEach((rowData) => {
                arrProps.forEach((ele) => {
                    if (obj[ele]) {
                        obj[ele].push(rowData[ele]);
                    }
                    else {
                        obj[ele] = [rowData[ele]];
                    }
                });
            });
            for (let i in obj) {
                objMax[i] = Math.max.apply(null, obj[i]);
                objMin[i] = Math.min.apply(null, obj[i]);
            }
            this.maxData = objMax;
            this.minData = objMin;
        },
        goToDetail(rowData) {
            let {vid} = this;
            let obj = store.get(MARKET_NAME);
            let str = urlUtil.urlEncode({
                cid: rowData.cid,
                cname: rowData.companyCnShort,
                home: obj.homeName,
                away: obj.awayName,
                type,
                vid
            });
            window.open(`../scoreExpDetails.html?${str}`);
        }
    },
    template: tpl
});

