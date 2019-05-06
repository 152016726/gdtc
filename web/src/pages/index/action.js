/**
 * Created by ljx on 2018/4/17.
 */
require('./style.scss');
require('plugin/swiper/css/swiper.css');

var $ = require("jquery");
var Swiper = require('plugin/swiper/js/swiper.js');

function formatCDate(str) {
    var code = str.slice(-3);
    var num = str.slice(-4,-3);
    switch (num) {
        case "0":
            num = '周日' + code;
            break;
        case "1":
            num = '周一' + code;
            break;
        case "2":
            num = '周二' + code;
            break;
        case "3":
            num = '周三' + code;
            break;
        case "4":
            num = '周四' + code;
            break;
        case "5":
            num = '周五' + code;
            break;
        case "6":
            num = '周六' + code;
            break;
        default:
            break;
    }
    return num;
}

$(function () {
    initData();
});

function initData() {
    // 设置头部
    $(".choosePlay", "#header").hide();
    $(".selectPlay", "#header").show();
    $(".navigation li:eq(0)", "#header").addClass('active');
    // banner轮播
    setBanner();
    // 焦点赛事
    setFocusEvents();
    // 日期转化为周几00几
    var completeNoEle = $(".completeNo", ".index");
    completeNoEle.each(function (i) {
        completeNoEle.eq(i).text(formatCDate(completeNoEle.eq(i).text()));
    });
    // 竞彩图集
    // setPhotoList();

    /**
     *  description banner轮播
     */
    function setBanner() {
        var bannerSwiper = new Swiper('.swiper-container', {
            pagination: '.pagination',
            loop: true,
            autoplay: 5000,
            speed: 3000,
            grabCursor: true,
            paginationClickable: true
        });
        // 设置轮播的页码
        var paginations = $(".swiper-pagination-switch", ".swiper-container .pagination");
        paginations.each(function (i) {
            paginations.eq(i).html(i + 1);
        });

        // 滑入，滑出轮播跟着停止，启动
        $(".swiper-container").mouseover(function () {
            bannerSwiper.stopAutoplay();
        }).mouseout(function () {
            bannerSwiper.startAutoplay();
        });
    }

    /**
     * description 焦点赛事轮播
     */
    function setFocusEvents() {
        var focusSwiper = new Swiper('#focusEvent', {
            pagination: '.swiper-pagination',
            loop: true,
            speed: 1000,
            grabCursor: true,
            paginationClickable: true
        });
        // 焦点赛事场次
        var pages;

        // 向左切换
        $(".leftBtn", ".footFocus").on('click', function (e) {
            e.preventDefault();
            var stringData = JSON.parse($(this).attr("data"));
            pages = stringData.length;
            focusSwiper.swipePrev();
            swiperAnimate(stringData, focusSwiper.activeIndex -1);
        });

        // 向右切换
        $(".rightBtn", ".footFocus").on('click', function (e) {
            e.preventDefault();
            var stringData = JSON.parse($(this).attr("data"));
            pages = stringData.length;
            focusSwiper.swipeNext();
            swiperAnimate(stringData, focusSwiper.activeIndex -1);
        });

        /**
         * description 让小喇叭展示当前焦点赛事的title信息
         * @param data 所有焦点赛事信息
         * @param num  当前所展示焦点赛事的索引
         */
        function swiperAnimate(data, index) {
            // swiper默认在轮播中前后添加了一个过渡盒子
            // 所以此处获取到的索引在最大最小的时候需要做特殊判断处理
            if(index === -1){ index = data.length -1}
            if(index === data.length){ index = 0}
            $(".short", ".footFocus").text(data[index] ? data[index]["news"]["title"] : '').attr("href", data[index] ? data[index]["news"]["link"] : '');
            $(".laba", ".footFocus").attr("href", data[index]["news"]["link"]);
        }
    }

    /**
     * description 竞彩图集
     */
    // function setPhotoList() {
    //     var photoSwiper = new Swiper('#photobox', {
    //         loop: true,
    //         autoplay: 2000,
    //         slidesPerView: 5,
    //         speed: 1000,
    //         grabCursor: true
    //     });
    //     photoSwiper.disableKeyboardControl(); //禁止键盘控制
    //     photoSwiper.disableMousewheelControl(); //禁止鼠标滑轮控制
    //     // 向左切换
    //     $(".leftBtn", ".photoList").on('click', function (e) {
    //         e.preventDefault();
    //         photoSwiper.swipePrev()
    //     });
    //
    //     // 向右切换
    //     $(".rightBtn", ".photoList").on('click', function (e) {
    //         e.preventDefault();
    //         photoSwiper.swipeNext()
    //     });
    //
    //     // 滑入，滑出轮播跟着停止，启动
    //     $("#photobox").mouseover(function () {
    //         photoSwiper.stopAutoplay();
    //     }).mouseout(function () {
    //         photoSwiper.startAutoplay();
    //     });
    // }
}