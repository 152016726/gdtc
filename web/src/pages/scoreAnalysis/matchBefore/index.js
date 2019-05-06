/**
 * 对赛往绩模块
 * Created by easyLottoMac on 2018/12/3.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import _ from 'lodash';
import '../component/subTitleView';
import '../component/teamName';
import '../component/resultBtn';
import '../component/selectCompent/singleSelection';
import '../component/selectCompent/multipleSelection';
import '../component/scoreDisplayView';
import getMatchPerformance from 'services/getMatchPerformance';

let _defaultList = [];      // 存储所有玩法赛事

module.exports = Vue.component('analysis-match-before-view', {
    data() {
        return {
            textStr: '对赛往绩',
            fieldTitleText: '10场',              // 场数选择
            marketTitleText: '赛事选择',          // 赛事选择
            fieldTextLis: [                      // 场数选择下拉内容
                {text: '10场', typeIndex: 0},
                {text: '20场', typeIndex: 1}
            ],
            marketLis: [],// 联赛选择下拉内容
            fieldActiveIndex: 0,                  // 场数选中的下标索引
            marketActive: 0,                      // 赛事选中选中索引
            eventMatchList: [],                   // 赛事列表
            count: 10,                            // 请求的数据
            isSameField: false                    // 是否请求主客相同数据
        }
    },
    props: {
        vid: {
            default: ''
        }
    },
    template,
    created() {
        this.getMatchData();
    },
    methods: {
        /**
         * 数据请求
         */
        getMatchData() {
            let _self = this;
            let vid = this.vid;
            getMatchPerformance.getData({vid}).then(rsp => {
                let rspData = rsp.data.list;
                if (rspData.length) {
                    rspData.forEach((item) => {
                        let flag = _self.marketLis.some((mar) => {
                            return mar.leagueId === item.leagueId
                        });
                        if (!flag) {
                            _self.marketLis.push({
                                text: item.leagueShortName,
                                leagueId: item.leagueId,
                                leagueName: item.leagueName,
                                checked: true
                            })
                        }
                    });
                    _defaultList = _.sortBy(rspData, function (RP) {
                        return -RP.vsDate
                    });
                    this.eventMatchList = _defaultList.slice(0, 10);
                } else {
                    this.$store.dispatch('setMatchBefore');
                }
            }, req => {
                this.$store.dispatch('setMatchBefore');
            });
        },
        /**
         * 场数选择事件
         * @param index
         */
        fieldHandle(index) {
            this.fieldActiveIndex = index;
            this.fieldTitleText = this.fieldTextLis[index].text;
            this.count = index === 0 ? 10 : 20;
            this.eventMatchList = _defaultList.slice(0, this.count);
        },

        /**
         * 联赛选择事件
         * @param index
         */
        leagueSelectHandle(index) {
            this.marketLis[index].checked = !this.marketLis[index].checked;
            let selectMarket = this.marketLis.filter((ML) => {
                return ML.checked;
            });
            let eventMatchList = _defaultList.filter((EV) => {
                return selectMarket.some((SE) => {
                    return SE.leagueId === EV.leagueId
                })
            });
            this.eventMatchList = eventMatchList.slice(0, this.count);
        }
    }
});