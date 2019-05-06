/**
 * Created by easylottoMac on 2018/9/6.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {FONT_12, FONT_14, FONT_15,FONT_13} from '~/constants/fontSize';
import {MainColor, BgColor, contentText} from '~/constants/color';

let marketName = {
    wdw: '胜平负',
    hwdw: '让球',
    tg: '总球数',
    cs: '比分',
    hft: '半全场'

};
export default class OutcomeList extends Component {
    static defaultProps = {
        marketList: [], //展示的赛事信息数组
    };

    renderOddText(odd) {
        return (
            <View style={styles.listRight}>
                {
                    odd.map((od, index) => {
                        return (
                            <Text style={styles.listRightText} key={index}>
                                {od}{index < odd.length - 1 && '、'}
                            </Text>
                        )
                    })
                }
            </View>
        )
    }

    renderOdds(odd, index) {
        return (
            <View style={styles.marketList} key={index}>
                <View style={styles.listLeft}>
                    {
                        odd.marketName === "hwdw" ?
                            <Text style={styles.listLeftText}>
                                {marketName[odd.marketName]}({odd.handicap})
                            </Text> :
                            <Text style={styles.listLeftText}>
                            </Text>
                    }
                </View>
                {this.renderOddText(odd.odds)}
            </View>
        )
    }

    render() {
        const {marketList} = this.props;
        // console.log(marketList);
        return (
            <View style={{padding: 10, backgroundColor: '#fff'}}>
                <View style={[styles.teamTitle]}>
                    <View style={styles.tTitleLeft}>
                        <Text style={styles.titleText}>
                            {marketList.matchInfo.week}{marketList.matchInfo.number}
                        </Text>
                    </View>
                    <View style={styles.teamNames}>
                        <Text style={[styles.titleText, styles.titleTeamName]}>
                            {marketList.matchInfo.homeShortName}
                        </Text>
                        <Text style={[styles.titleText, styles.titleVs]}>
                            VS
                        </Text>
                        <Text style={[styles.titleText, styles.titleTeamName]}>
                            {marketList.matchInfo.awayShortName}
                        </Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.marketBox} activeOpacity={1}>
                        <View>
                            <Text style={{color: '#666666'}}>晒单：</Text>
                        </View>
                        {
                            marketList && marketList.oddsAry && marketList.oddsAry.map((odd, index) => this.renderOdds(odd, index))
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    teamTitle: {
        flexDirection: 'row'
    },
    tTitleLeft: {
        flex: 2
    },
    titleVs: {
        flex: 2,
        paddingHorizontal: 5,
        textAlign: 'center'
    },
    titleTeamName: {
        flex: 5,
        textAlign: 'center'
    },
    titleText: {
        color: contentText,
        fontSize: FONT_15
    },
    teamNames: {
        flex: 5,
        flexDirection: 'row'
    },
    content: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    marketBox: {
        flex: 1,
        flexDirection:'row',
        backgroundColor: BgColor,
        paddingVertical: 9,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent:'flex-start'
    },
    marketList: {
        flexDirection: 'row',
        justifyContent:'flex-start'
    },
    listLeftText: {
        textAlign: "right",
        color: "#666666",
        fontSize: FONT_13,
        lineHeight: 13,
        marginRight: 6
    },
    listRight: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    listRightText: {
        color: MainColor,
        fontSize: FONT_12,
        lineHeight: 13
    }
});