/**
 * Created by easyLottoMac on 2018/10/16.
 */
import React, {Component} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    Vibration,
    Platform
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {connectReducerComponent} from '~/reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '~/constants/storeKeys';
import SDScrollTabBar from './SDScrollTabBar';
import LiveTelecast from './liveTelecast';
import Analysis from './analysis';
import Exponential from './exponential';
import ScoreInformation from './information';
import {BgColor} from "~/constants/color";
import TopBgView from './topBgView';
import GoalTipsToast from '~/components/goalToast';
import pushClient from '@easylotto/push_client';
import NestedScrollView from 'react-native-nested-scroll-view';
import Sound from 'react-native-sound';

const SCORE_SETTING = 'ScoreSetting';
const TIPS_SOUND = require('../../sounds/tipsSound.mp3'); //声音提示
const S_H = Dimensions.get('window').height - 70;

class ScoreDetails extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: (<View/>)
        }
    };

    componentWillMount() {
        const {navigation} = this.props;
        let vid = navigation.state.params.vid;
        this.props.getAllEvent();
        this.props.getFavouriteMatch();
        this.props.resetData();
        this.props.getScoreData(vid); //这里需要Vid！！！Push时需要传过来
        //获取缓存值 判断是否存在 改变默认值
        this.hasData().then((data) => {
            // console.log('hasSettingData',data);
            let hasData = true;
            if (data == null) {
                hasData = false;
            }
            if(hasData){
                this.props.getDataManager(data)
            }

        });

    }

    componentWillUpdate(){
        //获取缓存值 判断是否存在 改变默认值
        this.hasData().then((data) => {
            // console.log('hasSettingData',data);
            let hasData = true;
            if (data == null) {
                hasData = false;
            }
            if(hasData){
                this.props.getDataManager(data)
            }

        });
    }

    componentWillUnmount() {
        this.unbindPush();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps !== this.props){
            //根据是否提醒全部比赛判断范围
            if (nextProps.eventAll !== this.props.eventAll) {
                nextProps.eventAll.forEach((item) => {
                    this.bindPush(item)
                });
            }
        }
    }

    bindPush(item) {
        this.fnPushOff = pushClient.onEventInfoUpdate(item.vid, this.pushUpdate.bind(this));
    }

    unbindPush() {
        this.fnPushOff && this.fnPushOff();
    }

    //push过来的data与原data数据合并
    pushUpdate(data) {
        const {allGame,eventAll,favoriteGame,isGoalDialog,isGoalShakeTips,
            isGoalSoundTips,isFoulDialog,isFoulShakeTips,isFoulSoundTips} = this.props;
        let matchTipsSide,matchInfomation,tipsArr;
        allGame ? tipsArr = eventAll : tipsArr = favoriteGame;
        tipsArr.forEach((item) => {
            if (item !== undefined) {
                //如果push过来的数据进球 红牌 黄牌 提示
                if (item.vid === data.vid) {
                    if (data.actions.homeRedCards !== item.homeRedCards) {
                        // console.log('主队红牌！',data);
                        //主队红牌
                        if(isFoulDialog){matchTipsSide = 'homeRedCard'}
                        //判断设置红黄牌震动提示
                        isFoulShakeTips && Vibration.vibrate();
                        //判断设置声音提醒
                        isFoulSoundTips && this.playTipsSound();

                    } else if (data.actions.homeYellowCards !== item.homeYellowCards) {
                        // console.log('主队黄牌！',data);
                        //主队黄牌
                        if(isFoulDialog) {matchTipsSide = 'homeYellowCard'}
                        //判断设置红黄牌震动提示
                        isFoulShakeTips && Vibration.vibrate();
                        //判断设置声音提醒
                        isFoulSoundTips && this.playTipsSound();

                    } else if (data.actions.homeGoalsScored !== item.homeGoalsScored) {
                        // console.log('主队进球！',data);
                        //主队进球
                        if(isGoalDialog){matchTipsSide = 'homeGoalScored'}
                        //判断设置进球震动提示
                        isGoalShakeTips && Vibration.vibrate();
                        //判断设置进球声音提醒
                        isGoalSoundTips && this.playTipsSound();

                    } else if (data.actions.awayGoalsScored !== item.awayGoalsScored) {
                        // console.log('客队进球！',data);
                        //客队进球
                        if(isGoalDialog){matchTipsSide = 'awayGoalScored'}
                        //判断设置进球震动提示
                        isGoalShakeTips && Vibration.vibrate();
                        //判断设置进球声音提醒
                        isGoalSoundTips && this.playTipsSound();

                    } else if (data.actions.awayRedCards !== item.awayRedCards) {
                        // console.log('客队红牌！',data);
                        //客队红牌
                        if(isFoulDialog){matchTipsSide = 'awayRedCard'}
                        //判断设置红黄牌震动提示
                        isFoulShakeTips && Vibration.vibrate();
                        //判断设置声音提醒
                        isFoulSoundTips && this.playTipsSound();

                    } else if (data.actions.awayYellowCards !== item.awayYellowCards) {
                        // console.log('客队黄牌！',data);
                        //客队黄牌
                        if(isFoulDialog){matchTipsSide = 'awayYellowCard'}
                        //判断设置红黄牌震动提示
                        isFoulShakeTips && Vibration.vibrate();
                        //判断设置声音提醒
                        isFoulSoundTips && this.playTipsSound();

                    } else if (data.actions.eventState === '9' || data.actions.eventState === '3') {
                        // console.log('比赛状态！',data);
                        matchTipsSide = 'eventState';
                    }

                    //如果push过来的数据不是进球 红牌 黄牌 不提示
                    if ( matchTipsSide !== undefined) {
                        matchInfomation = Object.assign(item, data.actions, {vsTime: data.time}, {matchTipsSide});
                        // console.log('matchInfomation!!!!!!!!!',matchInfomation);
                        this._toasts && this._toasts.show(matchInfomation, 5000);
                    }
                }
            }
        });
    }

    hasData(){
        //判断初次进入
        return new Promise((resolve)=>{
            AsyncStorage.getItem(SCORE_SETTING).then(
                (data)=>{
                    resolve(data);
                }
            );
        });
    }

    playTipsSound(){
        const s = new Sound(TIPS_SOUND, (e) => {
            if (e) {
                console.log('播放失败');
                return;
            }
            s.play(() => s.release());
        });
    }

    render() {
        const {navigation, isShowICon, topNum, eventInfo} = this.props;
        const {vid, initPageId, event, secondLevelPageId, exponentPrevPage, exponentCid} = navigation.state.params; //initPageId 0=>直播 1=>分析 2=>指数 3=>资讯
        let tabName = ['直播', '指数', '分析', '资讯'];
        return (
        <View style={{flex: 1}}>
            <NestedScrollView style={{flex: 1}}>
                <TopBgView
                    navigation={navigation}
                    isShowICon={isShowICon}
                    eventInfo={eventInfo}
                    vid={vid}
                    item={event}/>
                <View style={[styles.scrollViewBox, {top: Platform.OS === 'ios' ? topNum : 0}]}>
                    <ScrollableTabView
                        style={styles.contentBox}
                        renderTabBar={() => <SDScrollTabBar tabNames={tabName}/>}
                        locked={false}
                        initialPage={initPageId || 0}>
                        <LiveTelecast
                            tabLabel='直播'
                            vid={vid}
                            navigation={navigation}
                            homeName={eventInfo && eventInfo.homeShortName}
                            awayName={eventInfo && eventInfo.awayShortName}/>
                        <Analysis
                            tabLabel='分析'
                            navigation={navigation}
                            vid={vid}
                            vsDate={eventInfo && eventInfo.vsDate}
                            awayTid={eventInfo && eventInfo.awayTid}
                            homeTid={eventInfo && eventInfo.homeTid}
                            homeName={eventInfo && eventInfo.homeShortName}
                            awayName={eventInfo && eventInfo.awayShortName}/>
                        <Exponential
                            tabLabel='指数'
                            vid={vid}
                            navigation={navigation}
                            prevPage={exponentPrevPage}
                            cid={exponentCid}
                            secondLevelPageId={secondLevelPageId || 0}/>
                        <ScoreInformation
                            tabLabel='资讯'
                            vid={vid}
                            navigation={navigation}
                            vsDate={eventInfo && eventInfo.vsDate}
                            homeName={eventInfo && eventInfo.homeShortName}
                            awayName={eventInfo && eventInfo.awayShortName}/>
                    </ScrollableTabView>
                </View>
            </NestedScrollView>
            <GoalTipsToast ref={(ref) => {
                this._toasts = ref
            }} position={'bottom'}/>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    contentBox: {
        backgroundColor: BgColor
    },
    scrollViewBox: {
        position: Platform.OS === 'ios' ? 'absolute' : 'relative',
        left: 0,
        height: Platform.OS === 'ios' ? S_H : S_H + 50
    }
});

export default connectReducerComponent(storeKey.SCORE_DETAILS_STORE, reducer, state, action)(ScoreDetails)