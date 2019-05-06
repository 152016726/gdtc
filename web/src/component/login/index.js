/**
 * Created by easyLottoMac_Feng on 2019/3/12.
 */
require("./style.scss");
var $ = require("jquery");
import Account from '#/account';
import dialogCommon from '../dialogCommon';
import part from '../phoneVerify';
import config from '~/common/js/config.js';

let showPart = null;
let isImagCode = false;

$(function () {
    init();
    function init() {
        let $errorPrompt = $('.error-prompt');          // 错误提示dom
        let $loginImgCode = $('.login-img-code');       // 图形验证dom
        // 弹出登录框
        $('#top-login-btn').click(loginAlertToggle);

        // 关闭登录弹窗
        $('.close-login-btn').click(function () {
            loginAlertToggle();
            $(".login-content").show();
            $loginImgCode.hide();
            $errorPrompt.hide();
            isImagCode = false;
            if (showPart) {
                showPart.closeDialog();
            }
        });

        // 图形验证码刷新
        $('.img-code-refresh-btn').click(refreshImgCode);

        // 登录按钮事件
        $('#login-btn').click(function () {
            let iphoneNum = $('#login-iphone-num').val();
            let passWordNum = $('#login-iphone-password').val();
            let imgCodeNum = $('.login-image-code-num').val();
            if (iphoneNum === '') {
                dialogCommon.alert('手机号码不能为空');
                return;
            }
            if (passWordNum === '') {
                dialogCommon.alert('密码不能为空');
                return;
            }
            if(isImagCode && imgCodeNum === ''){
                dialogCommon.alert('请输入验证码');
                return;
            }
            Account.login(iphoneNum, passWordNum, imgCodeNum).then(rsp => {
                loginAlertToggle();
                $('#user-image').attr('src', rsp.webApiPath + rsp.icon);
                $('.user-name').text(rsp.nickname);
                $('.logout-status').hide();
                $('.login-status').show();
                $loginImgCode.hide();
                $errorPrompt.hide();
                isImagCode = false;
                if (showPart) {
                    showPart.closeDialog();
                }
                //页面重新加载一下
                location.reload();
            }, req => {
                $errorPrompt.show();
                $errorPrompt.text(req.rspMsg);
                if(req.rspCode === 'overcount') {
                    refreshImgCode();
                    $loginImgCode.show();
                    isImagCode = true;
                }
            });
        });

        // 弹出注册框
        $('#login-register-btn').click(function () {
            $('#login-alert-cell').toggle();
            $('#register-alert-cell').toggle();
            return false;
        });

        // 忘记密码
        $('#forget-pass-word').click(function () {
            $('.login-content').toggle();
            showPart = part.showPart({
                title: '找回密码',
                btnTitle: '重置',
                isRegister: false,
                backTitle: '又想起来了>>',
                goBack: function () {
                    $(".login-content").toggle();
                },
                onSuccess(obj) {
                    // 成功跳转忘记密码页面
                    loginAlertToggle();
                    window.location.href = "/register.html?phone=" + obj.phone + "#/reset_password"
                }
            }, $('.login-alert-box'))
        })
    }

    /**
     * 控制登录弹窗
     */
    function loginAlertToggle() {
        $('#login-alert-cell').toggle();
        return false;
    }

    /**
     * 图形验证码获取
     */
    function refreshImgCode() {
        let imgSrc = config.host_name + config.api_name + "/getImgVerifyCode" + "?timeflag=" + new Date().getTime();
        let imgSrcDom = document.querySelector('.login-img-code-img');
        imgSrcDom.src = imgSrc;
    }
});


