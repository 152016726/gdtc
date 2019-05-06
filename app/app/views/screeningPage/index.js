/**
 * Created by easyLottoMac_Feng on 2018/12/12.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView
} from 'react-native';
import {connectReducerComponent} from '~/reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from "~/constants/storeKeys";
import HeaderLeft from "~/components/headerLeft";
import MarketSelect from '~/components/marketSelect';
import OddInputBtn from '~/components/oddInputBtn';
import {BorderColor, contentText, tipsTextGrey, MainColor} from "~/constants/color";
import {FONT_12, FONT_14, FONT_16} from "~/constants/fontSize";
import {TIPS, ODDS_NUM_TIPS} from '../../constants/Tips'

const REG_NUM = /^\d{1,9}(\.\d{2})$/;             // 匹配只允许输入有两位小数的赔率正则
let _selectBtns = [];                             // 记录进入页面时的选中联赛
let _homeWinValue = '0.00';                       // 记录进入页面时的主胜赔率
let _dropValue = '0.00';                          // 记录进入页面时的平局赔率
let _awayValue = '0.00';                          // 记录进入页面时的客胜赔率

class ScreeningPage extends Component {
    static navigationOptions = ({navigation}) => {
        const {enterHandle = null, handleGoBack = null} = navigation.state.params || {};
        let headerRight = <View>
            <TouchableOpacity
                style={{marginRight: 12}}
                onPress={enterHandle}>
                <Text style={{color: '#ffffff', fontSize: FONT_16}}>确定</Text>
            </TouchableOpacity>
        </View>;
        return {
            headerLeft: <HeaderLeft handleGoBack={handleGoBack}
                                    img={require('../../images/back.png')}/>,
            headerRight,
            title: '条件筛选'
        }
    };

    componentWillMount() {
        const {navigation, allBtns, selectBtns, homeWinValue, dropValue, awayValue} = this.props;
        // 记录进入页面是的数据
        _selectBtns = selectBtns.slice(0);
        _homeWinValue = homeWinValue;
        _dropValue = dropValue;
        _awayValue = awayValue;
        navigation.setParams({
            enterHandle: () => this.topEnterHandle(),
            handleGoBack: () => this.handleGoBack()
        });
    }

    /**
     * 返回键
     */
    handleGoBack() {
        const {navigation} = this.props;
        // 重置数据
        this.props.updateDate({
            selectBtns: _selectBtns,
            homeWinValue: _homeWinValue,
            dropValue: _dropValue,
            awayValue: _awayValue
        });
        navigation.goBack();
    }

    /**
     * 头部确定按钮
     */
    topEnterHandle() {
        const {homeWinValue, dropValue, awayValue, navigation, selectMarketHandle} = this.props;
        if (
            homeWinValue && !REG_NUM.test(homeWinValue) ||
            dropValue && !REG_NUM.test(dropValue) ||
            awayValue && !REG_NUM.test(awayValue)
        ) {
            Alert.alert(TIPS, ODDS_NUM_TIPS, [{text: '确定'}]);
            return;
        }
        selectMarketHandle();
        navigation.goBack();
    }

    /**
     *  全选按钮
     */
    allSelectHandle() {
        let {allBtns} = this.props;
        this.props.updateDate({
            selectBtns: allBtns.slice(0),
            isAllSelect: true
        });
    }

    /**
     *  反选按钮
     */
    reverseElectionHandle() {
        let {allBtns, selectBtns} = this.props;
        let newSelectBtns = allBtns.filter((btn) => {
            return selectBtns.indexOf(btn) === -1;
        });
        this.props.updateDate({
            selectBtns: newSelectBtns,
            isAllSelect: false
        })
    }

    /**
     * 赔率输入框失焦时触发
     * @param value 改变的值
     * @param index 改变的输入框索引
     * @private
     */
    _onChangeCallback(value, index) {
        let obj = {};
        switch (index) {
            case 0:
                obj = {homeWinValue: value};
                break;
            case 1:
                obj = {dropValue: value};
                break;
            case 2:
                obj = {awayValue: value};
                break;
        }
        this.props.updateDate(obj);
    }

    /**
     * 渲染赔率输入框模块
     * @returns {*}
     */
    renderOddsSelect() {
        const {homeWinValue, dropValue, awayValue} = this.props;
        let oddsArr = ['主胜', '平局', '客胜'];
        return (
            <View>
                <View style={styles.oddsTitle}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.titleTextSty}>指数选择</Text>
                        <Text style={styles.tipsTextSty}> (指数输入需保留小数点后两位，例1.10)</Text>
                    </View>
                </View>
                <View style={styles.oddsSelectViewSty}>
                    {
                        oddsArr.map((odd, index) => {
                            let _value = '';
                            switch (index) {
                                case 0:
                                    _value = homeWinValue;
                                    break;
                                case 1:
                                    _value = dropValue;
                                    break;
                                case 2:
                                    _value = awayValue;
                                    break;
                            }
                            return (
                                <View style={[styles.oddsBox, index === 1 && {marginHorizontal: 12}]}
                                      key={index}>
                                    <Text style={styles.oddsTextSty}>{odd}</Text>
                                    <OddInputBtn
                                        defaultValue={_value}
                                        onChangeCallback={(value) => this._onChangeCallback(value, index)}
                                    />
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    /**
     * 按钮点击事件
     */
    selectBtnHandle(btn) {
        let {selectBtns} = this.props;
        let _index = selectBtns.indexOf(btn);
        if (_index !== -1 && selectBtns.length > 0) {
            selectBtns.splice(_index, 1)
        } else {
            selectBtns.push(btn)
        }
        this.props.updateDate({
            selectBtns: selectBtns.slice(0)
        })
    }

    render() {
        const {allBtns, selectBtns, isAllSelect} = this.props;
        return (
            <ScrollView
                style={{flex: 1, backgroundColor: '#F5F5F5'}}
                alwaysBounceVertical={false}>
                {this.renderOddsSelect()}
                <MarketSelect
                    title='赛事选择'
                    subTitle='所选日期范围内发生的赛事'
                    allBtns={allBtns}
                    selectBtns={selectBtns}
                    isAllSelect={isAllSelect}
                    allSelectHandle={() => this.allSelectHandle()}
                    reverseElectionHandle={() => this.reverseElectionHandle()}
                    selectBtnHandle={(btn) => this.selectBtnHandle(btn)}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    oddsTitle: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        borderColor: BorderColor,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    titleTextSty: {
        fontSize: FONT_14,
        color: contentText
    },
    oddsSelectViewSty: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 15
    },
    oddsBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    oddTextSty: {
        fontSize: FONT_16,
        color: contentText
    },
    inputSty: {
        height: 40,
        borderColor: BorderColor,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        borderWidth: 1,
        textAlign: 'center',
        marginTop: 8
    },
    activeInput: {
        borderColor: MainColor
    },
    tipsTextSty: {
        fontSize: FONT_12,
        color: tipsTextGrey,
        paddingVertical: 1
    }
});

export default connectReducerComponent(storeKey.SCREENINGPAGE_STORE, reducer, state, action)(ScreeningPage);