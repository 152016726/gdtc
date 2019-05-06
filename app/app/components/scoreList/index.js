import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    Vibration
} from 'react-native';
import {staticDataFetch} from '../../network/elNetWork';
import {FONT_12} from '../../constants/fontSize';
import {BgColor} from '../../constants/color';
import GoalToast from '../../components/goalToast';
import pushClient from '@easylotto/push_client';
import MatchItem from './matchItem';
import Sound from 'react-native-sound';
import action from "./action";
import * as storeKey from "../../constants/storeKeys";
import  { connectReducerComponent } from '../../reduxCfg';
import reducer from './reducer';
import state from './state';
import {
    CANCEL_MATCH,
    NOT_START,
    UNDETERMINED,
    PUT_OFF,
    CUTTING_MATCH
} from '../../constants/eventState';

const TIPS_SOUND = require('../../sounds/tipsSound.mp3'); //声音提示
const SCORE_SETTING = 'ScoreSetting';
const INITPAGEONE = [
    CANCEL_MATCH,
    NOT_START,
    UNDETERMINED,
    PUT_OFF,
    CUTTING_MATCH];

class ScoreList extends Component {

    static defaultProps = {
        flatListData: [], //展示的赛事信息数组
        isFooter: false,  //底部view
        tabIndex: 0,      //默认tabPageIndex
        matchInfo: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            MaxHeight: 0,
            waiting: false,  //用于防多次点击的等待
            isFirst: true
        }
    }

    componentWillMount() {
        this.props.flatListData.forEach((item) => {
            this.bindPush(item)
        });
        this.props.getFavouriteMatch();
        //第一次进入比分设置
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

    componentWillUnmount(){
        this.unbindPush();
    }

    componentWillUpdate(){
        //第一次进入比分设置
        this.hasData().then((data) => {
            // console.log('hasSettingData',data);
            let hasData = true;
            if (data == null) {
                hasData = false;
            }
            if(hasData){
                this.props.getDataManager(data);
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.flatListData !== this.props.flatListData) {
            nextProps.flatListData && nextProps.flatListData.forEach((item) => {
                this.bindPush(item)
            });
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
        const {flatListData, isGoalDialog, isGoalShakeTips, isGoalSoundTips,
            isFoulDialog, isFoulShakeTips, isFoulSoundTips, allGame, favouriteGame,attentionList} = this.props;
        let matchInfomation, matchTipsSide, displayListData;
        if(favouriteGame){
            displayListData = attentionList;
        }
        else{
            displayListData = flatListData;
        }
        displayListData && displayListData.forEach((item, index) => {
            //找到相同vid的比赛进行 数据判断 记录是 哪队 进球 或 红牌 或 黄牌
            if (item.vid === data.vid) {
                if (data.actions.homeRedCards !== item.homeRedCards) {
                    //主队红牌
                    if(isFoulDialog){matchTipsSide = 'homeRedCard'}
                    //判断设置红黄牌震动提示
                    isFoulShakeTips && Vibration.vibrate();
                    //判断设置声音提醒
                    isFoulSoundTips && this.playTipsSound();

                } else if (data.actions.homeYellowCards !== item.homeYellowCards) {
                    //主队黄牌
                     if(isFoulDialog) {matchTipsSide = 'homeYellowCard'}
                    //判断设置红黄牌震动提示
                    isFoulShakeTips && Vibration.vibrate();
                    //判断设置声音提醒
                    isFoulSoundTips && this.playTipsSound();

                } else if (data.actions.homeGoalsScored !== item.homeGoalsScored) {
                    //主队进球
                    if(isGoalDialog){matchTipsSide = 'homeGoalScored'}
                    //判断设置进球震动提示
                    isGoalShakeTips && Vibration.vibrate();
                    //判断设置进球声音提醒
                    isGoalSoundTips && this.playTipsSound();

                } else if (data.actions.awayGoalsScored !== item.awayGoalsScored) {
                    //客队进球
                    if(isGoalDialog){matchTipsSide = 'awayGoalScored'}
                    //判断设置进球震动提示
                    isGoalShakeTips && Vibration.vibrate();
                    //判断设置进球声音提醒
                    isGoalSoundTips && this.playTipsSound();

                } else if (data.actions.awayRedCards !== item.awayRedCards) {
                    //客队红牌
                    if(isFoulDialog){matchTipsSide = 'awayRedCard'}
                    //判断设置红黄牌震动提示
                    isFoulShakeTips && Vibration.vibrate();
                    //判断设置声音提醒
                    isFoulSoundTips && this.playTipsSound();

                } else if (data.actions.awayYellowCards !== item.awayYellowCards) {
                    //客队黄牌
                    if(isFoulDialog){matchTipsSide = 'awayYellowCard'}
                    //判断设置红黄牌震动提示
                    isFoulShakeTips && Vibration.vibrate();
                    //判断设置声音提醒
                    isFoulSoundTips && this.playTipsSound();

                } else if (data.actions.eventState === '9' || data.actions.eventState === '3') {
                    matchTipsSide = 'eventState';
                }else{
                    matchTipsSide = undefined;
                }

                //如果push过来的数据不是进球 红牌 黄牌 不提示
                if (matchTipsSide !== undefined) {
                    matchInfomation = Object.assign(item, data.actions, {vsTime: data.time}, {matchTipsSide});
                    // console.log('!!!!!!!!',matchInfomation);
                    this._toast.show(matchInfomation, 5000);
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

    scoreHandle(item) {
        this.setState({waiting: true});
        let initPageId = INITPAGEONE.indexOf(item.eventState) !== -1 ? 1 : 0;
        // 跳转至比分详情页
        this.props.navigation.navigate('ScoreDetails', {
            vid: item.vid,
            event: item,
            eventAll: this.props.flatListData,
            favoriteGame : this.props.attentionList,
            initPageId
        });
        setTimeout(() => {
            this.setState({waiting: false})
        }, 2000);//设置点击时间间隔
    }

    /**
     * 列表 render
     *
     */
    scoreList(item, index) {
        const {tabIndex, matchInfo, isShowRedYellowCard, isShowRanking} = this.props;
        return (
            <TouchableOpacity style={styles.scoreList}
                              disabled={this.state.waiting}
                              onPress={() => this.scoreHandle(item)}>
                <MatchItem item={item}
                           tabIndex={tabIndex}
                           index={index}
                           matchInfo={matchInfo}
                           isShowRedYellowCard={isShowRedYellowCard}
                           isShowRanking={isShowRanking}
                />
            </TouchableOpacity>
        )
    }

    /**
     * 底部提示语 render
     * @returns {*}
     */
    renderFooter() {
        return (
            <View>
                <Text style={styles.footerSty}>
                    没有更多啦
                </Text>
            </View>
        )
    }

    /**
     * 下拉刷新的功能
     */
    _refreshHandle() {
        const {refreshHandle} = this.props;
        this.setState({ //重置最大高度
            MaxHeight: 0
        });
        refreshHandle && refreshHandle();
    }

    /**
     * 上拉加载更多功能
     * @param eNative
     * @private
     */
    _scrollHandle(eNative) {
        let {MaxHeight} = this.state;
        const {pullUpLoad, isFooter} = this.props;
        let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height; //获取页面的高度
        //确保只有滑到页面底部才开始重新请求数据且只请求一次
        if (contentHeight === eNative.contentSize.height && eNative.contentSize.height > MaxHeight) {
            this.setState({
                MaxHeight: eNative.contentSize.height   //记录每一次请求数据前的最大高度
            });
            if (!isFooter) { //若文章已滑到底，则不再请求数据
                // pullUpLoad && pullUpLoad();
            }
        }
    }

    render() {
        const {flatListData, isFooter} = this.props;
        return (
            <View>
                <FlatList style={{backgroundColor: BgColor}}
                          data={flatListData}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item, index}) => this.scoreList(item, index)}
                          ListFooterComponent={() => isFooter && this.renderFooter()}
                          onScroll={(e) => this._scrollHandle(e.nativeEvent)}
                          scrollEventThrottle={1}
                          refreshing={false}
                          extraData={this.state}
                          onRefresh={() => this._refreshHandle()}
                />
                <GoalToast ref={(ref) => {
                    this._toast = ref
                }} position={'bottom'}/>
            </View>
        )
    }
}

// export default connectComponentAction(action, storeKey.SCORE_MATCH_LIST)(ScoreList)
export default connectReducerComponent(storeKey.SCORE_MATCH_LIST, reducer, state, action)(ScoreList)
const styles = StyleSheet.create({
    scoreList: {
        backgroundColor: BgColor
    },
    footerSty: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: FONT_12,
        color: '#D1D1D1',
        textAlign: 'center',
        padding: 12,
        backgroundColor: BgColor
    }
});
