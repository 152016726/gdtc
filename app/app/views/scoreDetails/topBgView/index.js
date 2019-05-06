/**
 * Created by easyLottoMac on 2018/10/17.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    Platform,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import {FONT_14, FONT_18} from "~/constants/fontSize";
import ShareDialog from '~/components/shareDialog';
import UShare from '~/modules/share/share';
import SharePlatform from '~/modules/share/SharePlatform';
import ActionProgressDialog from '~/components/actionProgressDialog';
import pushClient from '@easylotto/push_client';
import dict from '@easylotto/dict';
import AttentionDataManager from '~/dataManager/attentionDataManager';
import Timer from '@easylotto/timer';
import Blink from '~/components/blink';
import ViewShot, {captureScreen, captureRef} from "react-native-view-shot";
import countDown from '#/constants/countDown.js';

const _TYPEDICTKEY = 'eventState';                      // 赛事状态字典 key
const S_W = Dimensions.get('window').width;             // 屏幕的宽度
const _FUTUREEVENTIDARR = ["0", "1", "11", "12"];       // 未开赛的赛事状态 id


export default class TopBgView extends Component {
    static defaultProps = {
        eventInfo: {},                  // 赛事信息
        vid: '',                        // 赛事 id
        item: {}                        // 用于收藏的赛事item
    };

    constructor(props) {
        super(props);
        this.state = {
            marketMinutes: '0',                             // 比赛进行的分钟时间
            isAttention: this.props.item.isFavourite,       // 是否关注
            timeSeconds: 0,                                 // 比赛已进行的秒数
            homeGoalsScored: "0",                           // 主队比分
            eventState: "0",                                // 赛事状态
            awayGoalsScored: "0",                           // 客队比分
            homeHalftimeScored: "0",                        // 上半场主队比分
            awayHalftimeScored: "0",                        // 上半场客队比分
            imageURI: ''                                    // 图片地址
        }
    }

    componentWillMount() {
        this.bindPush();
        // countDown.setMinutesTimer('2680', '2', '123456', (minuteNum)=> {
        //     console.log(minuteNum);
        //     if(minuteNum === '45+') {
        //         countDown.setMinutesTimer('3000', '3', '123456', (minuteNum) => {
        //             console.log(minuteNum);
        //         });
        //     }
        // });
        // this.setTimer(true);
        this.setCountDown();
    }

    componentWillReceiveProps(nextProps) {
        const {eventInfo} = nextProps;
        // 接收父组件传递的值进行默认赋值
        if (this.props.eventInfo !== eventInfo) {
            this.setState({
                eventState: eventInfo.eventState,
                homeGoalsScored: eventInfo.homeGoalsScored,
                awayGoalsScored: eventInfo.awayGoalsScored,
                homeHalftimeScored: eventInfo.homeHalftimeScored,
                awayHalftimeScored: eventInfo.awayHalftimeScored,
                timeSeconds: eventInfo.vsTime || 0
            }, () => {
                // 时间改变重置定时器
                if (eventInfo.vsTime) {
                    // this.setTimer(true);
                    this.setCountDown();
                }
            });
        }
    }

    componentWillUnmount() {
        this.unbindPush();
        // 不清空定时器，避免外层定时器被销毁
        // this.setTimer(false);
    }

    /**
     * push 接收
     */
    bindPush() {
        this.fnPushOff = pushClient.onEventInfoUpdate(this.props.vid, this.pushUpdate.bind(this));
    }

    /**
     * 解绑 push
     */
    unbindPush() {
        this.fnPushOff && this.fnPushOff();
    }

    /**
     *设置倒计时
     */
    setCountDown() {
        let self = this;
        let {vid} = this.props;
        let {timeSeconds, eventState} = this.state;
        // console.log('timeSeconds...', timeSeconds);
        countDown.setMinutesTimer({
            key: vid,
            second: timeSeconds,
            eventState,
            callback(minutes) {
                self.setState({
                    marketMinutes: minutes
                });
            }
        })
    }

    /**
     * 设置定时器
     * @param isAdd
     */
    setTimer(isAdd) {
        let self = this;
        let {timeSeconds, eventState} = this.state;
        let {vid} = this.props;
        if (!this.isStateTextShow(eventState) && isAdd) {
            Timer.setTimer({
                key: vid,
                startTime: timeSeconds,
                callback(duration) {
                    self.setState({
                        timeSeconds: duration
                    });
                }
            });
        } else {
            Timer.clearTimer(vid);
        }
    }

    /**
     * 接收 push 执行方法
     * @param data
     */
    pushUpdate(data) {
        const {homeGoalsScored, awayGoalsScored} = this.state;
        // 更新赛事状态
        if (data.actions) {
            let event = data.actions;
            if (event.eventState) {
                this.setState({
                    eventState: event.eventState
                });
                if (event.eventState === "3") {
                    this.setState({
                        homeHalftimeScored: homeGoalsScored,
                        awayHalftimeScored: awayGoalsScored
                    })
                }
                this.setCountDown();
            }
            // 更新主队比分
            if (event.homeGoalsScored) {
                this.setState({
                    homeGoalsScored: event.homeGoalsScored
                })
            }
            // 更新客队比分
            if (event.awayGoalsScored) {
                this.setState({
                    awayGoalsScored: event.awayGoalsScored
                })
            }
        }
        // 更新比赛时间
        if (data.time) {
            this.setState({
                timeSeconds: data.time
            });
            this.setCountDown();
        }
    }

    /**
     * 点击关注事件
     */
    attentionHandle(item) {
        let {isAttention} = this.state;
        this.setState({
            isAttention: !isAttention
        });
        AttentionDataManager.put(item, !isAttention);
    }

    /**
     * 更多按钮事件
     */
    moreHandle() {
        captureScreen({
            format: "jpg",
            quality: 0.5,
            result: "tmpfile"
        }).then(
            uri => {
                this.setState({imageURI: uri})
            },
            error => console.log("Oops, snapshot failed==" + error)
        );
        this.shareDialog.show();
    }

    /**
     * 比赛倒计时模块
     * @returns {*}
     */
    renderMarketTime() {
        const {eventState, timeSeconds, marketMinutes} = this.state;
        // let timeMinute = Math.ceil(timeSeconds / 60);   // 比赛时间的分钟
        let isShowTextTip = this.isStateTextShow(eventState);
        // let showText = timeMinute;
        // //上半场以及下半场的时间状态展示
        // switch (eventState) {
        //     case "2":
        //         showText = timeMinute > 45 ? "45+" : timeMinute;
        //         break;
        //     case "4":
        //         showText = timeMinute > 90 ? "90+" : timeMinute;
        //         break;
        //     case "5":
        //         showText = timeMinute > 105 ? "105+" : timeMinute;
        //         break;
        //     case "7":
        //         showText = timeMinute > 120 ? "120+" : timeMinute;
        //         break;
        //     case "8":
        //         showText = "";
        //         break;
        // }
        // if (isShowTextTip) {
        //     //要显示的文字内容提示
        //     showText = dict.getDictText(_TYPEDICTKEY, eventState, "shortText");
        // }
        return (
            <View style={[styles.topViewStatusBox, isShowTextTip && styles.statusTextSty]}>
                <Text style={styles.topViewStatus}>{marketMinutes}</Text>
                {!isShowTextTip && <Blink cls={styles.topViewTimeDot} text={'′'}/>}
            </View>
        )
    }

    /**
     * 是否显示文字不显示时间
     * @param eventState    对应赛事状态
     */
    isStateTextShow(eventState) {
        let textArrId = ["0", "1", "3", "9", "10", "11", "12", "13"];   // 需要显示文字提示的状态
        return textArrId.indexOf(eventState) !== -1;
    }

    /**
     * 页面向上滑的时候头部显示的样式
     * @returns {*}
     */
    renderTopViewTab() {
        const {homeGoalsScored, awayGoalsScored} = this.state;
        return (
            <View style={styles.tobViewTabBox}>
                <Image style={styles.topMinIcon}
                       resizeMode={"stretch"}
                       source={require('../images/homeIcon_Min.png')}/>
                <Text style={styles.topViewScore}>{homeGoalsScored || 0}</Text>
                {this.renderMarketTime()}
                <Text style={styles.topViewScore}>{awayGoalsScored || 0}</Text>
                <Image style={styles.topMinIcon}
                       resizeMode={"stretch"}
                       source={require('../images/awayIcon_Min.png')}/>
            </View>
        )
    }

    /**
     * 渲染头部导航栏
     * @returns {*}
     */
    renderTopTabBar() {
        const {navigation, isShowICon, eventInfo, item} = this.props;
        const {isAttention} = this.state;
        let isShowAttention = _FUTUREEVENTIDARR.indexOf(eventInfo.eventState) !== -1;
        let _isShowIcon = Platform.OS !== 'ios' ? false : isShowICon;
        return (
            <View style={styles.topBarSt}>
                <View style={{width: isShowICon ? 21 : 50}}>
                    <TouchableOpacity onPress={() => {
                        DeviceEventEmitter.emit('UpdateData');
                        navigation.goBack();
                    }}>
                        <Image resizeMode="contain" style={styles.headerIcon}
                               source={require('../../../images/back.png')}/>
                    </TouchableOpacity>
                </View>
                <View>
                    {
                        _isShowIcon ? this.renderTopViewTab() :
                            <View>
                                <Text style={styles.headerCenterText}>
                                    {eventInfo.leagueName}
                                    {
                                        !!eventInfo.round && <Text>第{eventInfo.round}轮</Text>
                                    }
                                </Text>
                                <Text style={[styles.headerCenterText, {marginTop: 2}]}>
                                    {!!eventInfo.vsDate && eventInfo.vsDate.substring(0, 16)}
                                </Text>
                            </View>
                    }
                </View>
                <View style={styles.HeaderRight}>
                    {
                        isShowAttention && <TouchableOpacity onPress={() => this.attentionHandle(item)}>
                            <Image resizeMode="contain" style={styles.headerIcon}
                                   source={isAttention ? require('../images/attentionActive.png') : require('../images/attention.png')}/>
                        </TouchableOpacity>
                    }
                    {
                        !_isShowIcon && <TouchableOpacity style={styles.headerRightTouch}
                                                          onPress={() => this.moreHandle()}>
                            <Image resizeMode="contain" style={styles.headerIcon}
                                   source={require('../images/icon_share.png')}/>
                        </TouchableOpacity>
                    }
                </View>
                {this.renderShareDialog()}
                <ActionProgressDialog
                    ref={progressDialog => this.progressDialog = progressDialog}/>
            </View>
        )
    }

    renderShareDialog() {
        return (
            <ShareDialog
                ref={ref => this.shareDialog = ref}
                showCloseButton={true}
                actions={
                    [
                        {
                            text: '微信好友', onPress: () => {
                                this.share(SharePlatform.WECHAT);
                            }
                        },
                        {
                            text: '朋友圈', onPress: () => {
                                this.share(SharePlatform.WECHATMOMENT);
                            }
                        },
                        {
                            text: 'QQ好友', onPress: () => {
                                this.share(SharePlatform.QQ);
                            }
                        },
                        {
                            text: '新浪微博', onPress: () => {
                                this.share(SharePlatform.SINA);
                            }
                        }
                    ]
                }
            />
        )
    }

    /**
     * 第三方分享
     * 参数：标题、分享内容、分享链接、图片、平台、分享结果回调
     */
    share(number) {
        UShare.shareImage(this.state.imageURI, number,
            (message) => {
                console.log(message, this.state.imageURI);
                // message: 分享成功、分享失败、取消分享
                this.progressDialog.toast(message);
                // TODO ...
            });
    }

    /**
     * 渲染比分模块
     * @returns {*}
     */
    renderVsView() {
        const {eventInfo} = this.props;
        const {homeGoalsScored, awayGoalsScored, eventState, homeHalftimeScored, awayHalftimeScored} = this.state;
        let isShowScore = _FUTUREEVENTIDARR.indexOf(eventState) === -1; //是否显示比分
        return (
            <View style={styles.centerBox}>
                <View style={styles.statusBox}>
                    {this.renderMarketTime()}
                </View>
                {
                    isShowScore ? <View style={{alignItems: "center"}}>
                            <View style={styles.teamScore}>
                                <Text style={styles.teamName}>{homeGoalsScored || 0}</Text>
                                <Text style={styles.teamLine}/>
                                <Text style={styles.teamName}>{awayGoalsScored || 0}</Text>
                            </View>
                            <Text style={styles.halfVsScore}>
                                ({homeHalftimeScored || 0} - {awayHalftimeScored || 0})
                            </Text>
                        </View> :
                        <View style={styles.teamVsBox}>
                            <Text style={styles.teamVs}>VS</Text>
                        </View>
                }
                <View style={styles.centerBot}>
                    {
                        !!eventInfo.weatherImage && <Image style={styles.weatherIcon}
                                                           resizeMode={"stretch"}
                                                           source={{uri: eventInfo.weatherImage}}/>
                    }
                    {
                        (!!eventInfo.weatherLow && eventInfo.weatherHigh)
                            ?
                            <Text
                                style={styles.weatherNum}>{parseInt(eventInfo.weatherLow)}℃~{parseInt(eventInfo.weatherHigh)}℃</Text>
                            :
                            !!eventInfo.weatherHigh ?
                                <Text style={styles.weatherNum}>{parseInt(eventInfo.weatherHigh)}℃</Text>
                                : <View/>
                    }

                </View>
            </View>
        )
    }

    /**
     * 渲染头部模块样式
     * @returns {*}
     */
    renderTopView() {
        const {eventInfo} = this.props;
        return (
            <View style={styles.bgViewBox}>
                <View>
                    <Image style={styles.teamIcon}
                           resizeMode={"stretch"}
                           source={require('../images/homeIcon_Max.png')}/>
                    <Text style={styles.teamNameSt}>{eventInfo.homeShortName}</Text>
                </View>
                {this.renderVsView()}
                <View>
                    <Image style={styles.teamIcon}
                           resizeMode={"stretch"}
                           source={require('../images/awayIcon_Max.png')}/>
                    <Text style={styles.teamNameSt}>{eventInfo.awayShortName}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.topBox}>
                <Image style={styles.bgImageSt}
                       source={require('../images/bgImage.png')}/>
                <View style={styles.bgViewSt}>
                    {this.renderTopView()}
                </View>
                {this.renderTopTabBar()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    topBarSt: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 12,
        width: S_W,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    tobViewTabBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    topMinIcon: {
        width: 30,
        height: 30
    },
    topViewScore: {
        fontWeight: 'bold',
        fontSize: FONT_18,
        color: '#ffffff',
        marginHorizontal: 18
    },
    topViewStatusBox: {
        flexDirection: 'row',
        paddingLeft: 4,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 4,
        overflow: 'hidden'
    },
    statusTextSty: {
        paddingRight: 4
    },
    topViewStatus: {
        color: '#ffffff'
    },
    topViewTimeDot: {
        fontWeight: 'bold',
        fontSize: FONT_18,
        color: '#ffffff',
        lineHeight: 15
    },
    headerCenterText: {
        color: '#ffffff',
        textAlign: 'center',
        flexDirection: 'row'
    },
    HeaderRight: {
        flexDirection: 'row',
    },
    headerRightTouch: {
        marginLeft: 16
    },
    headerIcon: {
        width: 21,
        height: 21
    },
    topBox: {
        height: 190,
        position: 'relative'
    },
    bgImageSt: {
        width: S_W,
        height: 190,
    },
    bgViewSt: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: S_W,
        height: 190,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    teamIcon: {
        height: 64,
        width: 64,
        marginBottom: 10
    },
    teamNameSt: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: FONT_14
    },
    weatherIcon: {
        height: 20,
        width: 20,
        marginRight: 4
    },
    weatherNum: {
        color: '#ffffff',
        paddingTop: 3
    },
    centerBox: {
        marginHorizontal: 35,
        alignItems: 'center',
        position: 'relative'
    },
    bgViewBox: {
        flexDirection: 'row',
        paddingTop: 60
    },
    statusBox: {
        position: 'absolute',
        flexDirection: 'row',
        top: -20
    },
    statusText: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 7,
        borderRadius: 4,
        overflow: 'hidden',
        color: '#ffffff'
    },
    teamScore: {
        width: 100,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    teamVsBox: {
        width: 100,
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    teamVs: {
        fontSize: 30,
        color: '#ffffff',
        fontWeight: 'bold'
    },
    teamName: {
        width: 20,
        fontSize: 30,
        color: '#ffffff',
        fontWeight: 'bold'
    },
    teamLine: {
        width: 12,
        height: 3,
        backgroundColor: '#ffffff'
    },
    halfVsScore: {
        color: '#ffffff',
        marginBottom: 10
    },
    centerBot: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 5
    }
});