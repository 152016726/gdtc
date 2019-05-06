import Vue from "vue";
import tpl from "./index.template";
import getDotCityList from "../../../services/getDotCityList";
import $ from 'jquery';
import Map from '@easylotto/map';

module.exports = Vue.component('dot-map', {
    data() {
        return {
            list: [],
            count: 0,            // 竞彩店数量
            pageStart: 1,        // 页码按钮从第几开始渲染
            pageIndex: 1,        // 当前列表是第几页, 从1开始
            keyword: '',         // 搜索关键字
            city: window.DOT_STATIC_DATA.citys[0].name,  //市
            area: window.DOT_STATIC_DATA.citys[0].areas[0].name,
            areaList: window.DOT_STATIC_DATA.citys[0].areas
        }
    },
    mounted() {
        this.updateList();
        let allMap = new Map({
            key: "0bM3ENtV88SpP5GP64YMOxR9lck9LBhg",
            type: "baidu",
            content: "allMap",
            zoom: 11
        });
        allMap.onReady(() => {
            allMap.setCenter(this.city);
        });
        window.DOT_GET_AREA = this.updateWeatherStr;
        this.updateWeather();
    },
    props: {
        pageSize: {        // 一页显示多少个城市信息
            default: 30
        },
        pageBtnCountMax: { // 最多显示多少个页码按钮
            default: 6
        },
        cityList: {        // 城市列表数据
            default: function () {
                return window.DOT_STATIC_DATA.citys
            }
        },
        weather: {
            default: ''
        }
    },
    computed: {
        /**
         * 显示多少个页码按钮
         * @returns {number}
         */
        pageBtnCount: function () {
            let count = Math.ceil((this.count - (this.pageStart - 1) * this.pageSize) / this.pageSize);
            let pageBtnCountMax = this.pageBtnCountMax;
            if (count > pageBtnCountMax) {
                count = pageBtnCountMax;
            }
            return count;
        },
        /**
         * 一共有多少页
         */
        pageCount: function () {
            return Math.ceil(this.count / this.pageSize);
        }
    },
    methods: {
        /**
         * 接口更新
         */
        updateList: function () {
            let {pageIndex, pageSize, keyword, city, area} = this;
            let obj = {
                pageIndex: (pageIndex - 1) * pageSize,
                pageSize,
                keyword,
                city,
                area
            };
            getDotCityList.getData(obj).then((rsp) => {
                this.list = rsp.data.list;
                this.count = rsp.data.total;
            });
            //this.list = window.DOT_STATIC_DATA.mapCityList;
        },

        /**
         * 点击列表地点
         */
        handleMap() {
        },

        /**
         * 显示市
         */
        showCity() {
            $('.select_box.city .selector').slideToggle('fast');
            $('.select_box.area .selector').hide('fast');
        },

        /**
         * 改变市
         */
        changeCity(cityName, index) {
            this.area = window.DOT_STATIC_DATA.citys[index].areas[0].name;
            this.areaList = window.DOT_STATIC_DATA.citys[index].areas;
            this.city = cityName;
            $('.select_box.city .selector').slideToggle('fast');
            this.updateWeather();
        },

        /**
         * 显示区
         */
        showArea() {
            $('.select_box.city .selector').hide('fast');
            $('.select_box.area .selector').slideToggle('fast');
        },

        /**
         * 改变区
         */
        changeArea(ele) {
            this.area = ele.name;
            $('.select_box.area .selector').slideToggle('fast');
            this.updateWeather();
        },

        /**
         * 点击页面
         */
        changePage: function (index) {
            if (index === this.pageIndex) {
                return;
            }
            this.pageIndex = index;
            this.updateList();
        },
        updateWeather(){
            let url = 'https://free-api.heweather.net/s6/weather/now?key=a077138d11b4436e84f2e98cf3e29e70&location=' + encodeURI(this.area.replace(/(市|区|镇|县)$/g, ''));
            let self = this;
            $.ajax({
                url:url,//可以不是本地域名
                type:'post',
                success: function (data) {
                    console.log(data);
                    let result = data.HeWeather6[0].now;
                    self.weather = `${result.cond_txt} ${result.tmp}℃ ${result.wind_dir}${result.wind_sc}级`;
                }
            });
        },
        /**
         * 点击上一页或下一页
         * @param num {Number} -1为上一页，1为下一页
         */
        changePageStart: function (num) {
            let {pageStart, pageSize, count, pageBtnCountMax} = this;
            if (pageStart == 1 && num === -1) {
                return;
            }
            if (Math.ceil((count - (pageStart - 1) * pageSize) / pageSize) <= pageBtnCountMax && num === 1) {
                return;
            }
            this.pageStart += num;
        }
    },
    template: tpl
});

