/**
 * Created by oWEn on 2018/8/31.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import * as colorConf from '~/constants/color'
import AllPlaysItem from '../playItem';
import MarketSort from '~/constants/MarketSort'
import toastTip from '~/modules/toastTip';
import ActionProgressDialog from '~/components/actionProgressDialog';

export default class AllPlays extends Component {
    static defaultProps = {
        data: [], //所有列表数据
        handlePressItem: null
    };

    componentDidMount() {
        toastTip.initInner(this.progressDialog);
    }

    componentWillUnmount() {
        toastTip.clearInner();
    }

    render() {
        let {data, handlePressItem} = this.props;
        let showTip = false;
        if (data.markets) {
            let markets = data.markets;
            let vid = data.vid;
            let {
                wdw = [],
                hwdw = [],
                cs = [],
                tg = [],
                hft = []
            } = markets;

            if(data.dgStatus === '1'){
                showTip = true;
                wdw.isSingle = true;
            }
            return <View style={styles.item}>
                {showTip && <View style={styles.tips}>
                    <Text style={styles.tipsText}>红框区域可投单关</Text>
                </View>}
                <AllPlaysItem data={wdw} vid={vid} type={`${MarketSort.WIN_DRAW_WIN}`}
                              handlePressItem={handlePressItem}/>
                <View style={styles.item}>
                    <AllPlaysItem style={styles.item} vid={vid} data={hwdw} type={`${MarketSort.HANDICAP_WIN_DRAW_WIN}`}
                                  handlePressItem={handlePressItem}/>
                </View>
                <View style={styles.item}>
                    <AllPlaysItem style={styles.item} vid={vid} data={cs} type={`${MarketSort.CORRECT_SCORES}`}
                                  handlePressItem={handlePressItem}/>
                </View>
                <View style={styles.item}>
                    <AllPlaysItem style={styles.item} vid={vid} data={tg} type={`${MarketSort.TOTAL_GOALS}`}
                                  handlePressItem={handlePressItem}/>
                </View>
                <View style={styles.item}>
                    <AllPlaysItem style={styles.item} vid={vid} data={hft} type={`${MarketSort.HALF_FULL_TIME}`}
                                  handlePressItem={handlePressItem}/>
                </View>

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
    item: {
        marginBottom: 10
    },
    tipsText: {
        fontSize: 10,
        color: colorConf.MainColor
    }
})