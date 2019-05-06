/*封装开关显示隐藏效果*/
require("./style.scss");
require("component/login");
require('component/register');
let $ = require("jquery");
import Account from '#/account';
import getCurrentClientService from '~/services/getCurrentClientService';

$(function () {
    init();

    function init() {
        initData();
        getUserData()
    }

    /**
     * 页面数据初始化
     */
    function initData() {
        $(".navigation li","#expertHeader").click(function () {
            $(this).siblings().removeClass('active');
            $(this).addClass("active");
        });
        $('.logout-btn').click(function () {
            Account.logout().then(rsp => {
                $('.logout-status').show();
                $('.login-status').hide();
            });
        })
    }

    /**
     * 用户信息获取
     */
    function getUserData() {
        getCurrentClientService.getData().then((data) => {
            let accountInfo = Account.updateAccountInfo(data.data || {});
            // console.log(accountInfo);
            if(accountInfo.loginStatus === 1) {
                $('#user-image').attr('src', accountInfo.webApiPath + accountInfo.icon);
                $('.user-name').text(accountInfo.nickname);
                $('.logout-status').hide();
                $('.login-status').show();
            }
        }, (rejectData) => {
            console.log(rejectData);
        })
    }
});