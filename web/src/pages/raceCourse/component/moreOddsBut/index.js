/**
 * Created by easyLottoMac on 2018/10/12.
 */

import './index.scss';
import template from './index.template';
import Vue from 'vue';
import {
    odds_CS_W,
    odds_CS_D,
    odds_CS_L,
    odds_TG,
    odds_HFT
} from '../../../../constants/getOddsArr';
import {
    CORRECT_SCORES,
    TOTAL_GOALS,
    HALF_FULL_TIME
} from 'constants/MarketSort';
import '../../component/betOutCome';

let moreOddsBut = Vue.component('more-odds-but', {
    data() {
        return {
            allOddArr: [
                //总进球更多赔率数据
                {
                    marketSort: TOTAL_GOALS,
                    oddsArr: odds_TG,
                    title: '总进球'
                },
                //比分更多赔率数据
                {
                    marketSort: CORRECT_SCORES,
                    oddsArr: [odds_CS_W[0], odds_CS_D[0], odds_CS_L[0]],
                    title: '比分'
                },
                //半全场更多赔率数据
                {
                    marketSort: HALF_FULL_TIME,
                    oddsArr: odds_HFT,
                    title: '半全场'
                }
            ],
            marketCSSort: CORRECT_SCORES, //比分 sort
            showOddArr: [] //展示的赛事选项
        }

    },
    props: {
        vid: {
            default: ''
        },
        marketSort: {
            default: ''
        },
        marketOdds: {
            default: () => {
                return {}
            }
        }
    },
    template: template,
    created() {
        this.setDate(this.marketSort);
    },
    methods: {
        /**
         * 筛选需要展示的赛事
         * @param marketSort  赛事 sort
         */
        setDate(marketSort) {
            let showArr = this.allOddArr;
            switch (marketSort) {
                case 'cs':
                    showArr = showArr.filter((arr, j) => {
                        return arr.marketSort === CORRECT_SCORES
                    });
                    break;
                case 'tg':
                    showArr = showArr.filter((arr, j) => {
                        return arr.marketSort === TOTAL_GOALS
                    });
                    break;
                case 'hft':
                    showArr = showArr.filter((arr, j) => {
                        return arr.marketSort === HALF_FULL_TIME
                    });
                    break;
            }
            this.showOddArr = showArr;
        }
    },
    watch: {
        // 如果 `marketSort` 发生改变，这个函数就会运行
        marketSort: function (newMarketSort) {
            this.setDate(newMarketSort);
        }
    },
});

module.exports = moreOddsBut;