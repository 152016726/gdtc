import template from './index.template';
import Vue from 'vue';
import './index.scss';
import '../common';

module.exports = Vue.component('match-filter', {
    template: template,
    data() {
        return {
            arrDateChecked: [],         //日期已选择的数组
            arrHandicapChecked: [],     //让球已选择的数组
            arrLeagueChecked: [],       //联赛已选择的数组
            dateAllChecked: false,      //日期全选
            handicapAllChecked: false,  //让球全选
            leagueAllChecked: false,    //联赛全选
            firstGetNoEmptyData: false  //是否第一次加载到数据，用于默认全选
        }
    },
    updated() {
        let {firstGetNoEmptyData, arrDateButtons, arrHandicapButtons, arrLeagueButtons} = this;
        let arrDate = [], arrH = [], arrL = [];
        if (!firstGetNoEmptyData && (arrDateButtons.length !== 0 || arrHandicapButtons.length !== 0 || arrLeagueButtons.length !== 0)) {  //检测是否是第一次加载到数据，设置默认全选
            this.firstGetNoEmptyData = true;
            arrDateButtons.forEach(ele => {
                arrDate.push(ele.id);
            });
            arrHandicapButtons.forEach(ele => {
                arrH.push(ele.id);
            });
            arrLeagueButtons.forEach(ele => {
                arrL.push(ele.id);
            });
            this.arrDateChecked = arrDate;
            this.arrHandicapChecked = arrH;
            this.arrLeagueChecked = arrL;
        }
    },
    props: {
        arrDateButtons: { //日期按钮数组
            /**
             * 数据的数据格式为{text: '',id: ''}，arrHandicapButtons，arrLeagueButtons都是
             */
            default: function () {
                return [];
            }
        },
        arrHandicapButtons: { //让球按钮数组
            default: function () {
                return [];
            }
        },
        arrLeagueButtons: { //让球按钮数组
            default: function () {
                return [];
            }
        },
        submitCb: {} //父级回调
    },
    watch: {
        arrDateChecked: function (newValue) {
            this.dateAllChecked = newValue.length === this.arrDateButtons.length;
            this.updateMatch();
        },
        arrHandicapChecked: function (newValue) {
            this.handicapAllChecked = newValue.length === this.arrHandicapButtons.length;
            this.updateMatch();
        },
        arrLeagueChecked: function (newValue) {
            this.leagueAllChecked = newValue.length === this.arrLeagueButtons.length;
            this.updateMatch();
        }
    },
    methods: {
        updateMatch() {
            this.submitCb({
                week: this.arrDateChecked,
                handicap: this.arrHandicapChecked,
                leagueId: this.arrLeagueChecked
            });
        },
        checkAll(type) {
            let {arrDateButtons, arrHandicapButtons, arrLeagueButtons, dateAllChecked, handicapAllChecked, leagueAllChecked} = this;
            if (type === 'date') {
                if (!dateAllChecked) {
                    let arr = [];
                    arrDateButtons.forEach((ele, idx) => {
                        arr.push(ele.id);
                    });
                    this.arrDateChecked = arr;
                }
                else {
                    this.arrDateChecked = [];
                }
            }
            else if (type === 'handicap') {
                if (!handicapAllChecked) {
                    let arr = [];
                    arrHandicapButtons.forEach((ele, idx) => {
                        arr.push(ele.id);
                    });
                    this.arrHandicapChecked = arr;
                }
                else {
                    this.arrHandicapChecked = [];
                }
            }
            else {
                if (!leagueAllChecked) {
                    let arr = [];
                    arrLeagueButtons.forEach((ele, idx) => {
                        arr.push(ele.id);
                    });
                    this.arrLeagueChecked = arr;
                }
                else {
                    this.arrLeagueChecked = [];
                }
            }
            this.updateMatch();
        }
    }
});