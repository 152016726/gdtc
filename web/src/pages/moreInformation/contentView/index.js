/**
 * 更多资讯模块
 * Created by easyLottoMac_Feng on 2019/3/27.
 */
import './style.scss';
import Vue from 'vue';
import template from './index.template';
import '../pageTool';
import getInformationList from 'services/getInformationList';
import getHostInfo from 'services/getHostsInfo';
import {
    OFFICIAL_NODEID,
    WINNINGNEWS_NODEID,
    PLAYING_SKILLS_NODEID,
    HOME_INFORMATIONS,
    HEADLINES_NODEID,
    PROSPECT_NODEID,
    RECOMMEND_NODEID
} from '#/constants/articleConfig';
import util from "@easylotto/util";

const PAGETITLE = [             // 文章 nodeID
    {title: '中奖喜报', id: WINNINGNEWS_NODEID},
    {title: '玩法技巧', id: PLAYING_SKILLS_NODEID},
    {title: '官方公告', id: OFFICIAL_NODEID},
    {title: '每日推荐', id: RECOMMEND_NODEID},
    {title: '赛事资讯', id: '0'}
];
const PAGE_SIZE = '16';             //每次请求的条数

module.exports = Vue.component('more-information-view', {
    data() {
        return {
            titleText: '官方公告',          // 左边模块 title
            leftLists: [],                 // 左边模块资讯列表
            hotNewsDay: [],                // 每日热点数据
            recomReading: [],              // 阅读推荐文章数据
            isShowPageTool: false,         // 是否展示左边数据的页码器
            id: '0',                       // 当前左边模块的数据 nodeId
            staticResourceHost: '',        // 静态数据 host
            totalNum: '',                 // 列表总条数
            pageSize: PAGE_SIZE            // 每页展示的条数
        }
    },
    template,
    created() {
        getHostInfo.getData().then(rap => {
            this.staticResourceHost = rap.data.staticResourceHost;
            this.setLeftList();
            this.setHotNewsDay();
            this.setRecomReading();
        });
    },
    methods: {
        /**
         * 获取左边模块数据
         */
        setLeftList(pageSize = "0") {
            const {id = '0'} = util.getUrlVars() || {};
            this.id = id;
            let pageT = PAGETITLE.filter(PT => {
                return PT.id === this.id
            })[0];
            // 左边模块数据填补
            this.titleText = pageT.title;
            let reqLeftData = {
                nodeIds: id === '0' ? HOME_INFORMATIONS: [pageT.id],
                pageIndex: pageSize,
                pageSize: PAGE_SIZE
            };
            this.requestData(reqLeftData).then(rap => {
                this.leftLists = rap.list;
                this.totalNum = rap.total;
                this.isShowPageTool = parseInt(rap.total) >= parseInt(PAGE_SIZE);
            });
        },
        /**
         * 获取每日热点文章
         */
        setHotNewsDay() {
            let reqLeftData = {
                nodeIds: [HEADLINES_NODEID],
                pageIndex: '0',
                pageSize: '6'
            };
            this.requestData(reqLeftData).then(rap => {
                this.hotNewsDay = rap.list;
            });
        },
        /**
         * 获取阅读推荐文章
         */
        setRecomReading() {
            let reqLeftData = {
                nodeIds: [PROSPECT_NODEID],
                pageIndex: '0',
                pageSize: '10'
            };
            this.requestData(reqLeftData).then(rap => {
                this.recomReading = rap.list;
            });
        },
        /**
         * 页码器回调
         * @param val      页码
         */
        callBackHandle(val) {
            this.setLeftList((val - 1) + '');
        },
        /**
         *  数据接口请求
         * @param dataObj  参数对象
         */
        requestData(dataObj) {
            let deObj = {
                nodeIds: [HOME_INFORMATIONS],
                pageIndex: "0",
                pageSize: PAGE_SIZE
            };
            let reqObj = Object.assign({
                author: "",
                keyWords: "",
                from: "",
                to: "",
                deviceType: "0"
            }, dataObj || deObj);
            return getInformationList.getData(reqObj).then(rsp => {
                let rspData = rsp.data.list;
                rspData.forEach(RF => {
                    RF.link = this.staticResourceHost + RF.link;
                });
                return Promise.resolve({list: rspData, total: rsp.data.total});
            }, () => {
                return Promise.resolve({});
            });
        }
    }
});
