/**
 * Created by feng on 2018/06/11.
 */
import Vue from 'vue';
require('./style.scss');
require('babel-polyfill');
import './contentView';

window.onload = function(){
    new Vue({
        el: '#root',
        data:{
            telNum: 18666082013
        },
        created() {
            console.log('create..........');
            this.telNum = 18666082013
        }
    })
};
// init();

// function init() {
//     var len = 0;
//     var str = "";
//     var eStr = "";
//     var idName = "";
//     var rClass = "";
//     var flag = false;
//     var reg_NPW = 'NPW';
//     var reg_CO = /^\d{6}$/; //验证码的正则验证
//     var reg_PW = /^.{8,20}$/; //密码的正则验证
//     var reg_PN = /^1[345678][0-9]{9}$/; //手机号码的正则验证
//
//     var registerInfo = [{
//             id: 'phoneNum',
//             reg_1: reg_PN,
//             aClass: '',
//             str_1: '',
//             str_2: '手机号码不能为空',
//             str_3: '手机号码不合法',
//             rClass: ''
//         },
//         {
//             id: 'code',
//             reg_1: reg_CO,
//             aClass: '',
//             str_1: '',
//             str_2: '验证码不能为空',
//             str_3: '请输入正确的验证码',
//             rClass: ''
//         },
//         {
//             id: 'passWord',
//             reg_1: reg_PW,
//             aClass: 'tipsGrey',
//             str_1: '8 - 20字符长度，可由字母、数字和字符(如!@#)组成。',
//             str_2: '密码不能为空',
//             str_3: '请输入 8 - 20字符长度。',
//             rClass: 'tipsGrey'
//         },
//         {
//             id: 'newPassWord',
//             reg_1: reg_NPW,
//             aClass: 'tipsGrey',
//             str_1: '请再次输入密码',
//             str_2: '确认密码不能为空',
//             str_3: '两次输入密码不正确',
//             rClass: 'tipsGrey'
//         }
//     ];
//
//     $.each(registerInfo, function (i, vai) {
//         $("#" + vai.id).focus(function () {
//             $(this).removeClass('tipBorder').siblings('.tips').text(vai.str_1).addClass(vai.aClass)
//                 .siblings('.tips-icon').removeClass('icon-error icon-sure').hide();
//         }).blur(function () {
//             // 再次输入密码需要特殊处理
//             if (vai.reg_1 === "NPW") {
//                 flag = $('#passWord').val() !== $(this).val();
//             } else {
//                 flag = !(vai.reg_1.test($(this).val()));
//             }
//
//             if ($(this).val() === "") {
//                 str = vai.str_2;
//                 rClass = vai.rClass;
//                 tipFn(this, str, rClass);
//             } else if (flag) {
//                 str = vai.str_3;
//                 rClass = vai.rClass;
//                 tipFn(this, str, rClass);
//             } else {
//                 if (vai.id === "newPassWord") {
//                     $(this).siblings('.tips').text('').siblings('.tips-icon').addClass('icon-sure').show();
//                 } else {
//                     $(this).siblings('.tips-icon').addClass('icon-sure').show();
//                 }
//             }
//         });
//     });
//
//     $('#passWord').keyup(function () {
//         len = $(this).val().length;
//         eStr = "8 - 20字符长度，可由字母、数字和字符(如!@#)组成。";
//         if (len > 7 && len < 21) {
//             eStr = '密码强度：' + passType($(this).val());
//             if ($('#newPassWord').val() !== "") {
//                 if ($(this).val() !== $('#newPassWord').val()) {
//                     idName = "#newPassWord";
//                     str = '两次输入密码不正确';
//                     rClass = 'tipsGrey';
//                     tipFn(idName, str, rClass);
//                 } else {
//                     $('#newPassWord').siblings('.tips').text('').siblings('.tips-icon')
//                         .removeClass('icon-error').addClass('icon-sure').show();
//                 }
//             }
//         }
//         $(this).siblings('.tips').text(eStr).addClass('tipsGrey');
//     });
// }
//
// /**
//  * 错误提示
//  * @param _this :操作元素对象
//  * @param str ：需要显示的提示语
//  * @param rClass ：需要移除的类
//  */
// function tipFn(_this, str, rClass) {
//     $(_this).addClass('tipBorder').siblings('.tips').text(str).removeClass(rClass)
//         .siblings('.tips-icon').removeClass('icon-sure').addClass('icon-error').show();
// }
//
//
// // 密码强弱验证
// function passType(password) {
//     var desc = new Array();
//     desc[0] = "弱";
//     desc[1] = "中";
//     desc[2] = "强";
//     var score = 0;
//     if ((((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) ||
//         ((password.match(/[a-z]/)) && (password.match(/[0-9]/))) ||
//         ((password.match(/[A-Z]/))) && (password.match(/[0-9]/))) &&
//         password.length > 7)
//         score++;
//     if ((((password.match(/[_\!\@\#\$\%\^\&\*\(\)]/)) &&
//         (password.match(/[a-z]/)) && (password.match(/[A-Z]/))) ||
//         ((password.match(/[_\!\@\#\$\%\^\&\*\(\)]/)) && (password.match(/[a-z]/)) &&
//         (password.match(/[0-9]/))) || ((password.match(/[_\!\@\#\$\%\^\&\*\(\)]/)) &&
//         (password.match(/[A-Z]/))) && (password.match(/[0-9]/))) && password.length > 10)
//         score++;
//     return desc[score];
// }
// function init() {
//     var len = 0;
//     var str = "";
//     var eStr = "";
//     var idName = "";
//     var rClass = "";
//     var flag = false;
//     var reg_NPW = 'NPW';
//     var reg_CO = /^\d{6}$/; //验证码的正则验证
//     var reg_PW = /^.{8,20}$/; //密码的正则验证
//     var reg_PN = /^1[345678][0-9]{9}$/; //手机号码的正则验证
//
//     var registerInfo = [{
//             id: 'phoneNum',
//             reg_1: reg_PN,
//             aClass: '',
//             str_1: '',
//             str_2: '手机号码不能为空',
//             str_3: '手机号码不合法',
//             rClass: ''
//         },
//         {
//             id: 'code',
//             reg_1: reg_CO,
//             aClass: '',
//             str_1: '',
//             str_2: '验证码不能为空',
//             str_3: '请输入正确的验证码',
//             rClass: ''
//         },
//         {
//             id: 'passWord',
//             reg_1: reg_PW,
//             aClass: 'tipsGrey',
//             str_1: '8 - 20字符长度，可由字母、数字和字符(如!@#)组成。',
//             str_2: '密码不能为空',
//             str_3: '请输入 8 - 20字符长度。',
//             rClass: 'tipsGrey'
//         },
//         {
//             id: 'newPassWord',
//             reg_1: reg_NPW,
//             aClass: 'tipsGrey',
//             str_1: '请再次输入密码',
//             str_2: '确认密码不能为空',
//             str_3: '两次输入密码不正确',
//             rClass: 'tipsGrey'
//         }
//     ];
//
//     $.each(registerInfo, function (i, vai) {
//         $("#" + vai.id).focus(function () {
//             $(this).removeClass('tipBorder').siblings('.tips').text(vai.str_1).addClass(vai.aClass)
//                 .siblings('.tips-icon').removeClass('icon-error icon-sure').hide();
//         }).blur(function () {
//             // 再次输入密码需要特殊处理
//             if (vai.reg_1 === "NPW") {
//                 flag = $('#passWord').val() !== $(this).val();
//             } else {
//                 flag = !(vai.reg_1.test($(this).val()));
//             }
//
//             if ($(this).val() === "") {
//                 str = vai.str_2;
//                 rClass = vai.rClass;
//                 tipFn(this, str, rClass);
//             } else if (flag) {
//                 str = vai.str_3;
//                 rClass = vai.rClass;
//                 tipFn(this, str, rClass);
//             } else {
//                 if (vai.id === "newPassWord") {
//                     $(this).siblings('.tips').text('').siblings('.tips-icon').addClass('icon-sure').show();
//                 } else {
//                     $(this).siblings('.tips-icon').addClass('icon-sure').show();
//                 }
//             }
//         });
//     });
//
//     $('#passWord').keyup(function () {
//         len = $(this).val().length;
//         eStr = "8 - 20字符长度，可由字母、数字和字符(如!@#)组成。";
//         if (len > 7 && len < 21) {
//             eStr = '密码强度：' + passType($(this).val());
//             if ($('#newPassWord').val() !== "") {
//                 if ($(this).val() !== $('#newPassWord').val()) {
//                     idName = "#newPassWord";
//                     str = '两次输入密码不正确';
//                     rClass = 'tipsGrey';
//                     tipFn(idName, str, rClass);
//                 } else {
//                     $('#newPassWord').siblings('.tips').text('').siblings('.tips-icon')
//                         .removeClass('icon-error').addClass('icon-sure').show();
//                 }
//             }
//         }
//         $(this).siblings('.tips').text(eStr).addClass('tipsGrey');
//     });
// }
//
// /**
//  * 错误提示
//  * @param _this :操作元素对象
//  * @param str ：需要显示的提示语
//  * @param rClass ：需要移除的类
//  */
// function tipFn(_this, str, rClass) {
//     $(_this).addClass('tipBorder').siblings('.tips').text(str).removeClass(rClass)
//         .siblings('.tips-icon').removeClass('icon-sure').addClass('icon-error').show();
// }
//
//
// // 密码强弱验证
// function passType(password) {
//     var desc = new Array();
//     desc[0] = "弱";
//     desc[1] = "中";
//     desc[2] = "强";
//     var score = 0;
//     if ((((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) ||
//         ((password.match(/[a-z]/)) && (password.match(/[0-9]/))) ||
//         ((password.match(/[A-Z]/))) && (password.match(/[0-9]/))) &&
//         password.length > 7)
//         score++;
//     if ((((password.match(/[_\!\@\#\$\%\^\&\*\(\)]/)) &&
//         (password.match(/[a-z]/)) && (password.match(/[A-Z]/))) ||
//         ((password.match(/[_\!\@\#\$\%\^\&\*\(\)]/)) && (password.match(/[a-z]/)) &&
//         (password.match(/[0-9]/))) || ((password.match(/[_\!\@\#\$\%\^\&\*\(\)]/)) &&
//         (password.match(/[A-Z]/))) && (password.match(/[0-9]/))) && password.length > 10)
//         score++;
//     return desc[score];
// }