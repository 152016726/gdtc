/**
 * Created by Roger(ljx) on 2018/9/4.
 */
import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import AllPlaysItem from '../playItem';
import TeamHeader from '../../components/teamHeader';
import * as CommonColor from '../../constants/color';
import games from '@easylotto/bet';
import {connectComponentAction} from "../../reduxCfg";
import action from "./action";
import * as storeKeys from "../../constants/storeKeys";
import oddDealCtrl from '../../constants/oddDealCtrl';
import _ from "lodash";

class HalfFullTime extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: props.text || '点击展开半全场选项', // 已选择的半全场选项
            status: true,                       // 是否已有选择半全场
            selectedOcKeyArr: [],              //保存当前选择的outcomeKeys
            delOcKeyArr: []                    //保存需要删除的outcomeKeys
        }
    }

    componentWillMount() {

    }

    setDialogState() {
        const {event, sort} = this.props;
        let markets = event.markets;
        this.props.toggleCommonDialog({
            title: {
                home: event.homeName,
                away: event.awayName
            },
            content: <AllPlaysItem vid={event.vid}
                                   handlePressItem={this.handlePressItem.bind(this)}
                                   data={markets[sort]}
                                   type={sort}/>,
            onCancel: () => {       // 取消回调
                this.hideDialog();
            },
            onConfirm: () => {
                this.handleUpdateBetslipInfo();
            }
        });
    }

    //展示弹窗
    _showDialog() {
        this.setDialogState();
    }

    //关闭弹窗
    hideDialog() {
        this.setState({
            selectedOcKeyArr: [],
            delOcKeyArr: []
        }, () => {
            this.props.hideCommonDialog();
        });
    }

    /**
     * 点击确定关闭弹窗以及更新betslip信息
     */
    handleUpdateBetslipInfo() {
        const {selectedOcKeyArr, delOcKeyArr} = this.state;

        let fnAddPromise = () => {
            return new Promise((resolve, reject) => {
                if(selectedOcKeyArr.length > 0){
                    games.Betslip.setOutcomeToBetslip(selectedOcKeyArr, ()=>{
                        resolve();
                    });
                }else{
                    resolve();
                }
            });
        };

        let fnDelPromise = () => {
            return new Promise((resolve, reject) => {
                if(delOcKeyArr.length > 0){
                    games.Betslip.deleteFromBetslip(delOcKeyArr, ()=>{
                        resolve();
                    });
                }else{
                    resolve();
                }
            });
        };

        fnDelPromise().then(fnAddPromise).then(() => {
            let strKey = selectedOcKeyArr.map(item => ('+' + item)).join(',') + delOcKeyArr.map(item => ('-' + item)).join(',');
            this.callbackAfterAdd(strKey);
            this.hideDialog();
        });
    }

    //更新投注揽回调函数
    callbackAfterAdd(currentKeys) {
        let betslipList = games.Betslip.getBetslip();
        let outcomes = games.Betslip.getChooseOutcomes();
        this.props.updateBetSlipList({
            eventCount: betslipList.length,
            outcomeCount: outcomes.length,
            outcomeList: outcomes,
            currentKey: currentKeys
        });
    }

    //展示当前赛事已选择的
    getChoosePlays() {
        const {event,sort} = this.props;
        let {vid} = event;
        let outcomeList = games.Betslip.getChooseOutcomes();
        let objCount = _.groupBy(outcomeList, item => item.substring(0, item.lastIndexOf('#')));
        if(objCount[vid + '#' + sort]){
            let odds = oddDealCtrl.getOdds(sort);
            return objCount[vid + '#' + sort].map(item => {
                let key = item.substring(item.lastIndexOf('#') + 1, item.length);
                return _.find(odds, {key})['title'];
            }).join('  ');
        }else{
            return '';
        }
    }

    /**
     *  点击按钮方法
     *  此方法先不用
     *  添加业务限制
     *  一个赛事一个玩法
     *  @param isAdd     是否增加投注篮
     *  @param selectKey BetButton返回的vid#event#odd
     *  @return Boolean  返回是否选择该outcome按钮
     */
    handlePressItem(isAdd, selectKey) {
        let {selectedOcKeyArr, delOcKeyArr} = this.state;
        let outcomeList = games.Betslip.getChooseOutcomes();
        let idxAdd, idxDel, idxOc;

        idxAdd = selectedOcKeyArr.indexOf(selectKey);   // 存在于增加数组的下标
        idxDel = delOcKeyArr.indexOf(selectKey);        // 存在于删除数组的下标
        idxOc = outcomeList.indexOf(selectKey);         // 存在于投注篮中的下标

        // 避免修改原对象
        selectedOcKeyArr = selectedOcKeyArr.slice(0);
        delOcKeyArr = delOcKeyArr.slice(0);

        if(isAdd){
            // 已经存在增加数组中
            if(idxAdd !== -1){
                return true;
                // 需要增加的key若不在投注篮中才需要加入增加数组
            }else if(idxOc === -1){
                selectedOcKeyArr.push(selectKey);
            }
            // 需要增加的key存在在删除数组，需要去掉
            if(idxDel !== -1){
                delOcKeyArr.splice(idxDel, 1);
            }
        }else{
            // 已经存在删除数组中
            if(idxDel !== -1){
                return false;
                // 存在于投注篮中需要加入删除数组
            }else if(idxOc !== -1){
                delOcKeyArr.push(selectKey);
            }
            // 需要删除的key存在在增加数组，需要去掉
            if(idxAdd !== -1){
                selectedOcKeyArr.splice(idxAdd, 1);
            }
        }

        this.setState({
            selectedOcKeyArr, delOcKeyArr
        });
        return isAdd;
    }

    render() {
        const {event, text} = this.props;
        let scoreTxt = this.getChoosePlays();
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
                    <View style={scoreTxt !== '' ? styles.active : styles.regular}>
                        <Text style={scoreTxt !== '' ? styles.white : styles.orangeRed} numberOfLines={1}>{scoreTxt !== '' ? scoreTxt : text }</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default connectComponentAction(action, storeKeys.HALF_FULL_TIME)(HalfFullTime);

const styles = StyleSheet.create({
    bg: {
        backgroundColor: CommonColor.BgColor,
        paddingBottom: 5
    },
    //栏目
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
        color: '#fff'
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