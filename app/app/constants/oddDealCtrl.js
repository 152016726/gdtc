import _ from 'lodash';
import {
    WIN_DRAW_WIN,
    HANDICAP_WIN_DRAW_WIN,
    TOTAL_GOALS,
    CORRECT_SCORES,
    HALF_FULL_TIME
} from './MarketSort';

const allConstants = {
    WIN_DRAW_WIN: {
        sort: WIN_DRAW_WIN,
        title: '胜平负',
        fullTitle:'胜平负',
        odds: [
            {
                type: 'W',
                title: '主胜',
                shortTitle: '胜',
                key: 'homeOdds',
                trend: 'homeTrend'
            },
            {
                type: 'D',
                title: '平',
                shortTitle: '平',
                key: 'drawOdds',
                trend: 'drawTrend'
            },
            {
                type: 'L',
                title: '客胜',
                shortTitle: '负',
                key: 'awayOdds',
                trend: 'awayTrend'
            }
        ]
    },
    HANDICAP_WIN_DRAW_WIN: {
        sort: HANDICAP_WIN_DRAW_WIN,
        title: '让球',
        fullTitle:'让球胜平负',
        hcapKey: 'handicap',
        odds: [
            {
                type: 'W',
                title: '主胜',
                shortTitle: '胜',
                key: 'homeOdds',
                trend: 'homeTrend'
            },
            {
                type: 'D',
                title: '平',
                shortTitle: '平',
                key: 'drawOdds',
                trend: 'drawTrend'
            },
            {
                type: 'L',
                title: '客胜',
                shortTitle: '负',
                key: 'awayOdds',
                trend: 'awayTrend'
            }
        ]
    },
    CORRECT_SCORES: {
        sort: CORRECT_SCORES,
        title: '比分',
        fullTitle:'比分',
        odds: [
            //胜的部分
            {
                type: 'W',
                title: '1:0',
                key: 'h10',
                trend: 'h10Trend'
            },
            {
                type: 'W',
                title: '2:0',
                key: 'h20',
                trend: 'h20Trend'
            },
            {
                type: 'W',
                title: '2:1',
                key: 'h21',
                trend: 'h21Trend'
            },
            {
                type: 'W',
                title: '3:0',
                key: 'h30',
                trend: 'h30Trend'
            },
            {
                type: 'W',
                title: '3:1',
                key: 'h31',
                trend: 'h31Trend'
            },
            {
                type: 'W',
                title: '3:2',
                key: 'h32',
                trend: 'h32Trend'
            },
            {
                type: 'W',
                title: '4:0',
                key: 'h40',
                trend: 'h40Trend'
            },
            {
                type: 'W',
                title: '4:1',
                key: 'h41',
                trend: 'h41Trend'
            },
            {
                type: 'W',
                title: '4:2',
                key: 'h42',
                trend: 'h42Trend'
            },
            {
                type: 'W',
                title: '5:0',
                key: 'h50',
                trend: 'h50Trend'
            },
            {
                type: 'W',
                title: '5:1',
                key: 'h51',
                trend: 'h51Trend'
            },
            {
                type: 'W',
                title: '5:2',
                key: 'h52',
                trend: 'h52Trend'
            },
            {
                type: 'W',
                title: '胜其他',
                key: 'hother',
                trend: 'hotherTrend'
            },
            //平的部分
            {
                type: 'D',
                title: '0:0',
                key: 'd00',
                trend: 'd00Trend'
            },
            {
                type: 'D',
                title: '1:1',
                key: 'd11',
                trend: 'd11Trend'
            },
            {
                type: 'D',
                title: '2:2',
                key: 'd22',
                trend: 'd22Trend'
            },
            {
                type: 'D',
                title: '3:3',
                key: 'd33',
                trend: 'd33Trend'
            },
            {
                type: 'D',
                title: '平其他',
                key: 'tother',
                trend: 'totherTrend'
            },
            //负的部分
            {
                type: 'L',
                title: '0:1',
                key: 'a10',
                trend: 'a10Trend'
            },
            {
                type: 'L',
                title: '0:2',
                key: 'a20',
                trend: 'a20Trend'
            },
            {
                type: 'L',
                title: '1:2',
                key: 'a21',
                trend: 'a21Trend'
            },
            {
                type: 'L',
                title: '0:3',
                key: 'a30',
                trend: 'a30Trend'
            },
            {
                type: 'L',
                title: '1:3',
                key: 'a31',
                trend: 'a31Trend'
            },
            {
                type: 'L',
                title: '2:3',
                key: 'a32',
                trend: 'a32Trend'
            },
            {
                type: 'L',
                title: '0:4',
                key: 'a40',
                trend: 'a40Trend'
            },
            {
                type: 'L',
                title: '1:4',
                key: 'a41',
                trend: 'a41Trend'
            },
            {
                type: 'L',
                title: '2:4',
                key: 'a42',
                trend: 'a42Trend'
            },
            {
                type: 'L',
                title: '0:5',
                key: 'a50',
                trend: 'a50Trend'
            },
            {
                type: 'L',
                title: '1:5',
                key: 'a51',
                trend: 'a51Trend'
            },
            {
                type: 'L',
                title: '2:5',
                key: 'a52',
                trend: 'a52Trend'
            },
            {
                type: 'L',
                title: '负其他',
                key: 'aother',
                trend: 'aotherTrend'
            }
        ]
    },
    TOTAL_GOALS: {
        sort: TOTAL_GOALS,
        title: '总进球',
        fullTitle:'总进球',
        odds: [
            {
                type: '0',
                title: '0球',
                shortTitle: '0',
                key: 'goal0',
                trend: 'goal0Trend'
            },
            {
                type: '1',
                title: '1球',
                shortTitle: '1',
                key: 'goal1',
                trend: 'goal1Trend'
            },
            {
                type: '2',
                title: '2球',
                shortTitle: '2',
                key: 'goal2',
                trend: 'goal2Trend'
            },
            {
                type: '3',
                title: '3球',
                shortTitle: '3',
                key: 'goal3',
                trend: 'goal3Trend'
            },
            {
                type: '4',
                title: '4球',
                shortTitle: '4',
                key: 'goal4',
                trend: 'goal4Trend'
            },
            {
                type: '5',
                title: '5球',
                shortTitle: '5',
                key: 'goal5',
                trend: 'goal5Trend'
            },
            {
                type: '6',
                title: '6球',
                shortTitle: '6',
                key: 'goal6',
                trend: 'goal6Trend'
            },
            {
                type: '7',
                title: '7+球',
                shortTitle: '7+',
                key: 'goal7',
                trend: 'goal7Trend'
            }
        ]
    },
    HALF_FULL_TIME: {
        sort: HALF_FULL_TIME,
        title: '半全场',
        fullTitle:'半全场',
        odds: [
            {
                type: 'WW',
                title: '胜胜',
                key: 's33',
                trend: 's33Trend'
            },
            {
                type: 'WD',
                title: '胜平',
                key: 's31',
                trend: 's31Trend'
            },
            {
                type: 'WL',
                title: '胜负',
                key: 's30',
                trend: 's30Trend'
            },
            {
                type: 'DW',
                title: '平胜',
                key: 's13',
                trend: 's13Trend'
            },
            {
                type: 'DD',
                title: '平平',
                key: 's11',
                trend: 's11Trend'
            },
            {
                type: 'DL',
                title: '平负',
                key: 's10',
                trend: 's10Trend'
            },
            {
                type: 'LW',
                title: '负胜',
                key: 's03',
                trend: 's03Trend'
            },
            {
                type: 'LD',
                title: '负平',
                key: 's01',
                trend: 's01Trend'
            },
            {
                type: 'LL',
                title: '负负',
                key: 's00',
                trend: 's00Trend'
            },
        ]
    }
};
let innerFn = {
    /**
     * 获取对象的对应属性
     * @param obj {Object}对象
     * @param props {|String|Array}索取的属性
     */
    getProps(obj, props) {
        let _obj = {};
        if (props) {
            if (_.isString(props)) {
                _obj = obj[props];
            }
            else if (_.isArray(props)) {
                props.forEach((ele) => {
                    _obj[ele] = obj[ele];
                })
            }
        }
        else {
            _obj = obj;
        }
        return _obj;
    }
};

