/**
 * Created by easyLottoMac_Feng on 2018/12/10.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {connectReducerComponent} from '~/reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '~/constants/storeKeys'
import {FONT_14, FONT_12} from "~/constants/fontSize";
import {
    contentText,
    BorderColor,
    MainColor,
    tipsTextGrey,
    FinalMatchColor
} from "~/constants/color";

class PeerReview extends Component {

    componentWillMount() {
        this.props.getPeerReviewData();
    }

    /**
     * 渲染头部提示语
     * @private
     */
    _renderHeader() {
        return (
            <View style={styles.tipsBox}>
                <Text style={styles.tipsTextBox}>
                    * 此页面只显示距今最近进行的7天赛事数据，需查看更多或精确查询，请点击右上按钮进行条件筛选。
                </Text>
            </View>
        )
    }

    /**
     * 渲染赔率模块
     * @returns {*}
     */
    renderOdds(item) {
        let resultArr = [
            {text: '胜', odd: item.win},
            {text: '平', odd: item.draw},
            {text: '负', odd: item.defeat}
        ];
        return (
            <View style={styles.oddsSty}>
                {
                    resultArr.map((re, index) => {
                        return (
                            <View key={index} style={[styles.oddsTextSty]}>
                                <Text style={styles.wdwTextSty}>{re.text}</Text>
                                <Text style={{fontSize: FONT_14, color: contentText}}>{re.odd}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    /**
     * 渲染赛事变化状态
     * @param status
     * @returns {*}
     */
    renderStatus(status) {
        let text = status === 'true' ? '最终' : '变化中';
        return (
            <View style={styles.listStatus}>
                <Text style={[
                    styles.statusFontSize,
                    {color: status === 'true' ? '#DA0303' : '#0EB80E'}
                ]}>
                    {text}
                </Text>
            </View>
        )
    }

    /**
     * list 的左边模块
     * @returns {*}
     */
    renderLeftView(item) {
        let defaultDate = Date.prototype.parseISO8601(item.vsDate);
        let dateStr = defaultDate.format('yy-MM-dd');
        let timeStr = defaultDate.format('hh:mm:ss');
        return (
            <View style={{flex: 154}}>
                <View style={styles.listLeftTop}>
                    <View style={styles.leagueSty}>
                        <Text style={styles.leagueNameSty}>{item.leagueShortName}</Text>
                        {
                            item.dgStatus === '1' &&
                            <Image style={styles.singleIcon}
                                   source={require('../images/singleIcon.png')}/>
                        }
                    </View>
                    <View style={styles.listTeamBox}>
                        <Text style={styles.listHomeName}>{item.homeShortName}</Text>
                        <Text style={styles.listScore}>{item.homeScore}-{item.awayScore}</Text>
                        <Text style={styles.listAwayName}>{item.awayShortName}</Text>
                    </View>
                </View>
                <View style={styles.listLeftBottom}>
                    <View style={styles.listDate}>
                        <Text style={styles.listDateText}>{dateStr}</Text>
                        <Text style={styles.listDateText}>{timeStr}</Text>
                    </View>
                    {this.renderOdds(item)}
                    {this.renderStatus(item.inEnd)}
                </View>
            </View>
        )
    }

    /**
     * 同奖回查详情页
     */
    peerReviewHandle(item) {
        this.props.navigation.navigate('PeerReviewDetails', {item})
    }

    /**
     * 渲染列表
     * @private
     */
    _renderItem(item, index) {
        let col = !(index % 2) ? '#ffffff' : '#fafafa';
        return (
            <View style={[
                styles.listViewBox,
                {backgroundColor: col}
            ]}>
                {this.renderLeftView(item)}
                <View style={styles.listViewRight}>
                    <TouchableOpacity
                        style={styles.handleSty}
                        onPress={() => this.peerReviewHandle(item)}>
                        <Text style={styles.handleTextSty}>
                            同奖
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * 渲染底部提示语
     * @private
     */
    _renderFooter() {
        return (
            <View style={styles.footerTipsSty}>
                <Text style={styles.tipsTextBox}>
                    注：“相同(相似)奖金赛果历史查询”功能，主要用途是搜索历史上与当前竞猜的场次奖金相同
                    (三项奖金完全相同)或相似(三项奖金部分相同)的比赛，通过参考历史比赛的结果统计，对当前投注提供依据。
                </Text>
            </View>
        )
    }

    /**
     * 页面滚动事件
     * @private
     */
    _scrollHandle(eNative) {

    }

    render() {
        const {showFlatListData} = this.props;
        return (
            <FlatList
                style={{backgroundColor: '#F6F6F6'}}
                data={showFlatListData}
                extraData={showFlatListData}
                keyExtractor={(item, index) => index + ''}
                ListHeaderComponent={() => this._renderHeader()}
                renderItem={({item, index}) => this._renderItem(item, index)}
                ListFooterComponent={() => this._renderFooter()}
                onScroll={(e) => this._scrollHandle(e.nativeEvent)}/>
        )
    }

}

const styles = StyleSheet.create({
    listViewBox: {
        borderColor: BorderColor,
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 70
    },
    listLeftTop: {
        height: 34,
        borderColor: BorderColor,
        borderBottomWidth: 1,
        flexDirection: 'row',
        backgroundColor: '#F2F2F2'
    },
    leagueSty: {
        flex: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    leagueNameSty: {
        fontSize: FONT_14,
        color: contentText
    },
    listTeamBox: {
        flex: 119,
        flexDirection: 'row',
        alignItems: 'center'
    },
    listHomeName: {
        flex: 101,
        textAlign: 'right',
        fontSize: FONT_14,
        color: contentText
    },
    listScore: {
        flex: 36,
        textAlign: 'center',
        color: FinalMatchColor,
        fontSize: FONT_14
    },
    listAwayName: {
        flex: 101,
        fontSize: FONT_14,
        color: contentText
    },
    listLeftBottom: {
        height: 34,
        flexDirection: 'row'
    },
    listDate: {
        flex: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listDateText: {
        fontSize: FONT_12,
        textAlign: 'center',
        color: contentText
    },
    listStatus: {
        flex: 26,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusFontSize: {
        fontSize: FONT_14
    },
    handleSty: {
        padding: 6,
        backgroundColor: MainColor,
        borderRadius: 2
    },
    handleTextSty: {
        color: '#ffffff',
        fontSize: FONT_14
    },
    oddsSty: {
        flex: 93,
        borderColor: BorderColor,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    oddsTextSty: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listViewRight: {
        flex: 29,
        borderColor: BorderColor,
        borderLeftWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wdwTextSty: {
        color: tipsTextGrey,
        fontSize: FONT_14,
        marginRight: 2
    },
    tipsBox: {
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    tipsTextBox: {
        color: tipsTextGrey,
        fontSize: FONT_12
    },
    footerTipsSty: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderColor: BorderColor,
        borderTopWidth: 1
    },
    singleIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 14,
        height: 16
    }
});

export default connectReducerComponent(storeKey.PEER_REVIEW_STORE, reducer, state, action)(PeerReview);