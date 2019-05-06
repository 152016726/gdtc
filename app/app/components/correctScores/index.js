/**
 * Created by Roger(ljx) on 2018/9/4.
 */
import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import CommonDialog from '../../components/commonDialog';
import AllPlaysItem from '../playItem';
import TeamHeader from '../../components/teamHeader';
import * as CommonColor from '../../constants/color';
import games from '@easylotto/bet';
import {connectComponentAction} from "../../reduxCfg";
import action from "../halfFullTime/action";
import * as storeKeys from "../../constants/storeKeys";

class CorrectScores extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: props.text || '点击展开比分选项',   // 已选择的比分选项
            status: true,                       // 是否已有选择的比分选项
            showDialog: false,                   // 是否显示弹窗
            selectedOcKeyArr: [],              //保存当前选择的outcomeKeys
            delOcKeyArr: []                    //保存需要删除的outcomeKeys
        };
    }

    componentWillMount() {
        this.setChoosePlays();
    }

    //展示弹窗
    _showDialog() {
        this.setState({
            showDialog: !this.state.showDialog
        })
    }

    //关闭弹窗
    _hideDialog() {
        this.setChoosePlays();
        this._showDialog();
    }

    //展示当前赛事已选择的比分
    setChoosePlays() {
        const {event} = this.props;
        let betsList = games.Betslip.getBetslip();
        let scoreTxt = '';
        betsList.map((ele) => {
            if (ele.matchInfo.vid === event.vid) {
                ele.outcomes.map((item) => {
                    if (item.marketKey === 'CS') {
                        scoreTxt = scoreTxt + ' ' + ' ' + item.oddsName;
                    }
                });
            }
        });
        //重置展示框状态和文字
        if (scoreTxt !== '') {
            this.setState({
                text: scoreTxt,
                status: false
            });
        } else {
            this.setState({
                text: '点击展开比分选项',
                status: true
            });
        }
    }
    /**
     * 点击确定关闭弹窗以及更新betslip信息
     */
    handleUpdateBetslipInfo() {
        const {selectedOcKeyArr, delOcKeyArr} = this.state;
        let betslipOcKeyArr = games.Betslip.getChooseOutcomes();
        let filterSelectedOcKeyArr = selectedOcKeyArr.filter((oc_key)=>{
            return betslipOcKeyArr.indexOf(oc_key) === -1
        });
        //删除数组的去重
        let delArr = Array.from(new Set(delOcKeyArr));
        //查找后台list中的投注项是否有这项可删除
        delArr = betslipOcKeyArr.filter((oc_key) => {
            return delArr.indexOf(oc_key) != -1
        });
        // console.log(delOcKeyArr,filterSelectedOcKeyArr);
        // console.log('selectedOcKeyArr: ' + selectedOcKeyArr, 'delOcKeyArr: ' + delOcKeyArr);
        new Promise((resolve, reject) => {
            if (delArr.length > 0) {
                games.Betslip.deleteFromBetslip(delArr, () => {
                    resolve()
                });
            } else {
                resolve()
            }
        }).then(() => {
            return new Promise((resolve2, reject2) => {
                if (filterSelectedOcKeyArr.length > 0) {
                    games.Betslip.setOutcomeToBetslip(filterSelectedOcKeyArr, () => {
                        resolve2()
                    })
                } else {
                    resolve2();
                }
            })
        }).then(() => {
            let betslipList = games.Betslip.getBetslip();
            this.callbackAfterAdd(betslipList);
            this._showDialog();
            this.setState({
                delOcKeyArr: []
            })
        });
    }
    //更新投注揽回调函数
    callbackAfterAdd(list) {
        // console.log(games.Betslip.getChooseOutcomes());
        this.props.updateBetSlipList({
            betslipList: list,
            eventCount: list.length,
            outcomeCount: games.Betslip.getChooseOutcomes().length,
            outcomeList: games.Betslip.getChooseOutcomes()
        });
        this.setChoosePlays();
    }
    //点击按钮方法
    handlePressItem(ocKey) {
        const {selectedOcKeyArr,delOcKeyArr} = this.state;
        let newOcKeyArr = selectedOcKeyArr;
        let newDelOcKeyArr = delOcKeyArr;
        let isExist = newOcKeyArr.indexOf(ocKey) !== -1;
        if (isExist) {
            newDelOcKeyArr.push(newOcKeyArr.filter((oc_key) => oc_key === ocKey)[0]);
            newOcKeyArr = newOcKeyArr.filter((oc_key) => oc_key !== ocKey)
        } else {
            newOcKeyArr.push(ocKey);
        }
        // console.log(newOcKeyArr,newDelOcKeyArr);
        this.setState({
            selectedOcKeyArr: newOcKeyArr,
            delOcKeyArr: newDelOcKeyArr
        })
    }
    render() {
        const {event} = this.props;
        const {text, status} = this.state;
        let markets = event.markets;
        let {
            CS = []
        } = markets;
        let conf = {
            title: {
                home: event.homeName,
                away: event.awayName
            },
            content: <AllPlaysItem vid={event.vid}
                                   data={CS}
                                   type='CS'
                                   handlePressItem={this.handlePressItem.bind(this)}/>,
            show: this.state.showDialog,
            buttons: [
                {text: '取消', onPress: () => this._hideDialog()},
                {text: '确定', onPress: () => this.handleUpdateBetslipInfo()}
            ]
        };

        return (
            <View style={styles.bg}>
                <TeamHeader
                    isCP={false}
                    homeShortName={event.homeShortName}
                    awayShortName={event.awayShortName}
                    homeRank={event.homeLeagueRank}
                    courtRank={event.awayLeagueRank}
                    cls={{height: 30}}
                />
                <TouchableOpacity onPress={this._showDialog.bind(this)}>
                    <View style={status ? styles.regular : styles.active}>
                        <Text style={[status ? styles.orangeRed : styles.white]} numberOfLines={1}>{text}</Text>
                    </View>
                    <CommonDialog {...conf} />
                </TouchableOpacity>
            </View>
        )
    }
}

export default connectComponentAction(action, storeKeys.CORRECT_SCORE)(CorrectScores);
const styles = StyleSheet.create({
    bg: {
        backgroundColor: CommonColor.BgColor,
        paddingBottom: 5
    },
    //比分栏目
    regular: {
        borderWidth: 1,
        borderColor: CommonColor.DarkerBorderColor,
        borderRadius: 4,
        height: 30,
        backgroundColor: CommonColor.BgColorWhite,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 5
    },
    orangeRed: {
        color: CommonColor.MainColor
    },
    white: {
        color: "#ffffff"
    },
    active: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: CommonColor.DarkerBorderColor,
        height: 30,
        backgroundColor: CommonColor.MainColor,
        alignItems: 'center',
        justifyContent: 'center'
    }
});