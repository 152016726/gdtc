/**
 * Created by easyLottoMac_Feng on 2019/2/25.
 */
import './index.scss';
import Vue from 'vue';
import template from './index.template';
import '../../component/recommendList';
import games from '@easylotto/bet';

const marketStr = {
    'mix': '胜平负2串1',
    "tg": '总进球',
    'dg': '单关'
};
const _MULTIPLE = 1;        // 倍数
const _BETMONEY = 100;      // 投注金额
//投注类型Map
const betTypeMap = {
    mix: '1',
    dg: '2',
    tg: '3'
};
//玩法串关Map
const comboMap = {
    mix: {
        m: 2,
        n: 1,
        p: [2]
    },
    dg: {
        m: 1,
        n: 1,
        p: [1]
    },
    tg: {
        m: 1,
        n: 1,
        p: [1]
    }
};

module.exports = Vue.component('send-recommend-view', {
    data() {
        return {
            textValue: '',                                      // 分析
            minBonus: '',                                       // 最低回报奖金
            maxBonus: '',                                       // 最高回报奖金
            eventText: marketStr[this.$store.state.sort],       // 玩法
            betsLip: this.$store.state.betslip                  // 选中投注项
        }
    },
    template,
    created() {
        let sort = this.$store.state.sort;
        let BonusObj = games.Bonus.getSingleMaxMinBonusQuckly(comboMap[sort], _BETMONEY / 2);
        this.maxBonus = BonusObj.maxBonus;
    },
    methods: {
        /**
         * 推送晒单事件
         */
        submitHandle() {
            let {textValue, betsLip, maxBonus, minBonus} = this;
            // 限制至少30的字数才能发推荐
            if (textValue.length < 30) return;
            let _sort = this.$store.state.sort;
            let betslips = [];
            betsLip.forEach((event) => {
                let outcomes = [];
                event.outcomes.forEach((oc) => {
                    let ishandicap = oc.data.handicap;
                    outcomes.push(
                        Object.assign({
                            odds: oc.odds,
                            marketKey: oc.marketKey,
                            outcomeKey: oc.outcomeKey
                        }, ishandicap ? {handicap: oc.data.handicap} : {})
                    )
                });
                betslips.push({
                    vid: event.matchInfo.vid,
                    outcomes: outcomes
                })
            });
            let reqData = {
                "type": betTypeMap[_sort],
                "gameType": "1",
                'source': 'web',
                "betslip": betslips,
                "multiple": _MULTIPLE,
                "money": _BETMONEY,
                "maxBonus": maxBonus,
                "minBonus": minBonus,
                "analysis": textValue
            };
        }
    }
});