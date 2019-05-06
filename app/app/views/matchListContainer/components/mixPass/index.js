/**
 * Created by Roger(ljx) on 2018/9/4.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import action from "./action";
import BetButton from '../betButton';
import MixInner from '../mixInner';
import TeamHeader from '../teamHeader';
import * as CommonColor from '~/constants/color';
import * as CommonSort from '~/constants/MarketSort'
import {connectComponentAction} from "~/reduxCfg";
import * as storeKeys from "~/constants/storeKeys";
import dialogOption from '~/components/allPlays/dialogOption';
import matchDataCenter from '#/matchDataCenter';
import games from '@easylotto/bet';
import _ from 'lodash';
import Emitter from '@easylotto/emitter';

class MixPass extends Component {
    static defaultProps = {
        vid: '',             // 比赛vid
        sort: '',            // 显示的sort分类，可能是 min 混合过关，dg 单固
        currentKey: '',      // 当前改变的outcome的key
        isFromExpert: false  //是否来自专家
    };

    model = {};

    componentWillMount() {
        this.initModel();
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.vid !== this.props.vid) {
            this.initModel(nextProps);
        }
    }

    initModel(props) {
        let {vid} = (props || this.props);
        this.model.event = matchDataCenter.getEventObject(vid);
        this.model.WDW_mkt = matchDataCenter.getMarketObject(vid, CommonSort.WIN_DRAW_WIN);
        this.model.HWDW_mkt = matchDataCenter.getMarketObject(vid, CommonSort.HANDICAP_WIN_DRAW_WIN);
    }

    /**
     *
     * @param sort   比赛的玩法如WDW(胜负平),HWDW(让球胜负平)等等
     * @returns {*} 返回玩法赛果对应需要渲染的btn
     */
    renderBetButton(sort) {
        const {currentKey, isFromExpert} = this.props;
        const {event, WDW_mkt, HWDW_mkt} = this.model;
        //渲染的btn的样式
        let cls = {
            height: 30,
            borderRightWidth: 1,
            borderColor: CommonColor.DarkerBorderColor
        };
        let mkt;
        if (sort === CommonSort.WIN_DRAW_WIN) {
            mkt = WDW_mkt;
        } else if (sort === CommonSort.HANDICAP_WIN_DRAW_WIN) {
            mkt = HWDW_mkt;
        }
        if (mkt) {
            let len = mkt.outcomes.length;
            return mkt.outcomes.map((oc, index) => <BetButton
                vid={event.vid}
                sort={sort}
                key={`${event.vid}#${sort}#${oc.key}`}
                betKey={`${event.vid}#${sort}#${oc.key}`}
                text={oc.title}
                rate={oc.rate}
                cls={cls}
                isLast={index === len - 1}
                currentKey={currentKey}
                ContentElement={MixInner}
                isFromExpert={isFromExpert}
            />);
        } else {
            return <View> </View>;
        }
    }

    // 计算当前赛事已选择玩法的数目
    getChoosePlays() {
        let {vid} = this.props;
        let outcomeList = games.Betslip.getChooseOutcomes();
        let objCount = _.countBy(outcomeList, item => item.substring(0, item.indexOf('#')));
        return objCount[vid] || 0;
    }

    //更新投注揽回调函数
    callbackAfterAdd(currentKeys) {
        let {vid} = this.props;
        let betslipList = games.Betslip.getBetslip();
        //更新投注揽信息
        this.props.updateBetArea({
            eventCount: betslipList.length
        });
        Emitter.global.emit('event_update_' + vid, currentKeys);
    }

    //点击展开全部玩法
    _BtnForMore() {
        const {event} = this.model;
        const {sort} = this.props;
        let isSingle = sort === 'dg';
        let ops = dialogOption.getDialogOption(event, '', this.callbackAfterAdd.bind(this), isSingle);
        this.props.toggleCommonDialog(ops);
    }

    render() {
        const {sort, isFromExpert} = this.props;  //handicap应需求加的虚假字段控制是让-1还是+1的
        const {event, WDW_mkt, HWDW_mkt} = this.model;
        let isDgEvent = event.dgStatus == 1;
        let isSingle = sort !== 'mix';  // 是否显示单固
        let handicap = "";
        if (HWDW_mkt) {
            handicap = HWDW_mkt.handicap;
        }
        let payCount = this.getChoosePlays();
        let wdwDgStatus = isDgEvent && WDW_mkt && WDW_mkt.dgStatus == 1;
        let hwdwDgStatus = isDgEvent && HWDW_mkt && HWDW_mkt.dgStatus == 1;
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
                        <View style={[styles.mktCnt, wdwDgStatus ? styles.dgBorder : {}]}>
                            <View style={[styles.left, styles.WDWnumStyle]}>
                                <Text style={styles.white}>0</Text>
                            </View>
                            <View style={styles.right}>
                                {
                                    !WDW_mkt || (isSingle && !wdwDgStatus) ?
                                        <Text style={styles.single}>
                                            该玩法未{isSingle ? '开单关' : '开售'}
                                        </Text> :
                                        this.renderBetButton(CommonSort.WIN_DRAW_WIN)
                                }
                            </View>
                        </View>
                        <View style={[styles.mktCnt, styles.hwdwMktCnt, hwdwDgStatus ? styles.dgBorder : {}]}>
                            <View style={[styles.left, styles.HWDWnumStyle, hwdwDgStatus ? styles.exHWDWnumStyle: {}]}>
                                {
                                    !!handicap && handicap - 1 >= 0 ?
                                        <Text style={styles.white}>{handicap}</Text> :
                                        <Text style={styles.white}>{handicap}</Text>
                                }
                            </View>
                            <View style={styles.right}>
                                {!handicap || !HWDW_mkt || (isSingle && !hwdwDgStatus) ?
                                    <Text style={styles.single}>
                                        该玩法未{isSingle ? '开单关' : '开售'}
                                    </Text> :
                                    this.renderBetButton(CommonSort.HANDICAP_WIN_DRAW_WIN)}
                            </View>
                        </View>
                    </View>
                </View>
                {
                    !isFromExpert && <TouchableOpacity onPress={() => this._BtnForMore()}>
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
                }
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
        height: 64,
        flexDirection: 'column',
        alignItems: "center"
    },
    WDWnumStyle: {
        height: 30,
        backgroundColor: "#cad1c5",
        // flexDirection: 'column'
    },
    HWDWnumStyle: {
        height: 31,
        backgroundColor: "#8ad948"
    },
    exHWDWnumStyle: {
        height: 30
    },
    //展开全部
    blankContent: {
        height: 64,
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
    common: {
        justifyContent: "space-around",
        alignItems: "center"
    },
    dgBorder: {
        height: 32,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'red'
    },
    mktCnt: {
        height: 32,
        width: '100%',
        flexDirection: 'row',
        borderColor: CommonColor.DarkerBorderColor,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },
    hwdwMktCnt: {
        borderTopWidth: 0
    },
    left: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        height: 31
    },
    right: {
        flex: 92,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});