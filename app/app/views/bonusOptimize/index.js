/**
 * Created by mac-ddt on 2018/9/4.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import {connectReducerComponent} from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../constants/storeKeys';
import * as commonColor from '../../constants/color';
import {FONT_S, FONT_N, FONT_M, FONT_11, FONT_12, FONT_14} from '../../constants/fontSize';
import BtnOptimize from './components/btnOptimize';
import NumberAddSubtract from '../../components/numberAddSubtract';
import CommonTable from '../../components/commonTable';
import BetslipBottom from '../../components/betslipBottom';

class BonusOptimize extends Component {
    // 初始化数据
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: "奖金优化",
        }
    };

    componentWillMount() {
        this.props.getLoginState();
        this.props.getAllBonus();
    }

    componentWillUnMount() {
        //返回或退出时清空输入值
        this.props.updateState({
            price: ''
        })
    }

    /**
     * 更新state中的值
     * @param type  对应需要更新state的属性
     * @param text  更新的值
     */
    handleStateTextChange(type, text) {
        this.props.updateState({
            [type]: text
        })
    }

    /**
     * 更新计划购买金额
     * @param text  更新的金额
     */
    handlePriceChange(text) {
        this.props.updateState({
            price: text,
            pay: 0,
            minBonus: 0,
            maxBonus: 0,
            optimizeType: -1,
            isDisableOne: true
        });
    }

    /**
     * 触发改变优化方式
     * @param type
     */
    handleChangeOptimize(type) {
        let {price, pay, multiple, data} = this.props;
        let singlePay = price === null ? pay / multiple : price;
        let alertStr = '';                 // 投注金额输入错误的的提示语；
        let maxPrice = 999999;
        if (singlePay < data.length * 2) {
            alertStr = '投注金额不能少于' + data.length * 2 + '元';
        } else if (singlePay > maxPrice) {
            alertStr = '投注金额最多为' + maxPrice + '元';
        } else if (singlePay % 2 !== 0) {
            alertStr = '投注金额只能输入偶数';
        }
        if (singlePay < data.length * 2 || singlePay > maxPrice || singlePay % 2 !== 0) {
            alert(alertStr);
        } else {
            this.props.changeOptimize(type, singlePay);
        }
    }

    /**
     * 更新倍数
     * @param text  更新的金额
     */
    handleChangeMultiple(text) {
        let regText = /^([0-9])+$/;
        if (regText.test(text)) {
            this.props.changeMultiple(text);
        }
    }

    /**
     * 更新对应串关的金额
     * @param key
     * @param text
     */
    handleOnePriceChange(key, text) {
        this.props.changeOnePrice(key, text);
    }

    /**
     * 改变扩展内容是否显示
     * @param rowID
     */
    handleExtendChange(rowID) {
        let arrExtendFlag = this.props.arrExtendFlag.splice(0);
        arrExtendFlag[+rowID] = !arrExtendFlag[+rowID];
        this.props.updateState({arrExtendFlag});
    }

    /**
     * 生成表格数据
     * @returns {*}
     */
    getStakeDataDom() {
        let self = this;
        let {arrExtendFlag, data, isDisableOne} = this.props;
        return data.map((stake, i) => {
            let ocData = stake.data;
            let isSingle;
            let isMoreGroups;
            stake.group = stake.group.slice(0, 3);
            if (stake.group === "1#1") {
                isSingle = true;
            } else {
                isSingle = false;
                isMoreGroups = stake.group.split("#")[0] - 2 > 0;
            }
            let strStakeType = isSingle ? '单关' : stake.group.replace('#', '串');
            let matchInfo1 = ocData[0].matchInfo;
            let outcome1 = ocData[0].outcome;
            let matchInfo2 = isSingle ? '' : ocData[1].matchInfo;
            let outcome2 = isSingle ? '' : ocData[1].outcome;
            return {
                row: [
                    {
                        render(rowData, rowID) {
                            return (
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: 'relative'
                                }}>
                                    <Text>{strStakeType}</Text>
                                    <View style={styles.touchStyle}>
                                        <TouchableOpacity style={styles.touchIconStyle}
                                                          onPress={self.handleExtendChange.bind(self, rowID)}>
                                            <Image
                                                style={{width: 24, height: 14}}
                                                source={rowData.isExtend ? require('../../images/cell_arrow_up.png') : require('../../images/cell_arrow_down.png')}
                                                resizeMode={'contain'}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>)
                        }
                    },
                    {
                        render(rowData, rowID) {

                            return <View style={{
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {outcome1 && <Text style={{
                                    fontSize: FONT_11,
                                    lineHeight: 22
                                }}>{`${matchInfo1.awayShortName}|${outcome1.oddsName}`}</Text>}
                                {isSingle ? null : (outcome2 && <Text style={{
                                    fontSize: FONT_11,
                                    lineHeight: 22
                                }}>{`${matchInfo2.awayShortName}|${outcome2.oddsName}`}{isMoreGroups ? '...' : null}</Text>)}
                            </View>
                        }
                    },
                    {
                        render() {
                            return <NumberAddSubtract
                                isDisabled={isDisableOne}
                                value={stake.amount + ""}
                                onChangeText={self.handleOnePriceChange.bind(self, stake.key)}
                            />
                        }
                    },
                    {text: `${stake.bonus}元`, cellStyle: {color: '#EB812A'}}
                ],
                isExtend: arrExtendFlag[i],     //展开子行标志
                extendRender(rowData, rowID) {
                    let childProps = {
                        header: [
                            {text: '场次', style: {flex: 1}},
                            {text: '主队', style: {flex: 1}},
                            {text: '客队', style: {flex: 1}},
                            {text: '投注内容', style: {flex: 1}}
                        ],
                        data: ocData.map((bet) => {
                            let match = bet.matchInfo;
                            let outcome = bet.outcome;
                            let hcapVal = outcome.data && outcome.data.handicap;

                            return [
                                {text: match.week + match.number},
                                {text: match.awayShortName},
                                {text: match.homeShortName},
                                {text: `${outcome.oddsName}${hcapVal ? '('+hcapVal+')' : ''} ${outcome.odds}`}
                            ]
                        }),
                        headerHeight: 24,
                        cellHeight: 24,
                        borderWidth: 1,
                        borderColor: '#D9D9D9'
                    };
                    return rowData.isExtend && <View style={{flex: 1, backgroundColor: '#EDEDED'}}>
                        <View style={{height: 30, justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: FONT_12}}>投注方案</Text>
                        </View>
                        <CommonTable {...childProps} />
                    </View>
                }
            }
        });
    }

    render() {
        let {price, multiple, minBonus, maxBonus, pay, optimizeType, data, navigation, isLogin} = this.props;
        let opsPlanTable = {
            header: [
                {text: '过关方式', width: '20%'},
                {text: '单注组合', width: '30%'},
                {text: '注数分布', width: '30%'},
                {text: '预测奖金', width: '20%'}
            ],
            data: this.getStakeDataDom(),
            headerHeight: 30,
            cellHeight: 52,
            backgroundColor: '#F5F6F7',
            borderWidth: 1,
            borderColor: '#d1d1d1',
            isExtensible: true,
            isFixHeader: true
        };
        let arrOptimizeOps = [
            {type: 0, text: '平均优化'},
            {type: 1, text: '搏热优化'},
            {type: 2, text: '搏冷优化'}
        ];

        if(parseFloat(minBonus) > parseFloat(maxBonus)){
            let m = minBonus;
            minBonus = maxBonus;
            maxBonus = m;
        }

        return (
            <View style={styles.container}>
                <View style={styles.stylePlan}>
                    <View style={styles.commonPadding}><Text style={styles.commonText}>计划购买</Text></View>
                    <View style={styles.commonPadding}>
                        <NumberAddSubtract
                            minValue={data.length * 2}
                            value={(price !== null ? price : pay / multiple) + ''}
                            isLarge={true}
                            step={2}
                            onChangeText={this.handlePriceChange.bind(this)}/>
                    </View>
                    <View style={styles.commonPadding}><Text style={styles.commonText}>元</Text></View>
                </View>
                <View style={styles.styleOptButtons}>
                    {
                        arrOptimizeOps.map((ops, i) => (
                            <BtnOptimize
                                key={i}
                                text={ops.text}
                                isActive={optimizeType === ops.type}
                                isLeft={i === 0}
                                isRight={i === arrOptimizeOps.length - 1}
                                onPress={this.handleChangeOptimize.bind(this, ops.type)}
                            />
                        ))
                    }
                </View>
                <CommonTable {...opsPlanTable}/>
                {/*<View style={styles.styleMulti}>*/}
                {/*<View style={styles.commonPadding}><Text style={styles.commonText}>投</Text></View>*/}
                {/*<View style={styles.commonPadding}>*/}
                {/*<TextInput*/}
                {/*underlineColorAndroid='transparent'*/}
                {/*style={styles.styleInput}*/}
                {/*keyboardType={"numeric"}*/}
                {/*value={multiple + ""}*/}
                {/*onChangeText={this.handleChangeMultiple.bind(this)}*/}
                {/*/>*/}
                {/*</View>*/}
                {/*<View style={styles.commonPadding}><Text style={styles.commonText}>倍</Text></View>*/}
                {/*</View>*/}
                <BetslipBottom
                    isAbsolute={false}
                    isJustShowPay={true}
                    minBonus={minBonus}
                    maxBonus={maxBonus}
                    pay={pay}
                    saveProject={this.props.saveProject}
                    navigation={navigation}
                    isLogin={isLogin}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    stylePlan: {
        backgroundColor: commonColor.BgColorWhite,
        height: 44,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: commonColor.BorderColor
    },
    commonText: {
        fontSize: FONT_14
    },
    commonPadding: {
        paddingLeft: 3,
        paddingRight: 3
    },
    styleOptButtons: {
        height: 56,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    styleMulti: {
        backgroundColor: commonColor.BgColorWhite,
        height: 40,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: '#B3B3B3',
        borderBottomWidth: 1,
        borderBottomColor: '#B3B3B3'
    },
    styleInput: {
        paddingVertical: 0,
        backgroundColor: commonColor.BgColorWhite,
        width: 60,
        height: 28,
        borderWidth: 1,
        borderColor: commonColor.DarkerBorderColor,
        borderRadius: 5,
        textAlign: "center",
        fontSize: FONT_14
    },
    // --ljx
    touchStyle: {
        width: 30,
        height: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: '64%',
        left: 0
    },
    touchIconStyle: {
        flex: 1,
        height: 16,
        justifyContent: "center",
        alignItems: "center"
    }
});
export default connectReducerComponent(storeKey.OPTIMIZE_STORE, reducer, state, action)(BonusOptimize)