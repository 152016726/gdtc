/**
 * Created by easyLottoMac_Feng on 2018/12/11.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    FlatList,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {connectReducerComponent} from '~/reduxCfg'
import reducer from './reducer'
import state from './state'
import action from './action'
import * as storeKey from '~/constants/storeKeys'
import {
    BgColorWhite,
    BorderColor,
    contentText,
    MainColor,
    tipsTextGrey,
    DarkerGreenColor,
    BlueColor,
    DarkerRedColor,
    FinalMatchColor
} from "~/constants/color";
import {
    FONT_14,
    FONT_12,
    FONT_13,
    FONT_15
} from "~/constants/fontSize";
import HeaderLeft from "~/components/headerLeft";

const _FONTFAMILY = 'PingFang-SC-Medium';           // 字体型号
const S_H = Dimensions.get('window').height;        // 页面高度

class PeerReviewDetails extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: <HeaderLeft handleGoBack={() => navigation.goBack()}
                                    img={require('../../../images/back.png')}/>,
            title: '同奖回查'
        }
    };

    componentWillMount() {
        const {getFlatList, navigation, updateData} = this.props;
        let {win, draw, defeat} = navigation.state.params.item;
        // 数据重置
        updateData({
            winOdds: win,
            flatOdds: draw,
            loseOdds: defeat,
            isSingle: false,
            isNoData: false,
            allFlatListData: []
        });
        let rspObj = Object.assign({}, win && {win}, draw && {draw}, defeat && {defeat});
        getFlatList(rspObj); // 数据请求
    }

    /**
     * 头部赛事提示
     * @returns {*}
     */
    renderTopTips() {
        const {winOdds, flatOdds, loseOdds, allFlatListData} = this.props;
        let marketLen = allFlatListData.length;            // 赛事数量
        let winLen = allFlatListData.filter(FL => {        // 主队胜的场数
            return FL.homeScore > FL.awayScore
        }).length;
        let flatLen = allFlatListData.filter(FL => {       // 主队平的场数
            return FL.homeScore === FL.awayScore
        }).length;
        let loseLen = allFlatListData.filter(FL => {       // 主队输的场数
            return FL.homeScore < FL.awayScore
        }).length;
        return (
            <View style={styles.topTipsSty}>
                <View style={{flex: 1}}>
                    <Text style={styles.topLeftTextSty}>
                        胜{winOdds || '--'} 平{flatOdds || '--'} 负{loseOdds || '--'}
                    </Text>
                </View>
                <View style={styles.topRightTipsBox}>
                    <Text style={styles.tipsTwenty}>近{marketLen}场 主队 </Text>
                    <Text style={styles.homeWinSty}>{winLen}胜</Text>
                    <Text style={styles.dropSty}>{flatLen}平</Text>
                    <Text style={styles.awayWinSty}>{loseLen}负</Text>
                </View>
            </View>
        )
    }

    /**
     * 列表头部展示
     */
    _renderHeader() {
        return (
            <View style={styles.itemHeaderSty}>
                <Text style={[styles.PRDRow_1, styles.TextCenter]}>赛事</Text>
                <Text style={[styles.PRDRow_2, styles.TextCenter]}>时间</Text>
                <Text style={[styles.PRDRow_3, styles.TextCenter]}>对阵</Text>
                <Text style={[styles.PRDRow_4, styles.TextCenter]}>奖金变化</Text>
            </View>
        )
    }

    _renderItem(item, index) {
        let defaultDate = Date.prototype.parseISO8601(item.vsDate);
        let dateStr = defaultDate.format('yy-MM-dd');
        let timeStr = defaultDate.format('hh:mm:ss');
        return (
            <View style={[
                styles.renderItemSty,
                {backgroundColor: !(index % 2) ? '#FFFFFF' : '#FBFBFB'}
            ]}>
                <View style={[
                    styles.PRDRow_1,
                    styles.centerShow,
                    {position: 'relative'}]}>
                    <Text style={{color: contentText}}>
                        {item.leagueShortName}
                    </Text>
                    {
                        item.dgStatus === '1' && <Image style={styles.singleIcon}
                                                        source={require('../images/singleIcon.png')}/>
                    }
                </View>
                <View style={[styles.PRDRow_2, styles.centerShow]}>
                    <Text style={styles.dateText}>{dateStr}</Text>
                    <Text style={styles.dateText}>{timeStr}</Text>
                </View>
                <View style={[
                    styles.PRDRow_3,
                    styles.centerShow,
                    {flexDirection: 'row'}
                ]}>
                    <Text style={styles.homeNameSty}>{item.homeShortName}</Text>
                    <Text style={styles.scoreSty}>{item.homeScore}-{item.awayScore}</Text>
                    <Text style={styles.awayNameSty}>{item.awayShortName}</Text>
                </View>
                <View style={[styles.PRDRow_4, styles.centerShow]}>
                    <Text style={{color: item.inEnd === 'true' ? '#DA0303' : '#0EB80E'}}>
                        {item.inEnd === 'true' ? '最终' : '进行'}
                    </Text>
                </View>
            </View>
        )
    }

    /**
     * 脚部渲染
     * @returns {*}
     */
    renderFooter() {
        return (
            <View style={styles.footerTipsSty}>
                <Text style={styles.tipsTextBox}>
                    注：“相同(相似)奖金赛果历史查询”功能，
                    主要用途是搜索历史上与当前竞猜的场次奖金相同(三项奖金完全相同)或相似(三项奖金部分相同)的比赛，
                    通过参考历史比赛的结果统计，对当前投注提供依据。
                </Text>
            </View>
        )
    }

    render() {
        const {allFlatListData, singleSelectHandle, isSingle, onScrollHandle, isNoData} = this.props;
        return (
            <ScrollView
                style={{backgroundColor: '#F6F6F6', flex: 1}}
                alwaysBounceVertical={false}
                onScroll={(e) => onScrollHandle(e.nativeEvent)}
                scrollEventThrottle={1}>
                {this.renderTopTips()}
                <View style={styles.selectBtnBox}>
                    <View>
                        <Text style={{fontSize: FONT_15, color: contentText}}>回查结果</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <TouchableOpacity
                            onPress={() => singleSelectHandle()}>
                            <Text style={[
                                styles.selectBtnStyText,
                                isSingle && styles.activeSelectBtnText
                            ]}>单固</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this._renderHeader()}
                {
                    isNoData ?
                        <View style={styles.noDataSty}>
                            <View style={styles.noDataBoxSty}>
                                <Text style={styles.noDataTextSty}> 暂无数据 </Text>
                            </View>
                            <View style={styles.noDataBoxSty}>
                                {this.renderFooter()}
                            </View>
                        </View> :
                        <FlatList
                            data={allFlatListData}
                            alwaysBounceVertical={false}
                            extraData={allFlatListData}
                            keyExtractor={(item, index) => index + ''}
                            renderItem={({item, index}) => this._renderItem(item, index)}
                            ListFooterComponent={() => this.renderFooter()}
                        />
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    topTipsSty: {
        height: 40,
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center',
        backgroundColor: BgColorWhite
    },
    topRightTipsBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    topLeftTextSty: {
        color: '#2D2D2D',
        fontSize: FONT_15
    },
    tipsTwenty: {
        color: '#2D2D2D',
        fontSize: FONT_13,
        paddingVertical: 2
    },
    homeWinSty: {
        color: DarkerRedColor,
        fontSize: FONT_15,
        fontFamily: _FONTFAMILY
    },
    dropSty: {
        color: BlueColor,
        fontSize: FONT_15,
        fontFamily: _FONTFAMILY
    },
    awayWinSty: {
        color: DarkerGreenColor,
        fontSize: FONT_15,
        fontFamily: _FONTFAMILY
    },
    selectBtnBox: {
        height: 40,
        paddingHorizontal: 12,
        backgroundColor: '#F5F5F5',
        borderColor: BorderColor,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectBtnStyText: {
        width: 50,
        height: 26,
        textAlign: 'center',
        lineHeight: 24,
        borderColor: BorderColor,
        fontSize: FONT_15,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        color: tipsTextGrey,
        fontFamily: _FONTFAMILY
    },
    activeSelectBtnText: {
        borderColor: MainColor,
        backgroundColor: MainColor,
        color: '#ffffff'
    },
    PRDRow_1: {
        flex: 30,
        color: contentText,
        fontFamily: _FONTFAMILY
    },
    PRDRow_2: {
        flex: 32,
        color: contentText,
        fontFamily: _FONTFAMILY
    },
    PRDRow_3: {
        flex: 88,
        color: contentText,
        fontFamily: _FONTFAMILY
    },
    PRDRow_4: {
        flex: 30,
        color: contentText,
        fontFamily: _FONTFAMILY
    },
    TextCenter: {
        textAlign: 'center'
    },
    renderItemSty: {
        flexDirection: 'row',
        height: 40,
        borderColor: BorderColor,
        borderBottomWidth: 1
    },
    dateText: {
        color: contentText,
        fontSize: FONT_12,
        fontFamily: _FONTFAMILY
    },
    homeNameSty: {
        flex: 10,
        textAlign: 'right',
        fontSize: FONT_14,
        color: contentText
    },
    awayNameSty: {
        flex: 10,
        color: contentText
    },
    scoreSty: {
        flex: 4,
        color: FinalMatchColor,
        textAlign: 'center'
    },
    centerShow: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemHeaderSty: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAE6BE'
    },
    tipsTextBox: {
        color: tipsTextGrey,
        fontSize: FONT_12,
        fontFamily: _FONTFAMILY
    },
    footerTipsSty: {
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    singleIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 14,
        height: 16
    },
    noDataSty: {
        height: S_H - 176,
        alignItems: 'center'
    },
    noDataTextSty: {
        color: tipsTextGrey
    },
    noDataBoxSty: {
        flex: 1,
        justifyContent: 'flex-end'
    }

});

export default connectReducerComponent(storeKey.PEER_REVIEW_DETAILS_STORE, reducer, state, action)(PeerReviewDetails);