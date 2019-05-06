import Vue from 'vue';
import './index.scss';
import 'plugin/swiper/css/swiper.css';
import $ from 'jquery';
import Swiper from 'plugin/swiper/js/swiper';
import template from './index.template';
import getExperts from 'services/getExperts';

module.exports = Vue.component('expert-list', {
    data() {
        return {
            expertList: []    // 专家列表
        }
    },
    template,
    props: {

    },
    methods: {},
    created(){
        getExperts.getData({
            "pageIndex": "0",
            "pageSize": "9999999"
        }).then(rsp=>{
            this.expertList = rsp.data.list;
            // console.log(rsp.data.list, 'list')
        },rej=>{
            console.log(rej.rspMsg);
        });
    },
    updated() {
        let bannerSwiper = new Swiper('.swiper-container', {
            loop: true,
            autoplay: 2000,
            speed: 1000,
            slidesPerView: 5,
            grabCursor: true
        });
        // console.log(bannerSwiper, '轮播');
        // 滑入，滑出轮播跟着停止，启动
        $(".swiper-container").mouseover(function () {
            bannerSwiper.stopAutoplay();
        }).mouseout(function () {
            bannerSwiper.startAutoplay();
        });
        // 上一个下一个
        $(".pre").on('click',function (e) {
            e.preventDefault();
            bannerSwiper.swipePrev();
        });
        $(".next").on('click', function (e) {
            e.preventDefault();
            bannerSwiper.swipeNext();
        });
    }
});