export default {
    getAllConstants: function () {
        return _.cloneDeep(allConstants)
    },
    /**
     * 获取所有赔率(odds)
     * @param key {String|Array} 索取玩法[key]的赔率
     * @return {Object||Array} 如返回
     */
    getOdds(sorts) {
        return this.getObjBySort({
            sorts,
            props: 'odds'
        })
    },

    /**
     * 根据sort获取相应的属性
     * @param conf {Object} 索取属性的配置
     */
    getObjBySort(conf) {
        let defaultConf = {
            sorts: undefined,  // 想要获取的对象的sort 默认索取全部 可以是字符串(获取单个对象)和数组(获取多个对象)
            props: undefined   // 想要获取的对象的属性 默认索取全部 可以是字符串(获取单个对象)和数组(获取多个对象)
        };
        let _allConstants = this.getAllConstants();
        conf = _.assign({}, defaultConf, conf);
        let {sorts, props} = conf;
        let obj = {};
        if (sorts) {
            if (_.isString(sorts)) {
                obj = innerFn.getProps(_.find(_allConstants, function (o) {
                    return o.sort === sorts;
                }), props);
            }
            else if (_.isArray(sorts)) {
                for (let i in _allConstants) {
                    if (sorts.indexOf(_allConstants[i].sort) !== -1) {
                        obj[_allConstants[i].sort] = innerFn.getProps(_allConstants[i], props);
                    }
                }
            }
        }
        else {
            for (let i in _allConstants) {
                obj[_allConstants[i].sort] = innerFn.getProps(_allConstants[i], props);
            }
        }
        return obj;
    }
};