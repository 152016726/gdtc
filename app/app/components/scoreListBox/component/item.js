/**
 * Created by oWEn on 2018/8/27.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image
} from 'react-native';
import * as colorConf from '../../../constants/color'
import MarketSort from '../../../constants/MarketSort'
import * as EventState from '../../../constants/eventState'

let _arrWeekCn = [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六',
];

let arrType = [MarketSort.WIN_DRAW_WIN, MarketSort.HANDICAP_WIN_DRAW_WIN, MarketSort.CORRECT_SCORES, MarketSort.TOTAL_GOALS, MarketSort.HALF_FULL_TIME];
let arrAbnormal = [EventState.CANCEL_MATCH, EventState.BREAK_OFF, EventState.UNDETERMINED, EventState.PUT_OFF, EventState.CUTTING_MATCH];

let arrTypeCn = ['胜平负', '让球胜平负', '比分', '总进球数', '半全场']; //该变量和平常的不同，暂时固定

const _minShowIndex = 5;    // 最初加载多少个组件
const _stepLoadTime = 300;  // 间隔加载时间

class ScoreListItemRow extends Component {
    state = {
        isShow: false
    };

    renderTimeout = null;       // 内部指定定时器

    componentWillMount() {
        const {index} = this.props;
        let step = Math.floor(index / _minShowIndex);
        if (index < _minShowIndex) {
            this.setState({
                isShow: true
            });
        } else {
            this.renderTimeout = setTimeout(() => {
                this.setState({
                    isShow: true
                }, () => {
                    this.renderTimeout = null;
                });
            }, step * _stepLoadTime);
        }
    }

    componentWillUnmount() {
        this.renderTimeout && clearTimeout(this.renderTimeout);
    }

    getSortDate(date) {
        return Date.prototype.parseISO8601(date).format('MM-dd hh:mm');
    }

    getCompleteNo(completeNo) {
        let weekCode = parseInt(completeNo.substr(completeNo.length - 4, 1), 10);    // 赛事所属周几
        let week = _arrWeekCn[weekCode];
        return week + completeNo.substr(-3);
    }

    getRSStyle(data) {
        let homeScore = parseInt(data.homeScore);
        let awayScore = parseInt(data.awayScore);
        if (data.eventState == EventState.PUT_OFF) {
            return styles.colorGray;
        }
        else if (homeScore > awayScore) {   //胜
            return styles.colorRed;
        }
        else if (homeScore === awayScore) { //平
            return styles.colorBlue;
        }
        else {                              //负
            return styles.colorGreen;
        }
    }

    /**
     * 检查赔率是否大于5
     */
    checkOdds(odds) {
        odds = parseFloat(odds);
        if (isNaN(odds) || odds < 5) {
            return false;
        }
        else {
            return true;
        }
    }

    getOddsStr(odds, eventState) {
        if (odds === '0.00' || arrAbnormal.indexOf(eventState) !== -1) {
            return '--';
        }
        else {
            return odds;
        }
    }

    getScore(data, halfTime) {
        let home = halfTime ? data.homeHalfScore : data.homeScore;
        let away = halfTime ? data.awayHalfScore : data.awayScore;
        if (data.eventState == EventState.PUT_OFF) {
            return '--';
        }
        return `${home}:${away}`;
    }

    render() {
        let {data, index} = this.props;
        let {isShow} = this.state;
        return (
            isShow && <View style={[styles.item, index % 2 === 1 && styles.oddsItem]}>
                <View style={[styles.itemInner]}>
                    {
                        data.dgStatus == 1 &&
                        <View style={styles.dg}>
                            <Image source={require('../../commonEvent/images/singleIcon.png')}
                                   style={{width: 16, height: 19}}/>
                        </View>
                    }
                    {
                        data.eventState == EventState.PUT_OFF &&
                        <View style={styles.delay}>
                            <Image source={require('../images/delay.png')}
                                   style={{width: 43, height: 35}}/>
                        </View>
                    }
                    <View style={[styles.top, styles.borderBottom]}>
                        <View style={styles.matchInfo}>
                            <Text
                                style={[styles.smallFont, styles.matchInfoText]}>{this.getSortDate(data.vsDate)}</Text>
                            <Text
                                style={[styles.smallFont, styles.matchInfoText]}>{this.getCompleteNo(data.completeNo)}</Text>
                            <Text style={[styles.smallFont, styles.matchInfoText]}>{data.leagueShortName}</Text>
                        </View>
                        <View style={styles.team}>
                            <Text
                                style={[styles.teamTextLineHeight, styles.teamText, styles.teamTextHome]}>{data.homeShortName}</Text>
                            <View style={styles.halfScore}/>
                        </View>
                        <View style={styles.scoreInfo}>
                            <Text
                                style={[styles.teamTextLineHeight, styles.scoreText, this.getRSStyle(data)]}>{this.getScore(data)}</Text>
                            <View style={styles.halfScore}>
                                <Text style={styles.smallFont}>{`半场 ${this.getScore(data, true)}`}</Text>
                            </View>
                        </View>
                        <View style={styles.team}>
                            <Text
                                style={[styles.teamTextLineHeight, styles.teamText, styles.teamTextAway]}>{data.awayShortName}</Text>
                            <View style={styles.halfScore}/>
                        </View>
                    </View>
                    <View style={[styles.bottom, styles.borderBottom, styles.borderLeft]}>
                        {
                            arrType.map((ele, index) => <View
                                    style={[styles.odds]}
                                    key={index}>
                                    <View style={[styles.oddsTop, styles.borderBottom]}>
                                        <Text style={[styles.teamText, styles.oddsTopText]}>{arrTypeCn[index]}</Text>
                                    </View>
                                    <View style={[styles.oddsBottom]}>
                                        <Text style={[styles.teamText, styles.oddsBottomText]}>
                                            {
                                                ele === MarketSort.HANDICAP_WIN_DRAW_WIN && `(${data.handicap})`
                                            }
                                            {
                                                data[`${ele}ResultText`]
                                            }
                                        </Text>
                                        <Text
                                            style={[styles.oddText, this.checkOdds(data[ele]) ? styles.colorCold : null]}>
                                            {
                                                this.getOddsStr(data[ele], data.eventState)
                                            }
                                        </Text>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
            </View>
        );
    }
}

export default class ScoreListBoxItem extends Component {
    render() {
        const {data, navHandle} = this.props;
        return (
            <View>
                {
                    data.map((ele, index) => <ScoreListItemRow index={index} key={index} data={ele}
                                                               navHandle={navHandle}/>)
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    oddsItem: {
        backgroundColor: '#faf9f7'
    },
    item: {
        position: 'relative',
        backgroundColor: '#ffffff'
    },
    itemInner: {
        paddingHorizontal: 12,
        paddingBottom: 12
    },
    dg: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    delay: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    top: {
        flexDirection: 'row',
        paddingTop: 9,
        paddingBottom: 7
    },
    matchInfo: {
        flex: 1.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallFont: {
        fontSize: 12,
        color: '#666666',
        backgroundColor: 'transparent'
    },
    scoreInfo: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    team: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    teamTextLineHeight: {
        lineHeight: 30
    },
    halfScore: {
        height: 20
    },
    teamText: {
        fontSize: 15,
        color: '#333333',
        backgroundColor: 'transparent'
    },
    oddsBottomText: {
        height: 18,
        lineHeight: 18
    },
    matchInfoText: {
        marginVertical: 2
    },
    oddText: {
        marginTop: 6,
        fontSize: 14,
        color: '#666666',
        height: 18,
        lineHeight: 18,
        backgroundColor: 'transparent'
    },
    fontBold: {
        fontWeight: '900'
    },
    bottom: {
        flexDirection: 'row'
    },
    odds: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: colorConf.awardBorederColor,
        borderStyle: 'solid'
    },
    oddsTop: {
        height: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    oddsBottom: {
        height: 55,
        alignItems: 'center',
        justifyContent: 'center'
    },
    oddsTopText: {
        color: '#999999',
        fontSize: 13
    },
    borderLeft: {
        borderLeftWidth: 1,
        borderLeftColor: colorConf.awardBorederColor,
        borderStyle: 'solid'
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colorConf.awardBorederColor,
        borderStyle: 'solid'
    },
    NoBorderRight: {
        borderRightWidth: 0
    },
    arrowImage: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 12,
        top: '50%',
        marginTop: -12
    },
    scoreText: {
        backgroundColor: 'transparent',
        fontWeight: '900',
        fontSize: 20
    },
    colorGray: {
        color: '#666666'
    },
    colorRed: {
        color: colorConf.DarkerRedColor
    },
    colorBlue: {
        color: colorConf.BlueColor
    },
    colorGreen: {
        color: colorConf.DarkerGreenColor
    },
    colorCold: {
        color: '#2e59e6'
    },
    teamTextHome: {
        paddingLeft: 4
    },
    teamTextAway: {
        paddingRight: 4
    }
});