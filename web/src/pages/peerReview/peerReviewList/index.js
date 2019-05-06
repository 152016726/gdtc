/**
 * Created by easyLottoMac_Feng on 2019/2/13.
 */
import './style.scss';
import Vue from 'vue';
import template from './index.template';
import '../component/dropSelect';
import getPeerReview from 'services/getPeerReview';
import getPeerReviewList from 'services/getPeerReviewList';
import util from "@easylotto/util";
import _ from 'lodash';

const ONEDATETIME = 24 * 60 * 60 * 1000; // 一天的毫秒数
const PAGESIZE = '200';                  // 每次请求的条数
let _defautMarketList = [];              // 储存所有赛事

module.exports = Vue.component('peer-review-list', {
    data() {
        return {
            marketPeerList: [],         // 符合条件的赛事
            marketLen: 0,               // 赛事场数
            winLen: 0,                  // 主胜的场数
            winRatio: '0.00',           // 主胜的比率
            flatLen: 0,                 // 平局的场数
            flatRatio: '0.00',          // 平局的比率
            loseLen: 0,                 // 客胜的场数
            loseRatio: '0.00',          // 客胜的比率
            isSingle: false,            // 是否只展示单关
            winContentArr: [            // 主胜赔率选项
                {text: '全部', typeNum: 0}
            ],
            winSelectValue: 0,          // 主胜选中的赔率下标值
            winTitleText: '全部',       // 主胜选中的赔率展示文字
            flatContentArr: [           // 平局赔率选项
                {text: '全部', typeNum: 0}
            ],
            flatSelectValue: 0,         // 平局选中的赔率下标值
            flatTitleText: '全部',      // 平局选中的赔率展示文字
            loseContentArr: [           // 客胜赔率选项
                {text: '全部', typeNum: 0}
            ],
            loseSelectValue: 0,         // 客胜选中的赔率下标值
            loseTitleText: '全部',       // 客胜选中的赔率展示文字
            leagueArr: [
                {text: '赛事选择', typeNum: 0, leagueId: '0'}
            ],
            leagueTitleText: '赛事选择',
            leagueSelectValue: 0,
            selected: '0'
        }
    },
    template,
    created() {
        let vars = util.getUrlVars();
        if (vars.odds) {
            let oddsArr = vars.odds.split('-');
            this.setOddsData(oddsArr[0], oddsArr[1], oddsArr[2])
        } else {
            this.setWeekData();
        }

    },
    methods: {
        /**
         * 根据赔率请求接口
         * @param win     主胜赔率
         * @param draw    平赔率
         * @param defeat  客胜赔率
         */
        setOddsData(win = '0.00', draw = '0.00', defeat = '0.00') {
            if (win === '0.00' && draw === '0.00' && defeat === '0.00') return;
            // 数据初始化
            this.winTitleText = win;
            this.winSelectValue = 1;
            this.flatTitleText = draw;
            this.flatSelectValue = 1;
            this.loseTitleText = defeat;
            this.loseSelectValue = 1;
            this.winContentArr.push({
                text: win, typeNum: 1
            });
            this.flatContentArr.push({
                text: draw, typeNum: 1
            });
            this.loseContentArr.push({
                text: defeat, typeNum: 1
            });
            let rspObj = Object.assign({
                isSingle: 'false',
                oddsState: '0',
                pageIndex: '0',
                pageSize: PAGESIZE
            }, win !== '0.00' && {win}, draw !== '0.00' && {draw}, defeat !== '0.00' && {defeat});
            getPeerReviewList.getData(rspObj).then(rsp => {
                _defautMarketList = rsp.data.list;
                this.setViewData(rsp.data.list);
            })

        },
        /**
         * 七天的接口数据请求
         */
        setWeekData() {
            let _today = new Date();
            let beforeDate = new Date(_today.getTime() - ONEDATETIME * 7);
            let startDate = beforeDate.format('yyyy-MM-dd');
            let endDate = _today.format('yyyy-MM-dd');
            let rspObj = {
                from: startDate,
                to: endDate,
                pageIndex: '0',
                pageSize: PAGESIZE
            };
            getPeerReview.getData(rspObj).then(rsp => {
                let MkList = rsp.data.list;
                _defautMarketList = MkList;
                this.setViewData(MkList);
            })
        },
        /**
         * 主胜赔率选择事件
         * @param data
         */
        winSelectHandle(data) {
            this.winSelectValue = data.typeNum;
            this.winTitleText = data.text;
        },
        /**
         * 平局赔率选择事件
         * @param data
         */
        flatSelectHandle(data) {
            this.flatSelectValue = data.typeNum;
            this.flatTitleText = data.text;
        },
        /**
         * 客胜赔率选择事件
         * @param data
         */
        loseSelectHandle(data) {
            this.loseSelectValue = data.typeNum;
            this.loseTitleText = data.text;

        },
        /**
         * 赛事选择事件
         * @param data
         */
        leagueSelectHandle(data) {
            this.leagueTitleText = data.text;
            this.leagueSelectValue = data.typeNum;
        },
        /**
         * 赛事查询按钮事件
         */
        marketSelectHandle() {
            let {
                winSelectValue, flatSelectValue, loseSelectValue, leagueSelectValue, winContentArr,
                flatContentArr, loseContentArr, leagueArr, isSingle
            } = this;
            let marketList = _defautMarketList;
            // 是否是单关筛选
            if (isSingle) {
                marketList = marketList.filter(MF => {
                    return MF.dgStatus === '1'
                })
            }
            marketList = this.selectMarket(marketList, winContentArr, winSelectValue, 'win');
            marketList = this.selectMarket(marketList, flatContentArr, flatSelectValue, 'draw');
            marketList = this.selectMarket(marketList, loseContentArr, loseSelectValue, 'defeat');
            marketList = this.selectMarket(marketList, leagueArr, leagueSelectValue, 'leagueShortName');
            this.marketPeerList = marketList;
            this.setViewData(marketList);
        },
        /**
         * 重置按钮事件
         */
        resetHandel() {
            this.winSelectValue = 0;
            this.winTitleText = '全部';
            this.flatSelectValue = 0;
            this.flatTitleText = '全部';
            this.loseSelectValue = 0;
            this.loseTitleText = '全部';
            this.leagueSelectValue = 0;
            this.leagueTitleText = '赛事选择';
            this.setViewData(_defautMarketList);
        },
        /**
         * 单关按钮事件
         */
        singleHandle() {
            this.isSingle = !this.isSingle;
            if (this.isSingle) {
                this.marketPeerList = _defautMarketList.filter(DF => {
                    return DF.dgStatus === '1';
                })
            } else {
                this.marketPeerList = _defautMarketList;
            }
        },
        /**
         * 奖金变化筛选事件
         */
        bonusSelectHandle() {
            switch (this.selected) {
                case '0':
                    this.marketPeerList = _defautMarketList;
                    break;
                case "1":
                    this.marketPeerList = _defautMarketList.filter(DF => {
                        return DF.inEnd === 'false';
                    });
                    break;
                case '2':
                    this.marketPeerList = _defautMarketList.filter(DF => {
                        return DF.inEnd === 'true';
                    });
                    break;
            }
        },
        /**
         * 获取筛选条件内容
         * @param MkList
         * @returns {{winContentArr: (*|Array), flatContentArr: (*|Array), loseContentArr: (*|Array), leagueArr: *}}
         */
        setContentArr(MkList) {
            let winContent, flatContent, loseContent, leagueContent;
            let winContentArr = [];         // 主胜的赔率
            let flatContentArr = [];        // 平局的赔率
            let loseContentArr = [];        // 客胜的赔率
            let leagueArr = this.leagueArr; // 赛事
            let leagueIndex = 1;            // 赛事下标索引
            let winIndex = 1;               // 胜的索引值
            let flatIndex = 1;              // 平的索引值
            let loseIndex = 1;              // 负的索引值
            MkList.forEach(ML => {
                if (ML.win !== '0.00' && ML.defeat !== '0.00' && ML.draw !== '0.00') {
                    // 筛选不同的胜赔率
                    winContent = this.selectContentArr(winContentArr, ML.win, winIndex);
                    winContentArr = winContent.contentArr;
                    winIndex = winContent.index;
                    // 筛选不同的平赔率
                    flatContent = this.selectContentArr(flatContentArr, ML.draw, flatIndex);
                    flatContentArr = flatContent.contentArr;
                    flatIndex = flatContent.index;
                    // 筛选不同的负赔率
                    loseContent = this.selectContentArr(loseContentArr, ML.defeat, loseIndex);
                    loseContentArr = loseContent.contentArr;
                    loseIndex = loseContent.index;
                    // 筛选不同的联赛
                    leagueContent = this.selectContentArr(leagueArr, ML.leagueShortName, leagueIndex, ML.leagueId);
                    leagueArr = leagueContent.contentArr;
                    leagueIndex = leagueContent.index;
                }
            });
            // 对赔率进行排序
            winContentArr = _.sortBy(winContentArr, ['text']);
            winContentArr.unshift({text: '全部', typeNum: 0});
            flatContentArr = _.sortBy(flatContentArr, ['text']);
            flatContentArr.unshift({text: '全部', typeNum: 0});
            loseContentArr = _.sortBy(loseContentArr, ['text']);
            loseContentArr.unshift({text: '全部', typeNum: 0});
            this.winContentArr = winContentArr;
            this.flatContentArr = flatContentArr;
            this.loseContentArr = loseContentArr;
            this.leagueArr = leagueArr;
        },
        /**
         * 页面数据的展示处理
         * @param MkList  所有赛事
         */
        setViewData(MkList = []) {
            this.marketPeerList = MkList;
            this.marketLen = MkList.length;
            this.winLen = MkList.filter(MF => {
                return MF.homeScore > MF.awayScore;
            }).length;
            this.winRatio = this.setRatio(this.marketLen, this.winLen);
            this.flatLen = MkList.filter(MF => {
                return MF.homeScore === MF.awayScore;
            }).length;
            this.flatRatio = this.setRatio(this.marketLen, this.flatLen);
            this.loseLen = MkList.filter(MF => {
                return MF.homeScore < MF.awayScore;
            }).length;
            this.loseRatio = this.setRatio(this.marketLen, this.loseLen);
            this.setContentArr(MkList);
        },
        /**
         * 条件筛选赛事
         * @param marketList    // 需要进行赛选的赛事
         * @param contentArr    // 可以筛选的条件
         * @param selectValue   // 筛选条件的索引值
         * @param typeStr       // 筛选条件类型
         * @returns {*}
         */
        selectMarket(marketList, contentArr, selectValue, typeStr) {
            if (!selectValue) return marketList;
            let wsv = contentArr.filter(WF => {
                return WF.typeNum === selectValue
            })[0].text;
            return marketList.filter(DF => {
                return DF[typeStr] === wsv
            })
        },
        /**
         * 筛选不同的赔率
         * @param contentArr  需要筛选的赔率
         * @param type        需要进行比较的值
         * @param index       值的索引下标
         * @param leagueId    联赛 ID
         * @returns {*|Array}
         */
        selectContentArr(contentArr, type, index, leagueId) {
            let flag = contentArr.some(WS => {
                return WS.text === type;
            });
            if (!flag) {
                contentArr.push(Object.assign({
                    text: type,
                    typeNum: index++
                }, leagueId && {leagueId}));
            }
            return {contentArr, index};
        },
        /**
         * 计算概率
         * @param allLen  总的赛事场数
         * @param len     单种赛事场数
         * @returns {string}
         */
        setRatio(allLen = 0, len = 0) {
            return allLen ? ((len / allLen) * 100).toFixed(2) : '0.00';
        }
    }
});