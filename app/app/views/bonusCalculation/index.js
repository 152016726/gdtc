/**
 * Created by mac-ddt on 2018/9/4.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Alert,
    Platform
} from 'react-native';

import {connectReducerComponent} from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../constants/storeKeys';
import {FONT_12, FONT_16} from '../../constants/fontSize';
import MarketList from './marketList';
import {BgColorWhite, DateBarColor, BorderColor, contentText} from '../../constants/color';
import BetslipBottom from '../../components/betslipBottom';
import BetslipComboList from "../../components/betslipComboList";
import dialogOption from '~/components/allPlays/dialogOption';
import games from "@easylotto/bet";
import Headerleft from "../../components/headerLeft";
import Emitter from '@easylotto/emitter';

class BonusCalculation extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "奖金计算",
            headerLeft: <Headerleft handleGoBack={() => navigation.goBack()} img={require('../../images/back.png')}/>
        }
    };

// 初始化数据
    constructor(props) {
        super(props);
        this.state = {
            renderDialog: false
        }
    }

    componentWillMount() {
        this.props.getLoginState();
        // 先重置串关方式选择
        this.props.clearBetslipBottom();
        // 再重新加载betslip
        this.props.marketListData();
        // 然后重新获取串关方式
        this.props.getMStickNList();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showDialog !== this.props.showDialog && nextProps.showDialog) {
            this.setState({
                renderDialog: true
            });
        }
    }

    componentDidUpdate() {
        // 需要触发窗口操作
        if (this.state.renderDialog) {
            this.setState({
                renderDialog: false
            }, () => {
                this.setDialogState();
            });
        }
        return true;
    }

    setDialogState() {
        const {event} = this.props;
        let ops = dialogOption.getDialogOption(event, '', this.callbackAfterAdd.bind(this, event.vid), false, ()=>{
            this.props.hideDialog();
        });
        this.props.toggleCommonDialog(ops);
    }

    //更新投注揽回调函数
    callbackAfterAdd(vid, currentKeys) {
        let betslipList = games.Betslip.getBetslip();
        games.Rule.setRule(games.Rule.JING_CAI_SOCCER_RULE);
        let reason = games.Rule.checkBetslip();
        if(reason.isPass){
            this.props.hideDialog();
            this.props.marketListData();
            //更新投注揽信息
            this.props.updateBetArea({
                eventCount: betslipList.length
            });
            Emitter.global.emit('event_update_' + vid, currentKeys);
        }else{
            Alert.alert('温馨提示', reason.reason[0]);
            return false;
        }
    }

    renderEndTime() {
        const {minDateStr} = this.props;
        return (
            <View style={styles.endTime}>
                <Text style={styles.endTimeText}>截止投注时间</Text>
                <Text style={styles.endTimeNum}>{minDateStr}</Text>
            </View>
        )
    }

    /**
     * 添加赛事按钮
     */
    addMarketHandle() {
        this.props.navigation.pop();
    }

    renderBtnBox() {
        const {clearMarketList} = this.props;
        return (
            <View style={styles.btnBox}>
                <TouchableOpacity
                    style={[styles.BtnS, styles.addBtn]}
                    onPress={() => this.addMarketHandle()}>
                    <Image source={require('./images/iconAdd.png')}
                           style={styles.btnImageBg}/>
                    <Text style={styles.BtnT}>
                        添加赛事
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.BtnS}
                    onPress={() => clearMarketList()}>
                    <Image source={require('./images/clearIcon.png')}
                           style={styles.btnImageBg}/>
                    <Text style={styles.BtnT}>
                        清空重选
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    handleGotoOptimize() {
        const {navigation, comboList} = this.props;
        navigation.navigate('BonusOptimize', {comboList})
    }

    render() {
        let {
            navigation, marketLists, isShowMore, delMarket, setDanHandle, selectMarket, handleChangeShow,
            selectComboArr, selectFreeArr, updateSelectComboArr, free, combo, multiple, maxBonus, minBonus,
            pay, amount, saveProject, isLogin
        } = this.props;
        return (
            <View style={styles.bodyS}>
                <View>
                    {marketLists.length > 0 && this.renderEndTime()}
                    <View style={styles.contentBox}>
                        {this.renderBtnBox()}
                        <MarketList
                            marketLists={marketLists}
                            delMarket={delMarket}
                            setDanHandle={setDanHandle}
                            selectMarket={selectMarket}/>
                    </View>
                </View>
                <View style={styles.bottomContent}>
                    <BetslipComboList
                        isShowMore={isShowMore}
                        handleChangeShow={handleChangeShow}
                        selectComboArr={selectComboArr}
                        selectFreeArr={selectFreeArr}
                        updateSelectComboArr={updateSelectComboArr}
                        free={free}
                        combo={combo}
                        handleGotoOptimize={this.handleGotoOptimize.bind(this)}
                    />
                    <BetslipBottom
                        multiple={multiple}
                        minBonus={minBonus}
                        maxBonus={maxBonus}
                        pay={pay}
                        amount={amount}
                        navigation={navigation}
                        saveProject={saveProject}
                        isLogin={isLogin}
                    />
                </View>
                {Platform.OS === 'ios' && isShowMore &&
                <TouchableOpacity activeOpacity={1} style={styles.mask} onPress={handleChangeShow}/>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bodyS: {
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: DateBarColor,
        justifyContent: 'space-between'
    },
    endTime: {
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#dbdbdb'
    },
    endTimeText: {
        fontSize: FONT_12,
        color: '#777777',
        marginRight: 3
    },
    endTimeNum: {
        fontSize: FONT_12,
        lineHeight: 13,
        color: '#ff0000'
    },
    contentBox: {
        padding: 12
    },
    BtnT: {
        marginLeft: 10,
        fontSize: FONT_16,
        color: contentText
    },
    btnBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 10
    },
    btnImageBg: {
        width: 16,
        height: 16
    },
    addBtn: {
        marginRight: 10
    },
    BtnS: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: BorderColor,
        backgroundColor: BgColorWhite
    },
    bottomContent: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'auto',
        minHeight: 89,
        ...Platform.select({
            ios: {
                zIndex: 1000
            },
            android: {}
        })
    },
    mask: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,.25)',
        ...Platform.select({
            ios: {
                zIndex: 999
            },
            android: {}
        })

    }
});
export default connectReducerComponent(storeKey.CALCULATION_STORE, reducer, state, action)(BonusCalculation)