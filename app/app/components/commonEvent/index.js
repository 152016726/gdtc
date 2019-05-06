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
import BetWDW from '../../components/betWDW'
import TotalGoals from '../../components/totalGoals'
import MixPass from '../../components/mixPass'
import HFTandCS from '../../components/HFTandCS'
import EventSummary from './eventSummary';
import * as CommonColor from '../../constants/color'

let disTop = 0;
const _minShowIndex = 2;    // 最初加载多少个组件
const _stepLoadTime = 300;  // 间隔加载时间

export default class RaceCourseLeft extends Component {

    state = {
        isShow: false,
        isMore: false           // 控制显示展示更多样式
    };

    static defaultProps = {
        event: {},              // 比赛对象
        isLast: false,          // 是否最后一个
        sort: '',               // 对应玩法
        currentKey: ''          // 当前操作key
    };

    renderTimeout = null;       // 内部指定定时器

    componentWillMount() {
        const {index} = this.props;
        let step = Math.floor(index/_minShowIndex);
        if(index < _minShowIndex){
            this.setState({
                isShow: true
            });
        }else{
            this.renderTimeout = setTimeout(() => {
                this.setState({
                    isShow: true
                }, ()=>{
                    this.renderTimeout = null;
                });
            }, step * _stepLoadTime);
        }
    }

    componentWillUnmount() {
        this.renderTimeout && clearTimeout(this.renderTimeout);
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
        const {sort, index, event, outcomeCount, currentKey} = this.props;
        ///根据选择玩法渲染不同玩法组件
        switch (sort) {
            case 'wdw':
            case 'hwdw':
                return (<BetWDW key={index} event={event} sort={sort} outcomeCount={outcomeCount} currentKey={currentKey}/>);
            case 'tg':
                disTop = 15;
                return (<TotalGoals event={event} outcomeCount={outcomeCount} currentKey={currentKey}/>);
            case 'mix':
                disTop = 15;
                return (<MixPass event={event} outcomeCount={outcomeCount} currentKey={currentKey}/>);
            case 'dg':
                disTop = 15;
                return (<MixPass event={event} isSingle={true} outcomeCount={outcomeCount} currentKey={currentKey}/>);
            case 'cs':
                return (<HFTandCS event={event} sort={sort} text="点击展开比分选项" outcomeCount={outcomeCount} currentKey={currentKey}/>);
            case 'hft':
                return (<HFTandCS event={event} sort={sort} text="点击展开半全场选项" outcomeCount={outcomeCount} currentKey={currentKey}/>);
            default:
                break;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.currentKey !== '' && nextProps.currentKey !== this.props.currentKey){
            let nextKey = nextProps.currentKey;
            let {event} = this.props;
            return nextKey.indexOf(event.vid + '#') !== -1;
        }else{
            return true;
        }
    }

    render() {
        const {event, isLast, handleDirectDetail, outcomeCount} = this.props;
        const {isMore, isShow} = this.state;
        let defaultSingle = event.dgStatus === '1';
        let homeOdds = '';
        let drawOdds = '';
        let awayOdds = '';

        if(event.oddsInfo && event.oddsInfo.length > 0 && event.oddsInfo[0].avgEuropeanOdds){
            homeOdds = event.oddsInfo[0].avgEuropeanOdds.homeOdds || '';
            drawOdds = event.oddsInfo[0].avgEuropeanOdds.drawOdds || '';
            awayOdds = event.oddsInfo[0].avgEuropeanOdds.awayOdds || '';
        }

        return (
            <View style={[styles.container, isLast ? styles.noBorderBottom : styles.haveBorderBottom]}>
                <TouchableOpacity style={styles.evtContainer} onPress={this.showMoreBtn.bind(this)} activeOpacity={1}>
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
                                {event.vsDateFmt}
                            </Text>
                        </View>
                        <View style={styles.imgCt}>
                            <Image source={require('./images/moreIcon.png')}
                                   style={[styles.img, !isMore && styles.noMoreImg]}/>
                        </View>
                    </View>
                    <View style={styles.rightSide}>
                        {isShow && this.renderOutcomeGroup()}
                    </View>
                </TouchableOpacity>
                {
                    isShow && isMore &&
                    <EventSummary
                        vid={event.vid}
                        homeOdds={homeOdds}
                        drawOdds={drawOdds}
                        awayOdds={awayOdds}
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
