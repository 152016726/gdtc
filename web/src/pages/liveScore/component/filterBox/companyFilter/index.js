/**
 * Created by easyLottoMac on 2018/11/8.
 */
import './index.scss';
import template from './index.template';
import Vue from 'vue';
import '../common';
import getCompany from 'services/getCompanyServices';

let company_filter = Vue.component('company-filter', {
    data(){
        return{
            show: false,
            companyArr: [],
            selectCid: ['2']
        }
    },
    template,
    created(){
        getCompany.getData({isMain: true}).then((rsp)=>{
            // console.log(rsp);
            this.companyArr = rsp.list.companies
        });
    },
    methods:{
        selectHandle(cid){
            this.selectCid = this.selectCid.splice(1, 1, cid);
            // console.log(cid);
        }
    }
});

module.exports = company_filter;