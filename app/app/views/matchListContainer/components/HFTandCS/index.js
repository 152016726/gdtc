/**
 * Created by Roger(ljx) on 2018/9/4.
 */
import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import TeamHeader from '../teamHeader';
import * as CommonColor from '~/constants/color';
import games from '@easylotto/bet';
import {connectComponentAction} from "~/reduxCfg";
import action from "./action";
import * as storeKeys from '#/constants/storeKeys';
import matchDataCenter from '#/matchDataCenter';
import oddDealCtrl from '#/constants/oddDealCtrl';
import dialogOption from '~/components/allPlays/dialogOption';
import _ from "lodash";
import Emitter from "@easylotto/emitter";

class HalfFullTime extends Component {

    static defaultProps = {
        vid: '',        // 比赛vid
        sort: '',       // 显示的sort分类，可能是 min 混合过关，dg 单固
        currentKey: ''  // 当前改变的outcome的key
    };

    model = {};

    componentWillMount() {
        this.initModel();
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.vid !== this.props.vid){
            this.initModel(nextProps);
        }
    }

    initModel(props) {
        let {vid} = (props || this.props);
        this.model.event = matchDataCenter.getEventObject(vid);
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

    //展示当前赛事已选择的
    getChoosePlays() {
        const {sort, vid} = this.props;
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

    _showDialog() {
        const {sort} = this.props;
        const {event} = this.model;
        let ops = dialogOption.getDialogOption(event, sort, this.callbackAfterAdd.bind(this));
        this.props.toggleCommonDialog(ops);
    }

    render() {
        const {text} = this.props;
        const {event} = this.model;
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