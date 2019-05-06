/**
 * Created by oWEn on 2018/8/31.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import BetButton from '../betButton';
import * as colorConf from '../../constants/color'
import AllPlaysItemButton from './button'
import games from '@easylotto/bet'
import oddDealCtrl from '../../constants/oddDealCtrl'
import OddsArr from './getOddsArr';
import MarketSort from '../../constants/MarketSort';

const _arrMarketSort = [
    MarketSort.WIN_DRAW_WIN,
    MarketSort.HANDICAP_WIN_DRAW_WIN
];

let {
    odds_WDW,
    odds_HWDW,
    odds_CS_W,
    odds_CS_D,
    odds_CS_L,
    odds_TG,
    odds_HFT
} = OddsArr;
let csw = `${MarketSort.CORRECT_SCORES}w`;
let csd = `${MarketSort.CORRECT_SCORES}d`;
let csl = `${MarketSort.CORRECT_SCORES}l`;
let cswdw = `${MarketSort.CORRECT_SCORES}wdw`;
let allTitle = oddDealCtrl.getObjBySort({props: 'title'});

export default class allPlaysItem extends Component {
    static defaultProps = {
        data: [], //列表数据
        handlePressItem: null
    };

    /**
     * 渲染标题
     */
    getLeftTitleText(type, plus) {
        let title = {
            [csw]: '胜',
            [csd]: '平',
            [csl]: '负',
            ...allTitle
        };
        let str = title[type];
        return (
            <View>
                {
                    str.split('').map((ele, index) => {
                        return <Text style={styles.leftTitleText} key={index}>{ele}</Text>
                    })
                }
                {
                    plus ? <Text style={styles.leftTitleText}>{plus}</Text> : null
                }
            </View>
        );
    }

    /**
     * 渲染每行
     */
    renderItemButtons(data, type) {
        let arr = this.initData(data, type);
        return arr.map((ele, index) => {
            return <View key={index} style={styles.item}>
                {
                    this.renderButton(ele)
                }
            </View>
        })
    }

    /**
     * 渲染单个按钮
     */
    renderButton(arr) {
        const {handlePressItem} = this.props;
        return arr.map((ele, index) => {
            let styleObj = {
                flex: ele.flex,
            };
            if (ele.isEmpty) {
                return <View key={index} style={[styleObj, styles.betButton]}>
                </View>
            }
            else return <BetButton key={index}
                                   cls={[styleObj, styles.betButton]}
                                   text={ele.title}
                                   rate={ele.odds}
                                   vid={ele.vid}
                                   sort={ele.sort}
                                   isSelected={ele.isSelected}
                                   outcomeName={ele.key}
                                   handlePressItem={handlePressItem}
                                   ContentElement={AllPlaysItemButton}/>
        })
    }

    initData(data, type) {
        let outcomeList = games.Betslip.getChooseOutcomes();
        let {vid} = this.props;
        let defaultConf = {
            title: '',             //显示的内容
            odds: '',             //显示的赔率
            sort: (type === csw || type === csd || type === csl) ? MarketSort.CORRECT_SCORES : type,           //玩法
            vid,                  //比赛的id
            key: '',              //玩法的哪一项（如主胜）
            flex: 1,              //flex布局
            isEmpty: false,       //是否只是占格子（没有内容）
            isSelected: false     //是否默认选中
        };
        let arr;
        let oddsArr = {
            [MarketSort.WIN_DRAW_WIN]: odds_WDW,
            [MarketSort.HANDICAP_WIN_DRAW_WIN]: odds_HWDW,
            [MarketSort.CORRECT_SCORES]: [
                ...odds_CS_W,
                ...odds_CS_D,
                ...odds_CS_L
            ],
            [csw]: [...odds_CS_W],
            [csd]: [...odds_CS_D],
            [csl]: [...odds_CS_L],
            [MarketSort.TOTAL_GOALS]: odds_TG,
            [MarketSort.HALF_FULL_TIME]: odds_HFT,
        };
        arr = oddsArr[type];
        arr = arr.map((ele) => {
            return ele.map((ele_c) => {
                let obj;
                obj = Object.assign({}, defaultConf, ele_c, {odds: data[ele_c.key]});
                obj.isSelected = outcomeList.indexOf(`${obj.vid}#${obj.sort}#${obj.key}`) !== -1;
                return obj;
            })
        });
        return arr;
    }

    renderItem(type) {
        let {data} = this.props;
        return <View style={[styles.row, styles[`row${type}`]]}>
            <View style={[styles.leftTitle, styles[`leftTitle${type}`]]}>
                <View>
                    {type === MarketSort.HANDICAP_WIN_DRAW_WIN ? this.getLeftTitleText(type, data.handicap) : this.getLeftTitleText(type)}
                </View>
            </View>
            <View
                style={[styles.buttonsWrapper, (data.dgStatus === '1' || _arrMarketSort.indexOf(type) === -1) ? styles.singleBorder : null]}>
                {
                    this.renderItemButtons(data, type)
                }
            </View>
        </View>
    }

    render() {
        let {type} = this.props;
        if (type === cswdw) { //进球数分胜平负的类型
            return <View>
                {this.renderItem(csw)}
                {this.renderItem(csd)}
                {this.renderItem(csl)}
            </View>;
        }
        else return this.renderItem(type); //其他类型
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    leftTitle: {
        width: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowCSW: {
        marginBottom: 10
    },
    rowCSD: {
        marginBottom: 10
    },
    rowCSL: {
        marginBottom: 10
    },
    [`leftTitle${MarketSort.WIN_DRAW_WIN}`]: {
        backgroundColor: colorConf.GrassGreen
    },
    [`leftTitle${MarketSort.HANDICAP_WIN_DRAW_WIN}`]: {
        backgroundColor: colorConf.LightGreenColor
    },
    [`leftTitle${MarketSort.CORRECT_SCORES}`]: {
        backgroundColor: colorConf.GreenColor
    },
    [`leftTitle${csw}`]: {
        backgroundColor: colorConf.DarkerRedColor
    },
    [`leftTitle${csd}`]: {
        backgroundColor: colorConf.BlueColor
    },
    [`leftTitle${csl}`]: {
        backgroundColor: colorConf.DarkerGreenColor
    },
    [`leftTitle${MarketSort.TOTAL_GOALS}`]: {
        backgroundColor: colorConf.BlueColor
    },
    [`leftTitle${MarketSort.HALF_FULL_TIME}`]: {
        backgroundColor: colorConf.YellowColor
    },
    leftTitleText: {
        fontSize: 10,
        color: '#ffffff',
        lineHeight: 10,
        textAlign: 'center'
    },
    buttonsWrapper: {
        flex: 1
    },
    singleBorder: {
        borderWidth: 1,
        borderColor: colorConf.SingleColor
    },
    item: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: colorConf.SpiltLineColor
    },
    betButton: {
        height: 35,
        borderWidth: 0
    }
})