import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    Dimensions,
    StyleSheet,
    ImageBackground
} from 'react-native';
import {MainColor, NotStartMatchColor, FinalMatchColor} from'../../constants/color';
import PropTypes from 'prop-types';

const goalLogo = require('../../images/goal_tips_background.png');
const footballImg = require('../../images/football.png');
const yellowCardImg = require('../../images/yellow_big.png');
const redCardImg = require('../../images/red_big.png');
// 设备屏幕宽高
const { width, height } = Dimensions.get('window');
// Toast提示框透明度
const OPACITY = 1;
// 显示时长
export const DURATION = { LONG : 5000, SHORT : 2000 };

export default class GoalToast extends Component {

    // 定义props
    static propTypes = {
        position : PropTypes.oneOf([
            'top',
            'center',
            'bottom'
        ])
    }

    //初始化 默认 props
    static defaultProps = {
        position : 'center'
    }

    constructor(props) {
        super(props);
        this.state = {
            data : {},
            isShow : false,
            opacityAnimate : new Animated.Value(0), // 动画 值初始化
            homeNum : 0,
            awayNum : 0,
            homeShow : false,
            awayShow : false,
            yellowCard : false,
            redCard : false,
            matchState : false
        };

        // 当前显示状态
        this.isShow = false;
        // 初始化默认显示时长为SHORT
        this.duration = DURATION.SHORT;
    }

    componentWillUnmount() {
        // 在页面生命周期结束时，解除定时器，避免内存泄漏
        this.animateTimer && clearTimeout(this.animateTimer);
    }

    /**
     * 显示
     */
    show(data, duration) {

        if (duration >= DURATION.LONG) {
            this.duration = DURATION.LONG;
        } else {
            this.duration = DURATION.SHORT;
        }

        // 显示
        this.setState({
            data : data,
            isShow : true
        });
        this.isShow = true;

        this.getMatchState(data);

        Animated.timing(this.state.opacityAnimate, {
            toValue : 1, // 目标值
            duration : 600, // 动画时间
        }).start();

        // 执行隐藏操作
        this.hide();
    }

    /**
     * 隐藏
     */
    hide() {
        // 隐藏状态下不执行操作
        if (!this.isShow) {
            return;
        }

        this.animateTimer && clearTimeout(this.animateTimer);
        this.animateTimer = setTimeout(() => {
            // 开启动画
            Animated.timing(
                this.state.opacityAnimate,
                {
                    toValue : 0.0,
                    duration : 600
                }
            ).start(() => {
                // 动画结束后，初始化状态
                this.setState({
                    isShow : false,
                    redCard : false,
                    yellowCard : false
                })
                this.isShow = false;
            })
        }, this.duration);

    }

    getMatchState(data) {
        let { homeNum, awayNum, homeShow, awayShow, yellowCard, redCard, matchState } = this.state;
        if (data.matchTipsSide === 'homeRedCard') {
            homeNum = data.homeRedCards;
            awayNum = data.awayRedCards;
            homeShow = true;
            awayShow = false;
            redCard = true;
        } else if (data.matchTipsSide === 'homeYellowCard') {
            homeNum = data.homeYellowCards;
            awayNum = data.awayYellowCards;
            homeShow = true;
            awayShow = false;
            yellowCard = true;
        } else if (data.matchTipsSide === 'homeGoalScored') {
            homeNum = data.homeGoalsScored;
            awayNum = data.awayGoalsScored;
            homeShow = true;
            awayShow = false;
        } else if (data.matchTipsSide === 'awayGoalScored') {
            homeNum = data.homeGoalsScored;
            awayNum = data.awayGoalsScored;
            homeShow = false;
            awayShow = true;
        } else if (data.matchTipsSide === 'awayRedCard') {
            homeNum = data.homeRedCards;
            awayNum = data.awayRedCards;
            homeShow = false;
            awayShow = true;
            redCard = true;
        } else if (data.matchTipsSide === 'awayYellowCard') {
            homeNum = data.homeYellowCards;
            awayNum = data.awayYellowCards;
            homeShow = false;
            awayShow = true;
            yellowCard = true;
        } else if (data.matchTipsSide === 'eventState') {
            homeNum = data.homeGoalsScored;
            awayNum = data.awayGoalsScored;
            homeShow = (parseInt(data.homeGoalsScored) > parseInt(data.awayGoalsScored)) ? true : false;
            awayShow = (parseInt(data.homeGoalsScored) > parseInt(data.awayGoalsScored)) ? true : false;
            matchState = true;
            redCard = false;
            yellowCard = false;
        }

        this.setState({ homeNum, awayNum, homeShow, awayShow, yellowCard, redCard, matchState });
    }

