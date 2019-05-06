/**
 * Created by easyLottoMac on 2018/11/16.
 */
import './style.scss';
import TplCompiler from 'modules/tplCompiler';
import model from './model';
import $ from 'jquery';
import 'plugin/swiper/css/swiper.css'
import Swiper from 'plugin/swiper/js/swiper.js';

let view = new TplCompiler({
    tplModel: model,
    template: require('./view.art'),
    events: {},
    rendered(){
        //展示大图的框
        let viewSwiper = new Swiper('.view .swiper-container', {
            onlyExternal: true,
            onSlideChangeStart: function() {
                updateNavPosition()
            }
        });
        //展示小图的框
        let previewSwiper = new Swiper('.preview .swiper-container', {
            visibilityFullFit: true,
            slidesPerView: 'auto',
            onlyExternal: false,
            onSlideClick: function() {
                viewSwiper.swipeTo(previewSwiper.clickedSlideIndex)
            }
        });
        $('.preview .arrow-left').on('click', function(e) {
            if (viewSwiper.activeIndex === 0) {
                viewSwiper.swipeTo(viewSwiper.slides.length - 1, 1000);
                return
            }
            viewSwiper.swipePrev()
        });
        $('.preview .arrow-right').on('click', function(e) {
            if (viewSwiper.activeIndex === viewSwiper.slides.length - 1) {
                viewSwiper.swipeTo(0, 1000);
                return
            }
            viewSwiper.swipeNext()
        });
        function updateNavPosition() {
            $('.preview .active-nav').removeClass('active-nav');
            let activeNav = $('.preview .swiper-slide').eq(viewSwiper.activeIndex).addClass('active-nav');
            if (!activeNav.hasClass('swiper-slide-visible')) {
                if (activeNav.index() > previewSwiper.activeIndex) {
                    let thumbsPerNav = Math.floor(previewSwiper.width / activeNav.width()) - 1;
                    previewSwiper.swipeTo(activeNav.index() - thumbsPerNav)
                } else {
                    previewSwiper.swipeTo(activeNav.index())
                }
            }
        }
    }
});

module.exports = view;