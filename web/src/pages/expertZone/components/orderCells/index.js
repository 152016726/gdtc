import Vue from 'vue';
import './index.scss';
import template from './index.template';
import oddDealCtrl from 'constants/oddDealCtrl';
import getExpertOrderDetail from 'services/getExpertOrderDetail';
import * as EventState from 'constants/eventState';
import dialogCommon from 'component/dialogCommon';
import _ from 'lodash';

let _WEEKARRAY = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let _betsCn = oddDealCtrl.getOdds();

module.exports = Vue.component('order-cells', {
    data() {
        return {
            typeMarket: [
                {title: '胜平负2串1', statusNum: '1'},
                {title: '单关', statusNum: '2'},
                {title: '总进球', statusNum: '3'}
            ],
            stateObj: {
                NO_DRAW: '0',
                DRAW: '1',
                WIN: '2',
                LOSE: '3',
                NO_WIN_OR_LOSE: '4',
                DELAY: '5',
                CANCLE: '6'
            },
            stateArr: [ '2', '3', '5', '6'],
            EventState,
            recommendOrderDetail: {}
        }
    },
    template,
    props: {
        order: {
            default: () => {
            }
        }
    },
    methods: {
        /**
         * 获取赛事编号
         * @param completeNo   201801010001
         */
        getWeekAndNo(completeNo) {
            let weekCode = parseInt(completeNo.substr(completeNo.length - 4, 1), 10);
            let week = _WEEKARRAY[weekCode];
            return week + completeNo.substr(-3);
        },
        /**
         * 将vsDate格式化
         * @param vsDate
         */
        getDate(vsDate, format) {
            return Date.prototype.parseISO8601(vsDate).format(format);
        },
        /**
         * 查看更多
         */
        showMore() {
            getExpertOrderDetail.getData({rid: this.order.rid}).then(rsp=>{
                this.recommendOrderDetail = rsp.data;
            }, rej=>{
                if(rej.rspCode === 'NOLOGIN'){
                    dialogCommon.alert('请登录');
                }else{
                    dialogCommon.alert(rej.rspMsg);
                }
            })
        },
        /**
         * 通过marketKey,outcomKey字段获取对应的中文  e.g wdw drawOdds => 主胜
         * @param markertKey
         * @param outcomeKey
         * @returns {*|string}
         */
        getBetCnString(markertKey, outcomeKey) {
            let obj = _.find(_betsCn[markertKey], function (o) {
                return o.key === outcomeKey;
            });
            if (!obj) {
                obj = {}
            }
            return obj.title || '';
        }
    },
    created() {
        getExpertOrderDetail.getData({rid: this.order.rid}).then(rsp=>{
            this.recommendOrderDetail = rsp.data;
        }, rej=>{
            console.log(rej.rspMsg);
        })
    }
});