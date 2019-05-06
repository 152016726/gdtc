/**
 * Created by easyLottoMac on 2018/11/8.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';
import '../common';
import getCompany from 'services/getCompanyServices';
import dialogCommon from '../../../../component/dialogCommon'
let _initSelect = ['1']; //默认选中
let _propSelect = [];    //记录点击确认之后的 id

let company_filter = Vue.component('company-filter', {
    data(){
        return{
            show: false,
            companyArr: [],
            selectCid: []
        }
    },
    template,
    watch: {
        selectCid: function () {
            if(this.selectCid.length>3){
                let arr = this.selectCid;
                arr.pop();
                this.selectCid = arr;
                dialogCommon.alert('最多只能选择3个','', (dialog, objBtn, index, e)=>{
                    dialog.close();
                    var ev = e || window.event;
                    if(ev.stopPropagation){
                        ev.stopPropagation();
                    }
                    else if(window.event){
                        window.event.cancelBubble = true;//兼容IE
                    }
                });
            }
        }
    },
    props: {
        submitCb: {} , // 父级回调
        initArr: {
            default: function () {
                return [];
            }
        }
    },
    created(){
        getCompany.getData({isMain: true}).then((rsp)=>{
            this.companyArr = rsp.list.companies
        });
        this.selectCid = this.initArr;
        _propSelect = this.initArr;
    },
    methods:{
        selectHandle(cid){
            console.log(this.selectCid);
        },
        resetHandle(){
            this.selectCid = this.initArr;
            _propSelect = this.initArr;

        },
        cancelHandle(){
            this.show = false;
            this.selectCid = _propSelect;
        },
        enterHandle(){
            this.submitCb({
                selectArr: this.selectCid
            });
            this.show = false;
            _propSelect = this.selectCid;
        },
        /**
         * 赛事筛选框的隐藏与显示
         */
        toggleMainContent(fag) {
            if (fag === 1) {
                this.show = false;
            } else {
                this.show = !this.show;
            }
            this.selectCid = _propSelect;
        }
    }
});

module.exports = company_filter;