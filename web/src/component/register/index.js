import './style.scss';
import $ from 'jquery';
import part from '../phoneVerify';

$(function () {
    init()
    function init() {
        var  dialog;
        // 弹出注册框
        $('#top-register-btn').click(registerAlertToggle);

        // 关闭注册弹窗
        $('.close-register-btn').click(function () {
            registerAlertToggle();
            $(".register-content").show();
            if(dialog){
                dialog.closeDialog();
            }
        });

        // 弹出登录框
        $('.transfer-login').click(function () {
            $('#login-alert-cell').toggle();
            $('#register-alert-cell').toggle();
            return false;
        });

        $('.use-phone').click(function () {
            $(".register-content").toggle();
            dialog = part.showPart({
                goBack:function () {
                    $(".register-content").toggle();
                },
                onSuccess(obj){
                    $(".register-content").toggle();
                    location.href="./register.html?phone="+ obj.phone +"#/register_view";
                }
            }, $('.register-alert-box'))
        })
    }

    /**
     * 控制注册弹窗
     */
    function registerAlertToggle() {
        $('#register-alert-cell').toggle();
        return false;
    }

});