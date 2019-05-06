/**
 * Created by mac-ddt on 2018/8/23.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Swiper from 'react-native-swiper';
import {WIN_DRAW_WIN} from '../../../constants/MarketSort';
import {
    FONT_18,
    FONT_13,
    FONT_15,
    FONT_12,
    FONT_14
} from '../../../constants/fontSize';
import {
    MainColor,
    BgColorWhite,
    BorderColor,
    DarkerBorderColor,
    awayIconColor,
    upColor,
    downColor,
    flatColor,
    homeIconColor,
    contentText
} from '../../../constants/color';

const s_w = Dimensions.get('window').width;

export default class FocusEvent extends Component {
    static defaultProps = {
        focusMarkets: [] //焦点赛事
    };

    /**
     * 更多焦点赛事按钮事件
     */
    moreButton(rootName) {
        const {focusMarkets} = this.props;
        if(focusMarkets.length > 0) {
            this.props.navigation.navigate(rootName, {isFocusEvent: true});
        }
    }

    renderListTitle(listObj) {
        return (
            <View style={styles.ListTitle}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.ListTitleLine}/>
                    <Text style={styles.ListTitleText}>
                        {listObj.name}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.moreBtnBox}
                    onPress={() => this.moreButton(listObj.rootName)}
                >
                    <Text style={styles.moreBtnText}>更多</Text>
                    <Image style={styles.moreBtnImage}
                           source={require('../images/icon_more.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 分析，赔率，资讯，按钮的跳转事件
     * @param obj
     * @param event
     */
    otherButtonHandle(obj, event) {
        let {rootName, initPageId, secondLevelPageId} = obj;
        this.props.navigation.navigate(rootName, {
            initPageId,
            secondLevelPageId,
            vid: event.vid,
            homeName: event.homeShortName,
            awayName: event.awayShortName,
            vsDate: event.vsDate
        });
    }

    /**
     * 判断当前赔率该显示的颜色
     * @param num  0=>为不变 1=>上升  -0 => 下降
     * @returns {string}
     */
    colorShow(num) {
        let color = flatColor;
        switch (num) {
            case "1":
                color = upColor;
                break;
            case "-1":
                color = downColor;
                break;
        }
        return color;
    }

    /**
     *  焦点赛事的赔率展示框 render
     * @param odd
     * @param index
     * @returns {*}
     */
    renderOddsBtn(odd, index) {
        return (
            <View style={[styles.teamTitle, !odd.name && styles.vs]} key={index}>
                {
                    odd.name ? (
                        <View style={{flexDirection: 'row', alignItems:'center'}}>
                            {
                                odd.type === '胜' &&
                                <Text style={styles.homeIcon}>
                                    [主]
                                </Text>
                            }
                            <Text style={{fontSize: FONT_15, color: contentText}}>
                                {odd.name}
                            </Text>
                            {
                                odd.type === '负' &&
                                <Text style={styles.awayIcon}>
                                    [客]
                                </Text>
                            }
                        </View>
                    ) : (
                        <View style={{flexDirection: 'row'}}>
                            <Image style={styles.vsImage}
                                   source={require('../images/VS.png')}/>
                        </View>
                    )
                }
                <View style={{alignItems: 'center'}}>
                    {
                        odd.oddNum ?
                            <View style={styles.rowHCenter}>
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={styles.oddsName}>{odd.type}</Text>
                                </View>
                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={[styles.oddsNum, {color: this.colorShow(odd.trend)}]}>{odd.oddNum}</Text>
                                </View>
                            </View> :
                            <Text style={styles.oddsName}>--</Text>
                    }
                </View>
            </View>
        )
    }

    renderEventBanner() {
        const {focusMarkets, hasMakert} = this.props;
        let btn = [
            {title: '亚指', rootName: 'ScoreDetails', initPageId: 2, secondLevelPageId: 0},
            {title: '欧指', rootName: 'ScoreDetails', initPageId: 2, secondLevelPageId: 1},
            {title: '资讯', rootName: 'ScoreDetails', initPageId: 3, secondLevelPageId: false}
        ];
        let oddCfg = [];

        return (
            <View style={styles.swiperBox}>
                {
                    hasMakert ?
                        <Swiper height={160}
                                width={s_w}
                                horizontal={true}
                                dot={<View style={styles.dotStyle}/>}
                                activeDot={<View style={[styles.dotStyle, styles.activeDot]}/>}
                                paginationStyle={{bottom: 3}}>
                            {focusMarkets.map((event, index) => {
                                let market = event.markets[WIN_DRAW_WIN];
                                oddCfg = [
                                    {
                                        name: event.homeShortName,
                                        oddNum: market && market.homeOdds,
                                        trend: market && market.homeTrend,
                                        type: '胜'
                                    },
                                    {
                                        name: false,
                                        oddNum: market && market.drawOdds,
                                        trend: market && market.drawTrend,
                                        type: '平'
                                    },
                                    {
                                        name: event.awayShortName,
                                        oddNum: market && market.awayOdds,
                                        trend: market && market.awayTrend,
                                        type: '负'
                                    }
                                ];
                                return (
                                    <View style={styles.eventList} key={index}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Text style={styles.lianSaiName}>
                                                {event.leagueShortName}
                                            </Text>
                                            <Text style={styles.dateNum}>
                                                {event.raceCourse}
                                            </Text>
                                        </View>
                                        <View style={styles.outComeBtns}>
                                            {
                                                oddCfg.map((odd, index) => this.renderOddsBtn(odd, index))
                                            }
                                        </View>
                                        <View style={styles.otherBtnBox}>
                                            {btn.map((bt, index_2) => {
                                                return (
                                                    <TouchableOpacity
                                                        style={[styles.saiShiBtn, index_2 === 1 && styles.saiShiBtnCenter]}
                                                        onPress={() => this.otherButtonHandle(bt, event)}
                                                        key={index_2}>
                                                        <Text style={{
                                                            color: '#ffffff',
                                                            fontSize: FONT_14
                                                        }}>{bt.title}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </View>
                                );
                            })}
                        </Swiper> : <Text style={styles.noMarketTip}>暂无赛事</Text>
                }
                {
                    focusMarkets.length === 1 && <View style={styles.oneMarkets}/>
                }
            </View>
        )
    }

    render() {
        let listObj = {
            name: '焦点赛事',
            rootName: 'MatchList'
        };

        return (
            <View style={styles.focusEvent}>
                {this.renderListTitle(listObj)}
                {this.renderEventBanner()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    swiperBox: {
        height: 160,
        width: s_w,
        alignItems: 'center'
    },
    ListTitle: {
        flexDirection: 'row',
        backgroundColor: BgColorWhite,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderColor: BorderColor,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ListTitleLine: {
        width: 3,
        height: 17,
        backgroundColor: MainColor,
        marginRight: 8
    },
    ListTitleText: {
        color: contentText,
        fontSize: FONT_18
    },
    rowHCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    moreBtnBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    moreBtnText: {
        color: '#aaaaaa',
        fontSize: FONT_14
    },
    moreBtnImage: {
        width: 12,
        height: 12,
        resizeMode: 'contain'
    },
    dotStyle: {
        backgroundColor: '#ededed',
        width: 16,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 6,
        marginVertical: 6
    },
    activeDot: {
        backgroundColor: MainColor
    },
    oneMarkets: {
        alignItems: 'center',
        width: 16,
        height: 4,
        marginBottom: 8,
        borderRadius: 2,
        backgroundColor: MainColor
    },
    lianSaiName: {
        color: '#003F94',
        fontSize: FONT_14,
        marginRight: 10
    },
    dateNum: {
        color: '#666666',
        fontSize: FONT_14
    },
    homeIcon: {
        color: homeIconColor,
        fontSize: FONT_13,
        lineHeight: 15,
        marginRight: 6
    },
    awayIcon: {
        color: awayIconColor,
        fontSize: FONT_13,
        lineHeight: 15,
        marginLeft: 6
    },
    outComeBtns: {
        flexDirection: 'row',
        height: 48,
        marginTop: 10,
        marginBottom: 5,
        justifyContent: 'center'
    },
    vsImage: {
        width: 18,
        height: 12
    },
    oddsName: {
        fontSize: FONT_12,
        color: contentText,
        marginRight: 6
    },
    oddsNum: {
        fontSize: FONT_12,
        color: '#777777'
    },
    eventList: {
        paddingTop: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: BorderColor
    },
    teamTitle: {
        padding: 5,
        flex: 5,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        borderColor: DarkerBorderColor,
        justifyContent: 'space-between'
    },
    vs: {
        flex: 3,
        paddingTop: 8,
        marginHorizontal: 20
    },
    saiShiBtn: {
        width: 78,
        height: 30,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MainColor
    },
    saiShiBtnCenter: {
        marginHorizontal: 30
    },
    focusEvent: {
        backgroundColor: BgColorWhite,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: BorderColor
    },
    otherBtnBox: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    noMarketTip: {
        fontSize: 20,
        lineHeight: 158,
        color: '#777777'
    }
});