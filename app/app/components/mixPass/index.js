/**
 * Created by Roger(ljx) on 2018/9/4.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import BetButton from '../betButton';
import MixInner from '../mixInner';
import AllPlays from '../../components/allPlays';
import TeamHeader from '../../components/teamHeader';
import * as CommonColor from '../../constants/color';
import oddDealCtrl from '../../constants/oddDealCtrl.js';
import * as CommonSort from '../../constants/MarketSort'
import games from '@easylotto/bet';
import {connectComponentAction} from "../../reduxCfg";
import action from "./action";
import * as storeKeys from "../../constants/storeKeys";
import _ from 'lodash';
import {ONE_MARKET_ONE_OUTCOME} from '../../constants/Tips';
import toastTip from '../../modules/toastTip';

let Opts = [];
oddDealCtrl.getOdds(CommonSort.WIN_DRAW_WIN).map(function (item) {
    Opts.push(item.title);
});

class MixPass extends Component {

    static defaultProps = {
        WDWOpts: Opts  //玩法对应的中文
    };

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedOcKeyArr: [],              //保存当前选择的outcomeKeys
            delOcKeyArr: []                    //保存需要删除的outcomeKeys
        };
    }

    /**
     *
     * @param index 索引
     * @param sort  玩法
     * @returns {{}}
     */
    initName(index, sort) {
        const {event} = this.props;
        let _props = {};
        let vid = event.vid;
        switch (index) {
            case 0 :
                _props.outcomeName = 'homeOdds';
                _props.rate = event.showMarkets[sort].homeOdds;
                _props.isSelected = this.getSelectStatus(vid, sort, 'homeOdds');
                break;
            case 1 :
                _props.outcomeName = 'drawOdds';
                _props.rate = event.showMarkets[sort].drawOdds;
                _props.isSelected = this.getSelectStatus(vid, sort, 'drawOdds');
                break;
            case 2:
                _props.outcomeName = 'awayOdds';
                _props.rate = event.showMarkets[sort].awayOdds;
                _props.isSelected = this.getSelectStatus(vid, sort, 'awayOdds');
                break;
            default:
                break;
        }
        return _props;
    }

    // 计算当前赛事已选择玩法的数目
    getChoosePlays() {
        const {event} = this.props;
        let {vid} = event;
        let outcomeList = games.Betslip.getChooseOutcomes();
        let objCount = _.countBy(outcomeList, item => item.substring(0, item.indexOf('#')));
        return objCount[vid] || 0;
    }

    /**
     *
     * @param vid  比赛的vid
     * @param sort 比赛的玩法如WDW,HWDW等等
     * @param outcomeName 每个玩法对应的赛果如WDW对应homeOdds,drawOdds等(胜负平),TG对应goals1,goals2等(进球数)
     * @returns {*|{example}|boolean} 返回当前玩法赛果是否为已选状态
     */
    getSelectStatus(vid, sort, outcomeName) {
        let outcomeList = games.Betslip.getChooseOutcomes();
        return outcomeList.indexOf(`${vid}#${sort}#${outcomeName}`) !== -1;
    }

    /**
     *
     * @param sort   比赛的玩法如WDW(胜负平),HWDW(让球胜负平)等等
     * @returns {Array} 返回玩法赛果对应需要渲染的btn
     */
    renderBetButton(sort) {
        const {outcomeCount, event, WDWOpts} = this.props;
        //渲染的btn的样式
        let cls = {
            height: 30,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: CommonColor.DarkerBorderColor
        };
        return (WDWOpts.map((val, index) => {
            let opts = this.initName(index, sort);
            return <BetButton
                key={index}
                sort={sort}
                vid={event.vid}
                text={val}
                cls={cls}
                name={val}
                num={index}
                outcomeCount={outcomeCount}
                ContentElement={MixInner}
                {...opts}
            />
        }))

    }

    setDialogState() {
        const {event} = this.props;
        //全部玩法需要传递的参数
        this.props.toggleCommonDialog({
            title: {
                home: event.homeName,
                away: event.awayName
            },
            content: <AllPlays vid={event.vid}
                               data={event}
                               handlePressItem={this.handlePressItem.bind(this)}/>,
            onCancel: () => {
                this.hideDialog();
            },
            onConfirm: () => {
                this.handleUpdateBetslipInfo();
            }
        });
    }

    //点击展开全部玩法
    _BtnForMore() {
        this.setDialogState();
    }

    /**
     * 点击隐藏全部玩法，同时需要清空所选的内容
     */
    hideDialog() {
        this.setState({
            selectedOcKeyArr: [],
            delOcKeyArr: []
        }, () => {
            this.props.hideCommonDialog();
        });
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

    /** 20181121
     *  此方法由于是设置投注项数组
     *  所以先不用
     *  主要因为添加业务限制
     *  一个赛事一个玩法
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



    render() {
        const {event, isSingle} = this.props;  //handicap应需求加的虚假字段控制是让-1还是+1的
        const {dgStatus} = event;
        let handicap = "";
        if(dgStatus === '0' && event.showMarkets[CommonSort.HANDICAP_WIN_DRAW_WIN]){
            handicap = event.showMarkets[CommonSort.HANDICAP_WIN_DRAW_WIN].handicap;
        }
        let payCount = this.getChoosePlays();

        return (
            <View style={styles.bg}>
                <View style={styles.info}>
                    <TeamHeader
                        homeShortName={event.homeShortName}
                        awayShortName={event.awayShortName}
                        homeRank={event.homeLeagueRank}
                        courtRank={event.awayLeagueRank}
                    />
                    <View style={styles.contentStyle}>
                        <View style={styles.num}>
                            <View style={[styles.WDWnumStyle, styles.common]}>
                                <Text style={styles.white}>非</Text>
                                <Text style={styles.white}>让</Text>
                                <Text style={styles.white}>球</Text>
                            </View>
                            {!!handicap && handicap - 1 >= 0 ? <View style={[styles.RangHWDWnumStyle, styles.common]}>
                                    <Text style={styles.white}>主</Text>
                                    <Text style={styles.white}>{handicap}</Text>
                                </View> :
                                <View style={[styles.HWDWnumStyle, styles.common]}>
                                    <Text style={styles.white}>{!!handicap ? '主' : ''}</Text>
                                    <Text style={styles.white}>{handicap}</Text>
                                </View>
                            }
                        </View>
                        <View style={[styles.team,styles.common]}>
                            <View style={[styles.flexRow,styles.WDWborder,styles.common]}>
                            {
                                !event.showMarkets[CommonSort.WIN_DRAW_WIN] ?
                                    <View style={[styles.WDWSingleStyle,styles.common]}>
                                        <Text style={styles.single}>
                                            该玩法未{isSingle ? '开单关':'开售'}
                                        </Text>
                                    </View> : this.renderBetButton(CommonSort.WIN_DRAW_WIN)
                            }
                            </View>
                            <View style={[styles.flexRow, styles.HWDWborder, styles.common]}>
                                {
                                    !handicap || !event.showMarkets[CommonSort.HANDICAP_WIN_DRAW_WIN] ?
                                        <View style={[styles.HWDWSingleStyle, styles.common]}>
                                            <Text style={styles.single}>
                                                该玩法未{isSingle ? '开单关':'开售'}
                                            </Text>
                                        </View> : this.renderBetButton(CommonSort.HANDICAP_WIN_DRAW_WIN)
                                }
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this._BtnForMore()}>
                    <View style={styles.blank}>
                        <View
                            style={[
                                styles.blankContent,
                                styles.openAllBorder,
                                styles.common,
                                payCount > 0 ? styles.selBg : null
                            ]}>
                            <View>
                                <Text style={styles.orangeRed}>
                                    {payCount > 0 ? '已选' : '展开'}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.orangeRed}>
                                    {payCount > 0 ? payCount + '项' : '全部'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )

    }

}

export default connectComponentAction(action, storeKeys.MIX_PASS)(MixPass);

const styles = StyleSheet.create({
    //总体盒子
    bg: {
        backgroundColor: CommonColor.BgColor,
        flexDirection: 'row',
        paddingBottom: -3
    },
    sm: {
        fontSize: 10
    },
    info: {
        flex: 86
    },
    blank: {
        flex: 14,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    //投注详情
    contentStyle: {
        height: 60,
        flexDirection: 'row',
        alignItems: "center"
    },
    num: {
        flex: 8,
        justifyContent: "center"
    },
    WDWnumStyle: {
        height: 30,
        backgroundColor: "#cad1c5"
    },
    HWDWnumStyle: {
        height: 30,
        backgroundColor: "#8ad948"
    },
    RangHWDWnumStyle: {
        height: 30,
        backgroundColor: "#e8696d"
    },
    //展开全部
    blankContent: {
        height: 60,
        padding: 4
    },
    openAllBorder: {
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: CommonColor.DarkerBorderColor
    },
    //单关样式
    single: {
        color: '#c2c2c2',
        fontSize: 14
    },
    WDWSingleStyle: {
        flex: 1,
        height: 30,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: CommonColor.DarkerBorderColor
    },
    HWDWSingleStyle: {
        flex: 1,
        height: 30,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: CommonColor.DarkerBorderColor
    },
    //通用样式
    white: {
        color: '#ffffff',
        fontSize: 9
    },
    selBg: {
        backgroundColor: '#e6e6b8'
    },
    orangeRed: {
        color: CommonColor.MainColor,
        fontSize: 12
    },
    grey: {
        color: CommonColor.teamRateGrey
    },
    team: {
        flex: 92
    },
    common: {
        justifyContent: "center",
        alignItems: "center"
    },
    flexRow: {
        flexDirection: 'row',
        height: 30
    },
    WDWborder: {
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: CommonColor.DarkerBorderColor
    },
    HWDWborder: {
        borderLeftWidth: 1,
        borderColor: CommonColor.DarkerBorderColor
    }

});