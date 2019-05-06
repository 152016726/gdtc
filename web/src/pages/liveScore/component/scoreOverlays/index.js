import './style.scss';

import Vue from 'vue';
import template from './index.template';
import RedCard from './images/redCard.png';
import YellowCard from './images/yellowCard.png';
import YellowToRed from './images/yellowToRed.png';
import Penalty from './images/point.png';
import Goal from './images/goal.png';
import OwnGoal from './images/goalOwn.png';
import MissedPenalty from './images/MissedPenalty.png';
import getAgainstStatistic from 'services/getAgainstStatistic';
import getImportantVersusInfo from 'services/getImportantVersusInfo';

module.exports = Vue.component('scoreOverlays', {
    data() {
        return {
            actionData: [],                         // 比赛动态
            rates: {},                              // 概率
            LINEWIDTH: 300,                         // 线条宽
            imgObj:{                                // 组成图片对象
                RedCard,
                YellowCard,
                YellowToRed,
                Penalty,
                Goal,
                OwnGoal,
                MissedPenalty
            }
        }
    },
    template,
    props: {
        homeName:{default:''},
        awayName:{default:''},
        vid:{default:null},
        asianHandicap:{default:1},
        homeLeagueRank:{default:1},
        awayLeagueRank:{default:1}
    },
    methods: {},
    created() {
        const self = this;

        // 获取赛事技术指标
        getAgainstStatistic.getData({"vid": self.vid}).then(reqData => {
            self.rates = reqData.data;
        }, rsp => {
            console.log(rsp);
        });
        // 获取时间轴事件
        getImportantVersusInfo.getData({"vid": self.vid}).then(reqData => {
            let data = reqData.data.actions;
            // 将找到img对应的key并添加至item上。 如RedCard对应homeRedCard属性
            data.forEach(function (item) {
                for(let key in item){
                    for(let val in self.imgObj){
                        if(key.indexOf(val) !== -1){
                            item.img = self.imgObj[val];
                        }
                    }
                }
            });
            self.actionData = data;
        }, rsp => {
            console.log(rsp);
        });
    }
});
