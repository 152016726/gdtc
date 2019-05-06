import Vue from "vue";
import tpl from "./index.template";
import getExponentialList from '../../../../services/getExponentialList'
import '../../../../pages/raceCourse/component/betOutCome/index'
import '../../style.scss'
import urlUtil from "../../urlUtil";
import store from '@easylotto/store';
import {MARKET_NAME} from 'constants/localStoreKeys';

let type = 'wdw';

module.exports = Vue.component('exponent-wdw-table', {
    data() {
        return {
            list: [],    //列表数据
        }
    },
    mounted: function () {
        getExponentialList.getData({
            vid: this.vid,
            market: type
        }).then(rsp => {
            if (rsp.data && rsp.data[type]) {
                let {list = []} = rsp.data[type];
                this.list = list;
            }

        })
    },
    props: {
        vid: {
            default: ''
        }
    },
    methods: {
        /**
         * 跳转详情页前把参数放到地址，防止去到详情页刷新丢失数据（详情页要铲除MARKET_NAME）
         * @param rowData
         */
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
        },
        getTimeStr: (str) => {
            if(!str){
                return ''
            }
            return new Date(str).format('MM-dd hh:mm')
        }
    },
    template: tpl
});

