/**
 * Created by easyLottoMac_Feng on 2019/3/18.
 */
import './style.scss';
import Vue from 'vue';
import template from './index.template';
import config from '~/common/js/config.js';
import geSendVerifyCode from 'services/geSendVerifyCode';
import dialogCommon from "../dialogCommon";

let timer = null;  // 倒计时的 key

module.exports = Vue.component('register-com-view', {
    data() {
        return {
            passWord: '',            // 密码
            againPassWord: '',       // 确认密码
            userName: '',            // 用户密码
            code: '',                // 验证码
            codeText: '获取验证码',   // 验证码按钮文字
            checked: false,          // 服务协议勾选
            isEnter: false,          // 是否允许提交
            isCodeError: false,      // 验证码错误
            isCodeSure: false,       // 验证码正确
            isPassWord: false,       // 密码验证
            isAgainPassWord: false,  // 确认密码验证
            isUserName: false,       // 昵称验证
            isVer: false,            // 是否在倒计时
            imgSrc: '',              // 图片验证码Src
            imgPin: '',              // 图片验证码
            isShowImgCode: false     // 是否展示图形验证码
        }
    },
    template,
    props: {
        isRegister: {               // 是否注册页面
            default: true
        },
        telNum: {                   // 手机号码
            default: '123456789123'
        },
        pin: {                      // 图形验证码
            default: ''
        },
        submitCallBack: {           // 提交事件回调
            default: function () {
                return () => {
                }
            }
        }
    },
    created() {
        clearInterval(timer);
        let codeT = 59;
        this.setCodeTime(codeT, timer);
    },
    watch: {
        // 监听密码
        passWord: function (newValue) {
            this.isPassWord = newValue === '';
            if (this.againPassWord !== '') {
                this.isAgainPassWord = this.againPassWord !== newValue;
            }
            this.inputChangeHandle();
        },
        // 监听确认密码
        againPassWord: function (newValue) {
            this.isAgainPassWord = this.passWord !== newValue;
            this.inputChangeHandle();
        },
        // 监听验证码
        code: function () {
            this.inputChangeHandle();
        },
        // 监听用户名
        userName: function (newValue) {
            this.isUserName = newValue === '';
            this.inputChangeHandle();
        },
        // 监听是否勾选服务协议
        checked: function () {
            this.inputChangeHandle();
        },
        // 图形验证码验证
        isShowImgCode: function () {
            this.imgSrcIconHandle();
        }
    },
    methods: {
        /**
         * 图形验证码刷新
         */
        imgSrcIconHandle() {
            this.imgSrc = config.host_name + config.api_name + "/getImgVerifyCode" + "?timeflag=" + new Date().getTime();
        },
        /**
         * 验证码获取
         */
        codeHandle() {
            if (!this.isVer) {
                if (!this.imgPin) {
                    dialogCommon.alert('请输入图形验证码');
                    return;
                }
                let reqData = {
                    phone: this.telNum,
                    pin: this.imgPin
                };
                geSendVerifyCode.getData(reqData).then(rsp => {
                    let codeT = 59;
                    this.setCodeTime(codeT, timer);
                }, rej => {
                    dialogCommon.alert(rej.rspMsg);
                });
            }
        },
        /**
         * 提交按钮事件
         */
        submitHandle() {
            if(!this.isEnter) return;
            if (this.isRegister) {
                this.isUserName = this.userName === '';
            }
            this.isPassWord = this.passWord === '';
            if (this.isEnter) {
                let callBackObj = Object.assign({
                    msgPin: this.code,
                    phone: this.telNum
                }, this.isRegister ?
                    {userName: this.userName, pwd: this.passWord} :
                    {newPwd: this.passWord});
                this.submitCallBack && this.submitCallBack(callBackObj);
            }
        },
        /**
         * 服务协议检测
         */
        agreementHandle() {
            this.checked = !this.checked;
        },
        /**
         * 输入框的change 事件
         */
        inputChangeHandle() {
            let flag = false;
            if (this.isRegister) {
                flag = this.userName && this.passWord && this.code && this.passWord === this.againPassWord && this.checked;
                this.isEnter = flag;
            } else {
                flag = this.passWord && this.code && this.passWord === this.againPassWord;
                this.isEnter = flag;
            }

        },
        /**
         * 验证码倒计时
         * @param time 倒记时间
         * @param key      倒计时的 key
         */
        setCodeTime(time, key) {
            clearInterval(key);
            this.isVer = true;
            this.codeText = '重新获取(' + time + ')';
            key = setInterval(() => {
                if (time < 1) {
                    this.codeText = '重新获取';
                    this.isShowImgCode = true;
                    clearInterval(key);
                    this.isVer = false;
                    return;
                }
                time--;
                this.codeText = '重新获取(' + time + ')';
            }, 1000);
        }
    },
    /**
     * 组件销毁时调用
     */
    destroyed() {
        clearInterval(timer);
    }
});