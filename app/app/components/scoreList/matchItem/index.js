import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import { BgColor } from '../../../constants/color';
import MatchFavourite from'../matchFavourite';
import MatchScore from'../matchScore';
import { connectComponentAction } from "../../../reduxCfg";
import action from "./action";
import * as storeKey from "../../../constants/storeKeys";
import pushClient from '@easylotto/push_client';
import Timer from '@easylotto/timer';

class MatchItem extends Component {
    static defaultProps = {
        tabIndex : 0,  //默认tabPageIndex
        item : {},     //当前比赛
        index : 0,     //下标
        matchInfo : {}
    };

    constructor(props) {
        super(props);
        this.state = {
            item : this.props.item
        };
    }

    componentWillUnmount() {
        this.unbindPush();
        this.setTimer(false);
    }

    /**
     * 设置定时器
     * @param isAdd
     */
    setTimer(isAdd) {
        let self = this;
        let { item, handleMatchState } = this.props;
        let { vid, eventState, vsTime } = item;
        if (!this.isStateTextShow(eventState) && isAdd) {
            Timer.setTimer({
                key : vid,
                startTime : +vsTime,
                callback(duration) {
                    Object.assign(item, {
                        vsTime : duration
                    });
                    //进行数据状态判断、更新
                    handleMatchState(item);
                    self.setState({ item });
                }
            });
        } else {
            Timer.clearTimer(vid);
        }
    }

    bindPush(item) {
        this.fnPushOff = pushClient.onEventInfoUpdate(item.vid, this.pushUpdate.bind(this));
    }

    unbindPush() {
        this.fnPushOff && this.fnPushOff();
    }

    pushUpdate(data) {
        const { handleMatchState, item } = this.props;
        Object.assign(item, {
            awayGoalsScored : data.actions.awayGoalsScored,
            awayRedCards : data.actions.awayRedCards,
            awayYellowCards : data.actions.awayYellowCards,
            eventState : data.actions.eventState,
            homeGoalsScored : data.actions.homeGoalsScored,
            homeRedCards : data.actions.homeRedCards,
            homeYellowCards : data.actions.homeYellowCards,
            vsTime : data.time,
        });
        //进行数据状态判断、更新
        handleMatchState(item);
        this.setState({ item }, () => {
            this.setTimer(true);
        });
    }

    componentWillReceiveProps(nextProps) {
        const { handleMatchState, item } = this.props;
        if (nextProps.item !== item) {
            handleMatchState(nextProps.item);
            //清除之前定时器
            this.setTimer(false);
            this.setState({ item : nextProps.item }, () => {
                this.setTimer(true);
            });

        }
    }

    componentWillMount() {
        const { handleMatchState, item } = this.props;
        this.bindPush(item);
        handleMatchState(item);
        this.setTimer(true);
    }


    /**
     * 是否显示文字不显示时间
     * @param eventState    对应赛事状态
     */
    isStateTextShow(eventState) {
        let textArrId = [ "0", "1", "3", "9", "10", "11", "12", "13" ]; //需要显示文字提示的状态
        return textArrId.indexOf(eventState) !== -1;
    }

    render() {
        const { tabIndex, index, handleMatchState, handleAttentionDataLenth, updateAddAttention , isShowRedYellowCard, isShowRanking} = this.props;
        let { item } = this.state;
        return (
            <View>
                <View style={[ styles.scoreItem, { marginTop : index === 0 ? 8 : 4 } ]}>
                    <MatchFavourite tabIndex={tabIndex}
                                    item={item}
                                    index={index}
                                    handleMatchState={handleMatchState}
                                    updateAddAttention={updateAddAttention}
                                    handleAttentionDataLenth={handleAttentionDataLenth}
                    />
                    <MatchScore tabIndex={tabIndex}
                                item={item}
                                isShowRedYellowCard={isShowRedYellowCard}
                                isShowRanking={isShowRanking}
                    />
                    <View style={styles.rightBox}>
                        {item.hasTextLive === 'true'
                            ? <Image style={styles.rightLogo} source={require('../../../images/match_live.png')}/>
                            : <View style={{ height : 0 }}/>
                        }
                    </View>
                </View>
                {(item.homeOverTimeScored === "")
                    ? <View style={{ height : 0 }}/>
                    : <View style={{ justifyContent : 'center', alignItems : 'center' }}>
                        <Text style={{ fontSize : 10, fontFamily : 'PingFang-SC-Medium', color : '#EB812A', height : 20 }}>
                            {item.fullTimeScore + ' ' + item.overTimeScore + ' ' + item.penaltyScore}
                        </Text>
                    </View>
                }
            </View>
        );
    }
}

export default connectComponentAction(action, storeKey.SCORE_MATCH_ITEM)(MatchItem)

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    scoreList : {
        backgroundColor : BgColor
    },
    scoreItem : {
        flexDirection : 'row',
        marginBottom : 5,
        backgroundColor : 'white',
        height : 78
    },
    rightBox : {
        flex : 1.8,
        alignItems : 'flex-end',
        alignSelf : 'center'
    },
    rightLogo : {
        height : 16,
        width : 20,
        marginRight : 10
    },
});