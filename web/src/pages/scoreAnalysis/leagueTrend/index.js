/**
 * 联赛盘路走势模块
 * Created by easyLottoMac on 2018/12/5.
 */

import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../component/subTitleView';
import '../component/teamName';
import '../component/resultBtn';
import getLeagueTrend from 'services/getLeagueTrend';

module.exports = Vue.component('analysis-league-trend', {
    data() {
        return {
            textStr: '联赛盘路走势',
            leagueTrendList: {},
            dataList: [                 // 渲染主客队信息
                {
                    title: 'home',
                    teamName: '',
                    teamShortName: ''
                },
                {
                    title: 'away',
                    teamName: '',
                    teamShortName: ''
                }
            ],
            listArr: [                  // 渲染内容列表
                {
                    titleText: '总',
                    dataList: [
                        'totalWin',
                        'totalDraw',
                        'totalDefeat',
                        'totalRate',
                        'totalOver',
                        'totalOverRate',
                        'totalUnder',
                        'totalUnderRate'
                    ]
                },
                {
                    titleText: '主场',
                    dataList: [
                        'homeWin',
                        'homeDraw',
                        'homeDefeat',
                        'homeRate',
                        'homeOver',
                        'homeOverRate',
                        'homeUnder',
                        'homeUnderRate'
                    ]
                },
                {
                    titleText: '客场',
                    dataList: [
                        'awayWin',
                        'awayDraw',
                        'awayDefeat',
                        'awayRate',
                        'awayOver',
                        'awayOverRate',
                        'awayUnder',
                        'awayUnderRate'
                    ]
                }
            ]
        }
    },
    props: {
        vid: {
            default: ''
        }
    },
    template,
    created() {
        let _seft = this;
        let vid = _seft.vid;
        let len;
        let rateArr = ['total', 'home', 'away'];
        getLeagueTrend.getData({vid}).then(rsp => {
            let rapData = rsp.data;
            if (Object.getOwnPropertyNames(rapData.home.hwdw).length) {
                for (let key in rapData) {
                    let RDkey = rapData[key];
                    // 计算概率
                    rateArr.forEach(RA => {
                        RDkey.hwdw[RA + 'Rate'] = _seft.setProbability(RDkey.hwdw[RA + 'Win'], RDkey.totalVersusCount);
                        RDkey.ou[RA + 'OverRate'] = _seft.setProbability(RDkey.ou[RA + 'Over'], RDkey.totalVersusCount);
                        RDkey.ou[RA + 'UnderRate'] = _seft.setProbability(RDkey.ou[RA + 'Under'], RDkey.totalVersusCount);
                    });
                    RDkey.hwdw.lastSix = RDkey.hwdw.lastSix.split(' ');
                    RDkey.ou.lastSix = RDkey.ou.lastSix.split(' ');
                    len = RDkey.hwdw.lastSix.filter(ls => {
                        return ls === '3';
                    }).length;
                    RDkey.hwdw.sixRate = _seft.setProbability(len, 6);
                }
                this.leagueTrendList = rapData;
            } else {
                this.$store.dispatch('setLeagueTrend');
            }
        }, req => {
            this.$store.dispatch('setLeagueTrend');
        })
    },
    methods: {
        /**
         * 计算胜率
         */
        setProbability(winNum = 0, Count = 0) {
            return ((winNum / Count) * 100).toFixed(1) + '%';
        }
    },
    updated() {
        this.eventInfo = this.$store.state["eventInfo"];
        this.dataList.forEach(DL => {
            DL.teamName = this.eventInfo[DL.title + 'Name'];
            DL.teamShortName = this.eventInfo[DL.title + 'ShortName'];
        });
    }
});