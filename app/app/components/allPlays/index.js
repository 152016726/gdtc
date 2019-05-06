/**
 * Created by oWEn on 2018/8/31.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import * as colorConf from '../../constants/color'
import AllPlaysItem from '../playItem';
import MarketSort from '../../constants/MarketSort'
import toastTip from '../../modules/toastTip';
import ActionProgressDialog from '../../components/actionProgressDialog';

// 显示玩法及对应排序
const _arrMarketSort = [
    MarketSort.WIN_DRAW_WIN,
    MarketSort.HANDICAP_WIN_DRAW_WIN,
    MarketSort.CORRECT_SCORES,
    MarketSort.TOTAL_GOALS,
    MarketSort.HALF_FULL_TIME
];

export default class AllPlays extends Component {
    static defaultProps = {
        data: [],   // 所有列表数据
        sort: '',   // 指定显示对应玩法
        handlePressItem: null,
        ctrlSingleShow: false //是否增加控制单关显示逻辑
    };

    componentDidMount() {
        toastTip.initInner(this.progressDialog);
    }

    componentWillUnmount() {
        toastTip.clearInner();
    }

    render() {
        let {data, sort, handlePressItem, ctrlSingleShow} = this.props;
        let haveSingle = false;
        if (data.markets) {
            let markets = data.markets;
            let vid = data.vid;
            let arr = _arrMarketSort.filter((item) => {
                    if (
                        markets[item] && markets[item].dgStatus !== '1' &&
                        ctrlSingleShow &&
                        (
                            item === MarketSort.WIN_DRAW_WIN ||
                            item === MarketSort.HANDICAP_WIN_DRAW_WIN
                        )
                    ) {
                        return false;
                    }
                    else return ((sort === '' || item === sort) && !!markets[item]);
                }
            );
            // 是否存在单关判断
            haveSingle = arr.some(item => { //检查是否是单关，不是胜平负和让球胜平负默认是单关，尽管dgStatus没有传过来
                return (markets[item] && markets[item].dgStatus === '1') ||
                    item !== MarketSort.WIN_DRAW_WIN ||
                    item !== MarketSort.HANDICAP_WIN_DRAW_WIN;
            });
            return <View style={styles.item}>
                {
                    haveSingle &&
                    <View style={styles.tips}>
                        <Text style={styles.tipsText}>红框区域可投单关</Text>
                    </View>
                }
                {
                    arr.map((item, idx) => {
                        let noMarginBottom = item === MarketSort.WIN_DRAW_WIN && arr.indexOf(MarketSort.WIN_DRAW_WIN) !== -1 && arr.indexOf(MarketSort.HANDICAP_WIN_DRAW_WIN) !== -1;
                        return <View style={[styles.item, noMarginBottom ? styles.noMarginBottom : null]} key={'mkt_' + idx}>
                            <AllPlaysItem
                                style={styles.item}
                                vid={vid}
                                data={markets[item]}
                                type={item}
                                handlePressItem={handlePressItem}
                            />
                        </View>

                    })
                }
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}/>
            </View>
        }
        else {
            return null
        }
    }
}

const styles = StyleSheet.create({
    tips: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    tipsText: {
        fontSize: 10,
        color: colorConf.MainColor
    },
    item: {
        marginBottom: 10
    },
    noMarginBottom:{
        marginBottom: 0
    }
});