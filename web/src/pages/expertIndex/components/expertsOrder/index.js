import Vue from 'vue';
import './index.scss';
import template from './index.template';
import getConcernExpert from 'services/getConcern';
import dialogCommon from 'component/dialogCommon';
import * as EventState from 'constants/eventState';

let _WEEKARRAY = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

module.exports = Vue.component('experts-order', {
    data() {
        return {
            typeMarket: [
                {title: '胜平负2串1', statusNum: '1'},
                {title: '单关', statusNum: '2'},
                {title: '总进球', statusNum: '3'}
            ],
            EventState,
            isFocused: false                            //是否关注
        }
    },
    template,
    props: {
        marketEvents: {default: ()=>{}}
    },
    methods: {
        /**
         * 获得字符串实际长度，中文2，英文1
         * @param str          string
         * @returns {number}   返回字符串的长度
         * @constructor
         */
        GetLength(str){
            let realLength = 0, len = str.length, charCode = -1;
            for (let i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }
            return realLength;
        },
        /**
         * 如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串
         * @param str   string
         * @param len   number
         */
        cutStr(str, len){
            let str_length = 0,
                str_len = 0,
                str_cut = new String();
            str_len = str.length;
            for (let i = 0; i < str_len; i++) {
                let a = str.charAt(i);
                str_length++;
                if (decodeURI(a).length > 4) {
                    //中文字符的长度经编码之后大于4
                    str_length++;
                }
                str_cut = str_cut.concat(a);
                if (str_length >= len) {
                    str_cut = str_cut.concat("...");
                    return str_cut;
                }
            }
            //如果给定字符串小于指定长度，则返回源字符串；
            if (str_length < len) {
                return str;
            }
        },
        /**
         * 获取赛事编号
         * @param completeNo   201801010001
         */
        getWeekAndNo(completeNo){
            let weekCode = parseInt(completeNo.substr(completeNo.length - 4, 1), 10);
            let week = _WEEKARRAY[weekCode];
            return week+completeNo.substr(-3);
        },
        /**
         * 将vsDate格式化
         * @param vsDate
         */
        getDate(vsDate, format){
            return Date.prototype.parseISO8601(vsDate).format(format);
        },
        /**
         * 关注当前专家
         */
        getConcern(){
            getConcernExpert.getData({
                "eid": this.marketEvents.eid,
                "isAttention": this.isFocused
            }).then(rsp=>{
                this.isFocused = !this.isFocused;
            }, rej=>{
                if(rej.rspMsg === 'logout'){
                    dialogCommon.alert('请登录');
                }else{
                    dialogCommon.alert(rej.rspMsg);
                }
            })
        }
    },
    created() {

    }
});