/*封装开关显示隐藏效果*/
require("./style.scss");
require("component/login");
require('component/register');
var $ = require("jquery");
import Account from '#/account';
import getCurrentClientService from '~/services/getCurrentClientService';

$(function () {
    function init() {

        initData();
        getUserData();
    }

    init();


    function initData() {
        // 计时器
        var timeFlag;
        // 动画控制
        var aniFlag;
        $(".navigation li","#header").click(function () {
            $(this).siblings().removeClass('active');
            $(this).addClass("active");
        });
        $(".choosePlay","#header").mouseenter(function () {
            timeFlag = setTimeout(() => {
                $(".plays",".choosePlay").stop(true, true);
                $(".plays",".choosePlay").slideToggle('fast');
                $(".plays",".choosePlay").prev().removeClass('below').addClass('up');
                aniFlag = true;
            }, 500)
        });
        $(".choosePlay","#header").mouseleave(function () {
            clearTimeout(timeFlag);
            $(".plays",".choosePlay").prev().removeClass('up').addClass('below');
            if(aniFlag){
                $(".plays",".choosePlay").stop(true, true);
                $(".plays",".choosePlay").slideToggle('fast');
            }
            aniFlag = false;
        });

        /**
         * 登出逻辑
         */
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