/**
 * Created by easyLottoMac_Feng on 2018/12/5.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native';
import {BgColorWhite, BorderColor, contentText, tipsTextGrey} from "../../constants/color";

const FALISTHEIGHT = Dimensions.get('window').height - 112;

export default class IntegralFlatList extends Component {
    static defaultProps = {
        flatListData: [],       // 需要展示的赛事信息
        colorsArr: []           // 脚部展示的提示信息
    };

    /**
     * 渲染列表头部样式
     * @returns {*}
     */
    _renderHeader() {
        return (
            <View style={styles.headerSty}>
                <Text style={styles.rowSty_1}>排名</Text>
                <Text style={styles.rowSty_2}>球队</Text>
                <Text style={styles.rowSty_3}>赛</Text>
                <Text style={styles.rowSty_4}>胜</Text>
                <Text style={styles.rowSty_4}>平</Text>
                <Text style={styles.rowSty_4}>负</Text>
                <Text style={styles.rowSty_5}>得/失</Text>
                <Text style={styles.rowSty_4}>净</Text>
                <Text style={styles.rowSty_6}>积分</Text>
            </View>
        )
    }

    /**
     * 渲染分隔线
     * @returns {*}
     */
    borderBottomList() {
        return (
            <View style={styles.lineS}/>
        )
    }

    /**
     * 渲染脚部样式
     * @returns {*}
     */
    renderFooter() {
        const {colorsArr, flatListData} = this.props;
        return (
            <View>
                {
                    flatListData.length > 0 ?
                        (colorsArr.length > 0 &&
                            <View style={styles.footerSty}>
                                {
                                    colorsArr.map((item, index) => {
                                        return (
                                            <View style={styles.footerColorSty} key={index}>
                                                <View style={[styles.marketSty, {backgroundColor: item.color}]}/>
                                                <Text>{item.text}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>) :
                        <View style={styles.emptySty}>
                            <Text style={{color: tipsTextGrey}}>
                                暂无积分
                            </Text>
                        </View>
                }
            </View>
        )
    }

    /**
     * 渲染积分列表
     * @returns {*}
     */
    _renderItem(item, index) {
        return (
            <View style={[styles.listBox, index % 2 !== 0 && styles.eventListSty]}>
                <Text style={styles.rowSty_1}>{item.totalRank}</Text>
                <Text style={[
                    styles.rowStyCont_2,
                    !!item.color && {backgroundColor: item.color, color: '#ffffff'}]}>
                    {item.shortName.substring(0, 6)}
                </Text>
                <Text style={styles.rowSty_3}>{item.totalVersusCount}</Text>
                <Text style={styles.rowSty_4}>{item.totalWin}</Text>
                <Text style={styles.rowSty_4}>{item.totalDraw}</Text>
                <Text style={styles.rowSty_4}>{item.totalDefeat}</Text>
                <Text style={styles.rowSty_5}>{item.totalGoal}/{item.totalLose}</Text>
                <Text style={styles.rowSty_4}>{item.totalGD}</Text>
                <Text style={styles.rowSty_6}>{item.totalPoint}</Text>
            </View>
        )
    }

    render() {
        const {flatListData} = this.props;
        return (
            <FlatList
                style={{backgroundColor: BgColorWhite, flex: 1}}
                data={flatListData}
                extraData={flatListData}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() => this._renderHeader()}
                renderItem={({item, index}) => this._renderItem(item, index)}
                ItemSeparatorComponent={this.borderBottomList}
                ListFooterComponent={() => this.renderFooter()}
            />
        )
    }
}

const styles = StyleSheet.create({
    headerSty: {
        flexDirection: 'row',
        height: 32,
        backgroundColor: '#FAE6BE',
        alignItems: "center"
    },
    rowSty_1: {
        color: contentText,
        flex: 46,
        textAlign: 'center'
    },
    rowSty_2: {
        color: contentText,
        flex: 94,
        textAlign: 'center'
    },
    rowStyCont_2: {
        color: contentText,
        flex: 94,
        textAlign: 'center',
        height: 40,
        lineHeight: 40
    },
    rowSty_3: {
        color: contentText,
        paddingLeft: 8,
        flex: 26,
        textAlign: 'center'
    },
    rowSty_4: {
        color: contentText,
        flex: 26,
        textAlign: 'center'
    },
    rowSty_5: {
        color: contentText,
        flex: 50,
        textAlign: 'center'
    },
    rowSty_6: {
        color: contentText,
        flex: 44,
        textAlign: 'center'
    },
    lineS: {
        borderBottomWidth: 1,
        borderColor: BorderColor
    },
    listBox: {
        flexDirection: 'row',
        height: 40,
        alignItems: "center"
    },
    eventListSty: {
        backgroundColor: '#FBFBFB'
    },
    footerSty: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        paddingBottom: 0,
        backgroundColor: '#F5F5F5'
    },
    footerColorSty: {
        flexDirection: 'row',
        marginRight: 15,
        marginBottom: 12
    },
    marketSty: {
        width: 24,
        height: 15,
        marginRight: 8
    },
    emptySty: {
        height: FALISTHEIGHT,
        alignItems: 'center',
        justifyContent: 'center'
    }
});