    render() {
        let bottom;
        switch (this.props.position) {
            case 'top':
                bottom = height - 220;
                break;
            case 'center':
                bottom = height / 2;
                break;
            case 'bottom':
                bottom = 10;
                break;
            default:
                break;
        }
        return this.state.isShow
            ? <View pointerEvents={ 'none' }
                    style={ [ styles.container, { bottom : bottom } ]}>
                <Animated.View
                    style={[ styles.content, { opacity : this.state.opacityAnimate } ]}>
                    {this.leftBox()}
                    {this.midBox()}
                    {this.rightBox()}
                </Animated.View>
            </View>
            : null;
    }

    /**
     * leftBox
     *
     */
    leftBox() {
        const { data } = this.state;
        return (
            <View style={styles.leftBox}>
                <ImageBackground style={styles.leftBackGroundImage}
                       source={goalLogo}
                >
                    <Text style={styles.leftText}>{data.leagueShortName !== null ? data.leagueShortName : ''}</Text>
                </ImageBackground>
            </View>
        )
    }

    /**
     * midBox
     */
    midBox() {
        const { data } = this.state;
        const { homeNum, awayNum, homeShow, awayShow } = this.state;
        return (
            <View style={styles.midBox}>
                <Text style={[ styles.midText, (homeShow ? { color : MainColor } : { color : NotStartMatchColor }) ]}>{data.homeShortName + ' ' + homeNum }</Text>
                <Text style={[ styles.midText, { color : NotStartMatchColor } ]}> - </Text>
                <Text style={[ styles.midText, (awayShow ? { color : MainColor } : { color : NotStartMatchColor }) ]}>{awayNum + ' ' + data.awayShortName}</Text>
            </View>
        )
    }

    /**
     * rightBox
     */
    rightBox() {
        const { redCard, yellowCard, matchState, data } = this.state;
        let imgSource;
        let textColor = 'white';
        let text = Math.ceil((parseInt(data.vsTime) / 60))  + '`';
        if (redCard) {
            imgSource = redCardImg;
        } else if (yellowCard) {
            imgSource = yellowCardImg;
        } else if (matchState) {
            imgSource = null;
            textColor = FinalMatchColor;
            if(data.eventState === '9'){
                text = "完场";
            }else if(data.eventState === '3'){
                text = "中场"
            }else{
                text ='';
            }

        } else {
            imgSource = footballImg;
            textColor = MainColor;
        }
        return (
            <View style={styles.rightBox}>
                <ImageBackground style={styles.rightImage}
                       source={imgSource}
                       resizeMode="contain"
                >
                    <Text style={[ styles.rightText, { color : textColor }, (matchState ? { fontSize : 12 } : { fontSize : 9 }) ]}>{text}</Text>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container : {
        position : 'absolute',
        left : 0,
        right : 0,
        alignItems : 'center',
        justifyContent : 'center',
    },
    content : {
        flexDirection : 'row',
        backgroundColor : 'white',
        opacity : OPACITY,
        borderRadius : 6,
        height : 65,
        width : 310,
        borderColor : '#e5e5e5',
        borderWidth : 1,
        alignItems : 'center',
    },
    leftBox : {
        flex : 1,
        borderTopLeftRadius : 6,
        borderBottomLeftRadius : 6,
        overflow : 'hidden'
    },
    leftBackGroundImage : {
        height : 64,
        width : 62,
        alignItems : 'flex-start',
        justifyContent : 'center'
    },
    leftText : {
        backgroundColor : '#DE1D30',
        color : '#FFFFFF',
        fontSize : 10,
        fontFamily : 'PingFangSC-Regular',
        paddingLeft : 5
    },
    midBox : {
        flexDirection : 'row',
        flex : 2,
        alignItems : 'center',
        justifyContent : 'center'
    },
    midText : {
        fontSize : 14,
        fontFamily : 'PingFang-SC-Medium',
    },
    rightBox : {
        flex : 1,
        alignItems : 'center'
    },
    rightImage : {
        height : 42,
        width : 42,
        alignItems : 'center',
        justifyContent : 'center'
    },
    rightText : {
        fontFamily : 'PingFangSC-Semibold',
        backgroundColor : 'rgba(255, 255, 255, 0)'
    }
})