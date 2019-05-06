/**
 * Created by easyLottoMac_Feng on 2019/3/19.
 */
import './style.scss';
import Vue from 'vue';
import template from './index.template';
import '~/component/registerCom';
import util from "@easylotto/util";
import getUserForgetPassword from 'services/getUserForgetPassword';
import dialogCommon from '~/component/dialogCommon';

module.exports = Vue.component('reset-password-view', {
    data() {
        return {
            phone: '123456789123'
        }
    },
    template,
    props: {},
    created() {
        // 获取手机号
        let vars = util.getUrlVars();
        this.phone = vars.phone
    },
    methods: {
        /**
         * 提交按钮事件
         * @param dataObj
         */
        submitCallBack(dataObj) {
            // console.log(dataObj);
            getUserForgetPassword.getData(dataObj).then(rsp => {
                dialogCommon.alert(rsp.rspMsg, '', function () {
                    window.history.back(-1);
                });
            },req => {
                dialogCommon.alert(req.rspMsg);
            });
        }
    }
});