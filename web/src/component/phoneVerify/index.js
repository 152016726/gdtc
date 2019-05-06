import './style.scss';
import $ from 'jquery';
import templ from './view.art';
import config from '~/common/js/config.js';
import geSendVerifyCode from 'services/geSendVerifyCode';
import getCheckPhoneNumOccupy from 'services/getCheckPhoneNumOccupy';
import dialogCommon from "../dialogCommon";

let innerFn = {
    initEvent: function () {
        let self = this;
        // 刷新验证码
        self.ele.find(".refresh").on('click', function () {
            refresh();
            // 搭配一点动画效果
            $(this).fadeTo(200, 0.6, function () {
                $(this).css({opacity: 1})
            });
        });
        // 返回上级
        this.ele.find(".checkBack").on('click', function () {
            self.checkBack()
        });
        // 提交
        this.ele.find("#phone-btn").on('click',function () {
            let phone = $('#phone-iphone-num').val();
            let pin = $('#phone-iphone-code').val();
            if(phone === '' || !(/^1\d{10}$/.test(phone))) {
                dialogCommon.alert('手机号码格式不正确');
                return;
            }else if(pin === '') {
                dialogCommon.alert('验证码不能为空');
                return;
            }
            getCheckPhoneNumOccupy.getData({phone}).then(rsp => {
                if((rsp.data.isRegister === 'false' && self.flag) || (rsp.data.isRegister === 'true' && !self.flag)){
                    // 注册的逻辑
                    geSendVerifyCode.getData({phone, pin}).then(rsp=>{
                        self.goInto({phone, pin});
                    }, rej=>{
                        refresh();
                        dialogCommon.alert(rej.rspMsg);
                    })
                }else{
                    refresh();
                    dialogCommon.alert(self.flag ? '手机号已注册' : '手机号未注册');
                }
            }, rej => {
                refresh();
                dialogCommon.alert(rej.rspMsg);
            });

        });
        // 刷新验证码
        function refresh() {
            let imgurl = config.host_name + config.api_name + "/getImgVerifyCode" + "?timeflag=" + new Date().getTime();
            self.ele.find(".codeImg").attr({"src": imgurl});
        }
    },
    /**
     * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
     **/
    dealObjectValue(obj) {
        var param = {};
        if (obj === null || obj === undefined || obj === "") return param;
        for (var key in obj) {
            if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
                param[key] = obj[key];
            }
        }
        return param;
    },
    /**
     * 显示组件
     * @param opt       配置项
     * @param $event    jq对象
     */
    showPart(opt, $event){
        let defaultConf={
            isRegister: true,
            title: '使用手机号注册',
            btnTitle: '注册',
            backTitle: '<<返回第三方账号登录',
            imgSrc: config.host_name + config.api_name  + "/getImgVerifyCode" + "?timeflag=" + new Date().getTime(),
            goBack:function () {

            },
            onSuccess:function (obj) {

            }
        };
        opt = innerFn.dealObjectValue(opt);
        opt = Object.assign(defaultConf, opt);
        this.ele = $(templ(opt));
        // 返回
        this.checkBack = () => {
            opt.goBack.call(this);
            this.ele.remove();
        };
        // 跳转
        this.goInto = (obj) => {
            opt.onSuccess.call(this, obj);
            this.ele.remove();
        };
        // 关闭弹窗
        this.closeDialog = () => {
            this.ele.remove();
        };
        this.flag = opt.isRegister;
        innerFn.initEvent.call(this);
        if($event){
            $event.append(this.ele);
        }
    }
};

module.exports = {
    showPart(opt, ele){
        return new innerFn.showPart(opt, ele)
    }
};