/**
 * 左侧滑动导航栏
 * Created by easyLottoMac_Feng on 2018/12/6.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import $ from 'jquery';

module.exports = Vue.component('analysis-left-tab-bar', {
    template,
    props: {
        idDomArr: {                     // 导航栏的 idDom
            default: function () {
                return []
            }
        },
        titleHeight: {                  // 模块头部title的高度
            default: 0
        }
    },
    mounted(){
        this.initData()
    },
    watch:{
        idDomArr(newValue){
            this.initData(newValue)
        }
    },
    methods: {
        /**
         * 数据重置
         */
        initData(dataArr) {
            let _self = this;
            let idArr = dataArr || _self.idDomArr;
            let titleH = _self.titleHeight;
            $(function () {
                let $elLi = $('.left-tab-bar li');      // liDom
                let $leftTabBar = $("#left-tab-bar");   // 左边的导航栏容器 Dom
                // 循环储存每个$Dom
                let $Dom = [];                          // 储存导航栏中的每一个模块的dom
                idArr.forEach(item => {
                    $Dom.push($(item.idName));
                });
                // 初始化页面的首个选中导航栏目
                _self.changeLiClass($elLi);
                // 页面的滚动解绑事件
                $(window).unbind();
                // 页面的滚动事件
                $(window).scroll(function () {
                    // 计算每个模块的距离页面顶部的距离
                    let topArr = [];
                    $Dom.forEach(item => {
                        topArr.push(item.offset().top - (titleH + 10));
                    });
                    let $window = $(this);
                    let scrollTop = $window.scrollTop();
                    let FirstDomTop = $Dom[0].offset().top;         // 第一模块距离页面顶部的距离 Y
                    if ($window.scrollTop() > FirstDomTop) {
                        $leftTabBar.animate({
                            top: $window.scrollTop() - (FirstDomTop - titleH)
                        }, 60);
                    } else {
                        $leftTabBar.animate({
                            top: titleH - 2
                        }, 60);
                    }

                    // 页面滚动的时候控制导航栏展示的对应区域值
                    topArr.forEach((tfItem, index) => {
                        if (scrollTop < tfItem && index === 1) {
                            _self.changeLiClass($elLi, 0);
                        } else if (index > 1) {
                            if (topArr[index - 1] < scrollTop && scrollTop < tfItem) {
                                _self.changeLiClass($elLi, index - 1);
                            }
                        }
                    });
                });
                // 解绑导航栏的按钮事件
                $elLi.unbind();
                // 为了当页面滚动到最底部时点击导航栏改变导航栏选中的模块样式
                $elLi.click(function () {
                    $(this).addClass('active-li').siblings().removeClass('active-li');
                });
                _self.controlScrollSpeed();
            })
        },
        /**
         * 改变列表样式
         * @param $el    导航栏元素
         * @param Num   导航栏索引
         */
        changeLiClass($el, Num) {
            $el.eq(Num || 0).addClass('active-li').siblings().removeClass('active-li');
        },
        /**
         * 控制点击锚连接时页面滚动的速度
         */
        controlScrollSpeed() {
            // 防止事件重绑
            $('#left-tab-bar a[href*="#"]').unbind();
            // 事件绑定
            $('#left-tab-bar a[href*="#"]').click(function (e) {
                let target = $(this.hash);
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 300);
                }
            });
        }
    }
});