/**
 * 联赛积分排名榜模块
 * Created by easyLottoMac on 2018/12/4.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../component/subTitleView';
import '../component/resultBtn';
import '../component/teamNameTitle';
import getPointRanking from 'services/getPointRanking';

module.exports = Vue.component('analysis-point-ranking', {
    data() {
        return {
            textStr: '联赛积分排名',
            eventInfo: {},
            pointRankingList: {},               // 赛事数据
            dataList: [                         // 渲染主客队信息
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
            allPointranking: [                  // 默认渲染配置
                {
                    titleText: '总',
                    dataList: [
                        'totalVersusCount',
                        'totalWin',
                        'totalDraw',
                        'totalDefeat',
                        'totalGoal',
                        'totalLose',
                        'totalGD',
                        'totalPoint',
                        'totalRank',
                        'totalProbability'
                    ]
                },
                {
                    titleText: '主',
                    dataList: [
                        'homeVersusCount',
                        'homeWin',
                        'homeDraw',
                        'homeDefeat',
                        'homeGoal',
                        'homeLose',
                        'homeGD',
                        'homePoint',
                        'homeRank',
                        'homeProbability'
                    ]
                },
                {
                    titleText: '客',
                    dataList: [
                        'awayVersusCount',
                        'awayWin',
                        'awayDraw',
                        'awayDefeat',
                        'awayGoal',
                        'awayLose',
                        'awayGD',
                        'awayPoint',
                        'awayRank',
                        'awayProbability'
                    ]
                },
                {
                    titleText: '近6',
                    dataList: [
                        'sixVersusCount',
                        'sixWin',
                        'sixDraw',
                        'sixDefeat',
                        'sixLose',
                        'sixLose',
                        'sixGD',
                        'sixPoint',
                        '',
                        'sixProbability'
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
        let vid = this.vid;
        let proArr = ["total", "home", "away", "six"];
        getPointRanking.getData({vid}).then(rsp => {
            let dataList = rsp.data;
            if(Object.getOwnPropertyNames(dataList.home).length) {
                for (let key in dataList) {
                    let DLKyey = dataList[key];
                    // 计算胜率
                    proArr.forEach((PA, index) => {
                        let count = index === 3 ? 6 : DLKyey.totalVersusCount;
                        DLKyey[PA + 'Probability'] = this.setProbability(DLKyey[PA + 'Win'], count);
                    });
                }
                this.pointRankingList = dataList;
            }else {
                this.$store.dispatch('setPointRanking');
            }
        }, req => {
            this.$store.dispatch('setPointRanking');
        });
    },
    methods: {
        /**
         * 计算胜率
         */
        setProbability(winNum, Count) {
            return ((winNum / Count) * 100).toFixed(1) + '%';
        }
    },
    updated() {
        this.eventInfo = this.$store.state["eventInfo"];
        this.dataList.forEach(DL => {
            DL.teamName = this.eventInfo[DL.title + 'Name'];
            DL.teamShortName = this.eventInfo[DL.title + 'ShortName'];
        });
        // console.log("hasPointRankingData....", this.hasPointRankingData);
    }
});