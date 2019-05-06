/**
 * 近期战绩的 view
 * Created by easyLottoMac_Feng on 2018/12/19.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import getRecentRecord from 'services/getRecentRecord';
import _ from 'lodash';
import '../../component/teamNameTitle';
import '../../component/resultBtn';
import '../../component/teamName';
import '../../component/resultBtn';
import '../../component/selectCompent/singleSelection';
import '../../component/selectCompent/multipleSelection';
import '../scoreDisplayView';

module.exports = Vue.component('analysis-recent-record-view', {
    data() {
        return {
            eventInfo: {},                       // 赛事信息
            fieldTitleText: '10场',              // 场数选择
            marketTitleText: '赛事选择',          // 赛事选择
            fieldTextLis: [                      // 场数选择下拉内容
                {text: '10场', typeIndex: 0, count: 10},
                {text: '20场', typeIndex: 1, count: 20}
            ],
            marketLis: [],                        // 联赛选怎下拉内容
            fieldActiveIndex: 0,                  // 场数选中的下标索引
            fieldMarketTitleText: '全部',
            marketTeams: [
                {text: '全部', typeIndex: 0},
                {text: '主场', typeIndex: 1},
                {text: '客场', typeIndex: 2}
            ],
            fieldMarketActiveIndex: 0,
            allMarketList: [],                    // 所有的赛事数据
            showMarketList: [],                   // 需要展示的赛事数据
            count: 10,                            // 需要展示的数量
            showMarketLen: 10,
            WinLen: 6,
            FlatLen: 1,
            loseLen: 3,
            WinRate: '60%',
            BeatRate: '65%',
            bigBallRate: "60%",
            teamId: '53',
            teamName: '',                          // 对名全称
            teamShortName: ''                      // 队名全称
        }
    },
    template,
    props: {
        index_1: {
            default: 0
        },
        vid: {
            default: ''
        }
    },
    created() {
        this.getDataList()
    },
    methods: {
        /**
         * 数据接口请求
         */
        getDataList() {
            let _field = this.index_1 === 0 ? '1' : '2';
            let _self = this;
            let vid = this.vid;
            getRecentRecord.getData({vid, field: _field}).then(rsp => {
                let rspData = rsp.data.list;
                if(rspData.length) {
                    rspData.forEach(RD => {
                        let _vsDateTime = Date.prototype.parseISO8601(RD.vsDate);
                        RD.vsDate = _vsDateTime.format('yy-MM-dd');
                        let flag = _self.marketLis.some((mar) => {
                            return mar.leagueName === RD.leagueName
                        });
                        if (!flag) {
                            _self.marketLis.push({
                                text: RD.leagueShortName,
                                leagueId: RD.leagueId,
                                leagueName: RD.leagueName,
                                checked: true
                            })
                        }
                    });
                    _self.allMarketList = _.sortBy(rspData, function (sortRD) {
                        return -sortRD.vsDate;
                    });
                    this.showMarketList = _self.allMarketList.slice(0, 10);
                    this.setResultData()
                } else {
                    this.$store.dispatch('setLeagueTrend');
                }
            }, err => {
                console.log(err);
                this.$store.dispatch('setLeagueTrend');
            })
        },
        /**
         * 场数选择事件
         * @param index
         */
        fieldHandle(index) {
            this.fieldActiveIndex = index;
            this.fieldTitleText = this.fieldTextLis[index].text;
            this.count = this.fieldTextLis[index].count;
            this.setResultData()
        },

        /**
         * 联赛选择事件
         * @param index
         */
        leagueSelectHandle(index) {
            this.marketLis[index].checked = !this.marketLis[index].checked;
            this.setResultData()
        },
        /**
         * 主客场的筛选
         * @param index
         */
        fieldMarketHandle(index) {
            if (this.fieldMarketActiveIndex === index) return;
            this.fieldMarketActiveIndex = index;
            this.fieldMarketTitleText = this.marketTeams[index].text;
            this.setResultData()
        },
        /**
         * 计算赛事统计
         */
        setResultData() {
            let _defaultList = this.allMarketList;
            // 根据联赛筛选
            let selectLeague = this.marketLis.filter((ML) => {
                return ML.checked;
            });
            let selectMarket = _defaultList.filter((SM) => {
                return selectLeague.some((SL) => {
                    return SL.leagueName === SM.leagueName;
                })
            });
            // 根据主客场筛选
            if (this.fieldMarketActiveIndex === 1) {
                selectMarket = selectMarket.filter(fieldM => {
                    return fieldM.homeTid === this.teamId;
                })
            } else if (this.fieldMarketActiveIndex === 2) {
                selectMarket = selectMarket.filter(fieldM => {
                    return fieldM.awayTid === this.teamId;
                })
            }
            let showMarketList = selectMarket.slice(0, this.count);
            // 计算赛果
            this.showMarketLen = showMarketList.length;
            this.WinLen = showMarketList.filter(SM => {
                return SM.result.wdw === "3"
            }).length;
            this.FlatLen = showMarketList.filter(SM => {
                return SM.result.wdw === "1"
            }).length;
            this.loseLen = showMarketList.filter(SM => {
                return SM.result.wdw === "0"
            }).length;
            let beatLen = showMarketList.filter(SM => {
                return SM.result.hwdw === "3"
            }).length;
            let BigBallLen = showMarketList.filter(SM => {
                return SM.result.ou === "3"
            }).length;
            this.WinRate = parseInt((this.WinLen / this.showMarketLen) * 100) + '%';
            this.BeatRate = parseInt((beatLen / this.showMarketLen) * 100) + '%';
            this.bigBallRate = parseInt((BigBallLen / this.showMarketLen) * 100) + '%';
            this.showMarketList = showMarketList;
        }
    },
    updated() {
        this.eventInfo = this.$store.state["eventInfo"];
        let teamType = this.index_1 === 0 ? 'home' : 'away';
        this.teamName = this.eventInfo[teamType + 'Name'];
        this.teamShortName = this.eventInfo[teamType + 'ShortName'];
        this.teamId = this.index_1 === 0 ? this.eventInfo.homeTid: this.eventInfo.awayTid;
    }
});