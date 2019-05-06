/**
 * Created by easyLottoMac on 2018/10/22.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import ScoreScrollView from '../../components/scoreScrollView';
import {FONT_14, FONT_12} from "../../../../constants/fontSize";
import {BlueColor, BorderColor, BgColorWhite, MainColor} from '../../../../constants/color';

export default class Intelligence extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    renderList(team, index) {
        return (
            <View key={index}>
                <View style={styles.titleSt}>
                    <Text style={[styles.titleMinIcon, {backgroundColor: index === 0 ? '#DE1D30' : BlueColor}]}/>
                    <Text style={{color: index === 0 ? '#DE1D30' : BlueColor}}>{team.name}</Text>
                </View>
                <View style={{backgroundColor: BgColorWhite}}>
                    {
                        team.list.length > 0 ? team.list.map((li, i) => {
                                return (
                                    <View style={styles.contentBox} key={i}>
                                        <View style={styles.contentTitle}>
                                            <Text style={styles.contentDot}/>
                                            <Text style={{fontSize: FONT_14}}>{li.title}</Text>
                                        </View>
                                        <View style={i < team.list.length - 1 && styles.contentTextBorder}>
                                            <Text style={styles.contentText}>
                                                {li.content}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            }) :
                            <View style={[styles.contentBox, {paddingBottom: 12}]}>
                                <Text>暂无数据</Text>
                            </View>
                    }
                </View>
            </View>
        )
    }

    render() {
        let demoData = [
            {
                name: '曼联',
                list: [
                    {
                        title: '声音',
                        content: '主帅佩雷拉：“明天预计会是一场非常精彩的比赛，两支球队都是非常好的，也都有非常好的球员。明天的比赛会是竞争力很强的比赛，肯定也会很精彩。对我来说，我希望我的球队有好的表现，取得好的结果。”'
                    },
                    {
                        title: '球员',
                        content: '本赛季首回合上港客场5-2大胜富力,该场比赛武磊上演大四喜。此役上港发出以武磊为主题的海报,显然对齐寄予厚望。最近4轮联赛武磊为上港贡献了2球2助攻,目前以14个进球领跑中超射手榜。'
                    }
                ]
            },
            {
                name: '切尔西',
                list: [
                    {
                        title: '声音',
                        content: '主帅佩雷拉：“明天预计会是一场非常精彩的比赛，两支球队都是非常好的，也都有非常好的球员。明天的比赛会是竞争力很强的比赛，肯定也会很精彩。对我来说，我希望我的球队有好的表现，取得好的结果。”'
                    },
                    {
                        title: '阵容',
                        content: '由于富力无U23球员入选亚运会最终大名单,此役球队若再派上3名外援,那就要重新派上3名U23球员。'
                    }
                ]
            }
        ];
        return (
            <ScoreScrollView>
                {demoData.map((team, index) => {
                    return this.renderList(team, index)
                })}
            </ScoreScrollView>
        )
    }
}

const styles = StyleSheet.create({
    titleSt: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#EDEDED',
        alignItems: 'center'
    },
    titleMinIcon: {
        width: 6,
        height: 25,
        marginRight: 16
    },
    contentBox: {
        padding: 12,
        paddingBottom: 0
    },
    contentTitle: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    contentDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: MainColor,
        marginRight: 10
    },
    contentText: {
        color: '#666666',
        fontSize: FONT_12,
        lineHeight: 18,
        paddingBottom: 12
    },
    contentTextBorder: {
        borderBottomWidth: 1,
        borderColor: BorderColor
    }
});