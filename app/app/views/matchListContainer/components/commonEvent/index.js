/**
 * Created by mac-ddt on 2018/9/3.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';
import BetWDW from '../betWDW'
import TotalGoals from '../totalGoals'
import MixPass from '../mixPass'
import HFTandCS from '../HFTandCS'
import EventSummary from './eventSummary';
import * as CommonColor from '~/constants/color';
import matchDataCenter from '#/matchDataCenter';
import Emitter from '@easylotto/emitter';

let disTop = 0;

export default class RaceCourseLeft extends Component {

    state = {
        currentKey: '',
        isMore: false           // 控制显示展示更多样式
    };

    static defaultProps = {
        index: -1,
        isHide: false,          // 是否隐藏
        vid: '',                // 比赛vid
        isLast: false,          // 是否最后一个
        sort: '',               // 对应玩法
        currentKey: '',          // 当前操作key
        isFromExpert: false      //是否专家跳转过来
    };

    renderTimeout = null;       // 内部指定定时器
    reRenderFn = null;          // 强制渲染方法

    model = {};

    componentWillMount() {
        this.initModel();
        this.reRenderFn = this.reRender.bind(this);
        Emitter.global.on('event_update_' + this.props.vid, this.reRenderFn);
    }

    componentWillUnmount() {
        this.renderTimeout && clearTimeout(this.renderTimeout);
        this.reRenderFn && Emitter.global.off('event_update_' + this.props.vid, this.reRenderFn);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.vid !== this.props.vid){
            this.initModel(nextProps);
        }
    }

    reRender(currentKey) {
        this.setState({
            currentKey
        });
    }

    initModel(props) {
        let {vid} = (props || this.props);
        this.model.event = matchDataCenter.getEventObject(vid);
    }

    /**
     * 展示详情内容
     */
    showMoreBtn() {
        this.setState({
            isMore: !this.state.isMore
        });
    }

    /**
     * 根据但前 sort渲染不同玩法组件
     * @returns {*}
     */
    renderOutcomeGroup() {
        const {vid, sort, isFromExpert} = this.props;
        const {currentKey} = this.state;

        ///根据选择玩法渲染不同玩法组件
        switch (sort) {
            case 'wdw':
            case 'hwdw':
                return (<BetWDW vid={vid} sort={sort} currentKey={currentKey}/>);
            case 'tg':
                disTop = 15;
                return (<TotalGoals vid={vid} sort={sort} currentKey={currentKey} isFromExpert={isFromExpert}/>);
            case 'mix':
            case 'dg':
                disTop = 15;
                return (<MixPass vid={vid} sort={sort} currentKey={currentKey} isFromExpert={isFromExpert}/>);
            case 'cs':
                return (<HFTandCS vid={vid} sort={sort} text="点击展开比分选项" currentKey={currentKey}/>);
            case 'hft':
                return (<HFTandCS vid={vid} sort={sort} text="点击展开半全场选项" currentKey={currentKey}/>);
            default:
                break;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return nextState.currentKey !== this.state.currentKey ||
            nextProps.isHide !== this.props.isHide ||
            nextState.isMore !== this.state.isMore ||
            nextProps.sort !== this.props.sort;
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        // 判断选上注项后，是否需要重渲染
        if(nextProps.currentKey !== this.props.currentKey){
            if(nextProps.currentKey !== ''){
                let nextKey = nextProps.currentKey;
                let {event} = this.model;
                return nextKey.indexOf(event.vid + '#') !== -1;
            }else{
                return true;
            }
        } else {
            return nextProps.isHide !== this.props.isHide ||
                nextState.isMore !== this.state.isMore ||
                nextProps.sort !== this.props.sort;
        }
    }*/

    render() {
        const {isLast, isHide, handleDirectDetail} = this.props;
        const {isMore} = this.state;
        const {event} = this.model;
        let defaultSingle = event.dgStatus === '1';

        return (
            <View style={[styles.container, isLast ? styles.noBorderBottom : styles.haveBorderBottom, isHide && styles.hideContainer]}>
                <View style={styles.evtContainer}>
                    {
                        defaultSingle &&
                        <View style={styles.dg}>
                            <Image source={require('./images/singleIcon.png')}
                                   style={{width: 16, height: 19}}/>
                        </View>
                    }
                    <View style={styles.leftSide}>
                        <View style={styles.shortIntro}>
                            <Text style={styles.leagueName}>
                                {event.leagueShortName}
                            </Text>
                            <Text style={styles.weeks}>
                                {event.week}{event.number}
                            </Text>
                            <Text style={styles.dateTxt}>
                                {event.shortDate} {event.startTime}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.imgCt} activeOpacity={1} onPress={this.showMoreBtn.bind(this)}>
                            <Image source={require('./images/moreIcon.png')}
                                   style={[styles.img, !isMore && styles.noMoreImg]}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightSide}>
                        {
                            this.renderOutcomeGroup()
                        }
                    </View>
                </View>
                {
                    isMore &&
                    <EventSummary
                        vid={event.vid}
                        homeOdds={event.avgEurHomeOdds}
                        drawOdds={event.avgEurDrawOdds}
                        awayOdds={event.avgEurAwayOdds}
                        handleDirectDetail={handleDirectDetail.bind(this, event)}
                    />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: CommonColor.BgColor,
        borderBottomWidth: 1,
        borderColor: CommonColor.DarkerBorderColor
    },
    hideContainer: {
        position: 'absolute',
        top: -10000
    },
    evtContainer: {
        width: Dimensions.get('window').width,
        paddingVertical: 15,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    noBorderBottom: {
        borderBottomWidth: 0
    },
    haveBorderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: CommonColor.headerBorderColor
    },
    dg: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    shortIntro: {
        flex: 1,
        justifyContent: "flex-end",
        paddingTop: disTop
    },
    leagueName: {
        color: '#666666',
        textAlign: 'center',
        fontSize: 11,
        paddingBottom: 8
    },
    weeks: {
        color: '#666666',
        textAlign: 'center',
        fontSize: 10,
        paddingBottom: 8
    },
    imgCt: {
        alignItems: 'center'
    },
    img: {
        width: 13,
        height: 13
    },
    noMoreImg: {
        transform: [{rotate: '180deg'}]
    },
    dateTxt: {
        color: '#666666',
        textAlign: 'center',
        fontSize: 10,
        paddingBottom: 8
    },
    leftSide: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightSide: {
        flex: 5,
        justifyContent: 'flex-end'
    }
});
