import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    Platform,
    ImageBackground
} from 'react-native';
import { BgColor, BorderColor } from '../../../../constants/color';
import oddDealCtrl from '../../../../constants/oddDealCtrl';

const line = require('../../../../images/project_line.png');
const s_w = Dimensions.get('window').width;

export default class SolutionList extends Component {

    static defaultProps = {
        data : []
    };

    handleOvertime() {
        const { data } = this.props;
        return Date.prototype.parseISO8601(data.deadline) > new Date();
    }

    /**
     * 头部
     *
     */
    renderHeader() {
        const { data } = this.props;
        let isOverTime = this.handleOvertime();
        let overTime = isOverTime ? '未过期' : '已过期';
        let deadLineStr = data.deadline.slice(5, 16);
        return (
            <View style={styles.headerAll}>
                <View style={styles.headerTop}>
                    <View style={styles.container}>
                        <Text style={styles.headTopTips}>投注金额</Text>
                        <Text style={styles.headTopContent}>{data.money + '元'}</Text>
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.headTopTips}>方案状态</Text>
                        <Text style={styles.headTopContent}>{overTime}</Text>
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.headTopTips}>过期时间</Text>
                        <Text style={styles.headTopContent}>{deadLineStr}</Text>
                    </View>
                </View>
                <View style={styles.headBottomAll}>
                    <ImageBackground style={styles.headBottomLine} source={line}>
                        <View style={styles.headBottomLineView}>
                            <View style={styles.line}/>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        );
    }

    /**
     * 尾部
     *
     */
    renderFooter() {
        const { data } = this.props;
        return (
            <View style={styles.footerView}>
                <Text style={styles.footerContent}>{'竞彩足球，' + data.stickWay}</Text>
            </View>
        );
    }

    handleHandicap(item) {
        if (item.outcomes.length !== 0) {
            if (item.outcomes[ 0 ].data.count !== 0) {
                if (item.outcomes[ 0 ].data.handicap !== undefined) {
                    return item.outcomes[ 0 ].data.handicap;
                }
            }
        }
        return '';
    }

    /**
     * 返回item
     *
     */
    renderItem(item, index) {
        let marketName = oddDealCtrl.getObjBySort({ props : 'fullTitle' });
        let marketKey = item.outcomes.length !== 0 ? item.outcomes[ 0 ].marketKey : '';
        let oddsName = item.outcomes.length !== 0 ? item.outcomes[ 0 ].oddsName : '';
        let handicap = this.handleHandicap(item);
        let odds = item.outcomes !== 0 ? item.outcomes[ 0 ].odds : '';
        let content = handicap.length !==0 ? oddsName + '('+handicap+')'+'@'+odds : oddsName +'@'+odds;
        let data =JSON.parse(this.props.data.data).betslip;
        let mupliterIndex = data.length - 1 ;
        return (
            <View style={styles.itemAll}>
                {index === 0 ? this.renderItemHeader() : null}
                <View style={styles.item}>
                    <View style={styles.itemContent}>
                        <View style={styles.itemContentPartOne}>
                            <Text style={styles.dateStr}>{item.matchInfo.week + item.matchInfo.number}</Text>
                            <Text style={styles.matchStr}>{item.matchInfo.homeShortName + ' VS ' + item.matchInfo.awayShortName}</Text>
                        </View>
                        <View style={styles.itemContentPartTwo}>
                            <Text style={styles.playStr}>{marketName[ marketKey ]}</Text>
                            <Text style={styles.oddsStr}>{ content }</Text>
                        </View>
                    </View>
                    <View style={[styles.mupliter,(mupliterIndex === index) ? {borderBottomWidth : 1} :{borderBottomWidth : 0}]}>
                        {Math.round(JSON.parse(this.props.data.data).betslip.length / 2) - 1 === index
                            ? <Text style={styles.mupliterStr}>{this.props.data.multiple}</Text>
                            : null}
                    </View>
                </View>
            </View>);
    }

    /**
     * item组头
     * @returns {XML}
     */
    renderItemHeader() {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderContentOne}>玩法</Text>
                <Text style={styles.sectionHeaderContentTwo}>投注选项</Text>
                <Text style={styles.sectionHeaderContentThree}>倍数</Text>
            </View>
        );
    }

    render() {
        return (
            <FlatList style={{ backgroundColor : BgColor }}
                      data={JSON.parse(this.props.data.data).betslip}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => this.renderItem(item, index)}
                      ListFooterComponent={this.renderFooter.bind(this)}
                      ListHeaderComponent={this.renderHeader.bind(this)}
                      scrollEventThrottle={1}
                      refreshing={false}
                      extraData={this.state}/> );
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection : 'column'
    },
    headerAll : {
        backgroundColor : '#ffffff',
        flexDirection : 'column',
        height : 80,
        marginLeft : 12,
        marginRight : 12,
        marginTop : 10,
        borderTopLeftRadius : 4,
        borderTopRightRadius : 4
    },
    headerTop : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        marginTop : 20,
        marginLeft : 15,
        marginRight : 15
    },
    headTopTips : {
        textAlign : 'center',
        fontSize : 12,
        color : '#999999',
        fontFamily : 'PingFang-SC-Regular'
    },
    headTopContent : {
        textAlign : 'center',
        fontSize : 16,
        color : '#333333',
        fontFamily : 'PingFang-SC-Medium'
    },
    headBottomAll : {
        backgroundColor : BgColor,
        marginTop : 5
    },
    headBottomLine : {
        justifyContent : 'center',
        alignContent : 'center',
        height : 14,
        width : s_w - 24,
        margin : 0
    },
    headBottomLineView : {
        height : 1,
        overflow : "hidden"
    },
    line : {
        borderColor : BorderColor,
        marginLeft : 13,
        marginRight : 13,
        borderStyle : 'dashed',
        borderWidth : 1,
    },
    footerView : {
        backgroundColor : '#FFFFFF',
        marginLeft : 12,
        marginRight : 12,
        height : 43,
        borderBottomLeftRadius : 4,
        borderBottomRightRadius : 4
    },
    footerContent : {
        fontSize : 14,
        fontFamily : 'PingFang-SC-Regular',
        color : '#333333',
        marginLeft : 10,
        marginBottom : 16,
        marginTop : 10
    },
    itemAll : {
        backgroundColor : '#ffffff',
        marginLeft : 10,
        marginRight : 10
    },
    item : {
        flexDirection : 'row',
        flex : 1,
        height : 80,
        backgroundColor : '#FFFFFF'
    },
    itemContent : {
        flexDirection : 'column',
        flex : 5
    },
    itemContentPartOne : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignContent : 'center',
        backgroundColor : '#F5F5F5',
        marginLeft : 10,
        height : 40
    },
    dateStr : {
        flex : 1.8,
        textAlign : 'center',
        fontSize : 14,
        color : '#999999',
        fontFamily : 'PingFang-SC-Regular',
        textAlignVertical: 'center',
        ...Platform.select({
            ios : {
                lineHeight : 40,
            },
            android : {}
        })
    },
    matchStr : {
        flex : 3.2,
        textAlign : 'center',
        fontSize : 14,
        color : '#343434',
        fontFamily : 'PingFang-SC-Regular',
        textAlignVertical: 'center',
        ...Platform.select({
            ios : {
                lineHeight : 40,
            },
            android : {}
        })
    },
    itemContentPartTwo : {
        flexDirection : 'row',
        backgroundColor : '#FFFFFF',
        justifyContent : 'center',
        alignContent : 'center',
        marginLeft : 10,
        height : 40
    },
    playStr : {
        borderWidth : 1,
        borderColor : '#E6E6E6',
        flex : 1.8,
        textAlign : 'center',
        fontSize : 14,
        color : '#777777',
        fontFamily : 'PingFang-SC-Regular',
        textAlignVertical: 'center',
        ...Platform.select({
            ios : {
                lineHeight : 40,
            },
            android : {}
        })
    },
    oddsStr : {
        borderWidth : 1,
        borderColor : '#E6E6E6',
        flex : 3.2,
        textAlign : 'center',
        fontSize : 15,
        color : '#343434',
        fontFamily : 'PingFang-SC-Regular',
        textAlignVertical: 'center',
        ...Platform.select({
            ios : {
                lineHeight : 40,
            },
            android : {}
        })
    },
    mupliter : {
        borderLeftWidth : 1,
        borderRightWidth : 1,
        borderColor : '#E6E6E6',
        flex : 1,
        backgroundColor : '#FFFFFF',
        height : 80,
        justifyContent : 'center',
        marginRight : 10,
        alignContent : 'center'
    },
    mupliterStr : {
        textAlign : 'center',
        fontSize : 16,
        color : '#343434',
        fontFamily : 'PingFang-SC-Medium'
    },
    sectionHeader : {
        justifyContent : 'center',
        alignContent : 'center',
        backgroundColor : '#E6E6E6',
        height : 32,
        flexDirection : 'row',
        marginLeft : 10,
        marginRight : 10,
        marginTop : 10
    },
    sectionHeaderContentOne : {
        textAlignVertical : 'center',
        flex : 1.8,
        textAlign : 'center',
        fontSize : 14,
        color : '#777777',
        ...Platform.select({
            ios : {
                lineHeight : 32,
            },
            android : {}
        })
    },
    sectionHeaderContentTwo : {
        textAlignVertical : 'center',
        flex : 3.2,
        textAlign : 'center',
        fontSize : 14,
        color : '#777777',
        ...Platform.select({
            ios : {
                lineHeight : 32,
            },
            android : {}
        })
    },
    sectionHeaderContentThree : {
        textAlignVertical : 'center',
        flex : 1,
        textAlign : 'center',
        fontSize : 14,
        color : '#777777',
        ...Platform.select({
            ios : {
                lineHeight : 32,
            },
            android : {}
        })
    }

});