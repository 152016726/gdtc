import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform
} from 'react-native';
import { FONT_8, FONT_9, FONT_10, FONT_11, FONT_12, FONT_15 } from '../../../constants/fontSize';
import { MainColor } from '../../../constants/color';
import Blink from '../../../components/blink';
export default class MatchScore extends Component {
    static defaultProps = {
        tabIndex : 0,  //默认tabPageIndex
        item : {},
        isShowRedYellowCard:'',//是否显示红黄牌
        isShowRanking:''       //是否显示排名
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { item , isShowRedYellowCard, isShowRanking} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.midFirstBox}>
                    <Text style={[ styles.midMatchTime, { color : item.matchStateColor } ]}>{item.matchState}</Text>
                    { item.matchStateColor === MainColor ? <Blink cls={styles.midMatchTime} text={'′'}/> : null }
                    <Text style={styles.midBetNum}>{item.asianHandicap}</Text>
                </View>
                <View style={styles.midClubInfoBox}>
                    <View style={styles.midClubInfoBoxLeft}>
                        {isShowRedYellowCard && (<Text style={item.homeYellowCards !== '0' ? styles.midYellowCard : { width : 0 }}>{item.homeYellowCards}</Text>)}
                        {isShowRedYellowCard && (<Text style={item.homeRedCards !== '0' ? [ styles.midRedCard, { marginLeft : 2 } ] : { width : 0, marginLeft : 0 }}>{item.homeRedCards}</Text>)}
                        {isShowRanking && (item.homeLeagueRank === '' ? <Text style={styles.midRanking}> </Text> : <Text style={styles.midRanking}>{' [' + item.homeLeagueRank + '] '}</Text>)}
                        <Text style={styles.midClubName} numberOfLines={1}>{item.homeShortName}</Text>
                    </View>
                    <Text style={ [ styles.midScore, { color : item.matchStateColor } ]}>{item.matchScore}</Text>
                    <View style={styles.midClubInfoBoxRight}>
                        <Text style={styles.midClubName} numberOfLines={1}>{item.awayShortName}</Text>
                        {isShowRanking && (item.awayLeagueRank === '' ? <Text style={styles.midRanking}> </Text> : <Text style={styles.midRanking}>{' [' + item.awayLeagueRank + '] '}</Text>)}
                        {isShowRedYellowCard && (<Text style={item.awayRedCards !== '0' ? [ styles.midRedCard, { marginRight : 2 } ] : { width : 0, marginRight : 0 }}>{item.awayRedCards}</Text>)}
                        {isShowRedYellowCard && (<Text style={item.awayYellowCards !== '0' ? styles.midYellowCard : { width : 0 }}>{item.awayYellowCards}</Text>)}
                    </View>
                </View>
                <View style={styles.midHalfScoreBox}>
                    {item.matchHalfScore === ' ' ? <View/> : <Text style={styles.midHalfScore}>{'半:' + item.matchHalfScore}</Text>}
                </View>

            </View> );
    }
}
const styles = StyleSheet.create({
    container : {
        flex : 4.2,
    },
    midFirstBox : {
        flex : 3,
        marginTop : 5,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center'
    },
    midMatchTime : {
        fontFamily : 'PingFang-SC-Regular',
        fontSize : FONT_12,
        color : MainColor,
        alignSelf : 'flex-start'
    },
    midBetNum : {
        textAlign : 'left',
        fontFamily : 'PingFang-SC-Medium',
        color : '#AAAAAA',
        fontSize : FONT_12,
        position : 'absolute',
        left : 125
    },
    midClubInfoBox : {
        flex : 4.2,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center'
    },
    midClubInfoBoxLeft : {
        justifyContent : 'flex-end',
        alignItems : 'center',
        flexDirection : 'row',
        flex : 3
    },
    midClubInfoBoxRight : {
        justifyContent : 'flex-start',
        alignItems : 'center',
        flexDirection : 'row',
        flex : 3
    },
    midYellowCard : {
        // lineHeight:13,
        textAlign : 'center',
        fontFamily : 'PingFang-SC-Medium',
        backgroundColor : '#FCAA04',
        color : 'white',
        fontSize : FONT_10,
        height : 14,
        width : 8,
        ...Platform.select({
            ios : {
                lineHeight : 13,
            },
            android : {}
        })
    },
    midRedCard : {
        // lineHeight:13,
        textAlignVertical : 'center',
        textAlign : 'center',
        fontFamily : 'PingFang-SC-Medium',
        backgroundColor : 'red',
        color : 'white',
        fontSize : FONT_10,
        height : 14,
        width : 8,
        ...Platform.select({
            ios : {
                lineHeight : 13,
            },
            android : {}
        })
    },
    midRanking : {
        fontFamily : 'PingFang-SC-Medium',
        fontSize : FONT_11,
        color : '#AAAAAA'
    },
    midClubName : {
        textAlign : 'center',
        fontFamily : 'PingFang-SC-Regular',
        fontSize : FONT_15,
        color : '#333333'
    },
    midScore : {
        textAlign : 'center',
        justifyContent : 'center',
        alignItems : 'center',
        fontFamily : 'PingFang-SC-Regular',
        marginLeft : 8,
        marginRight : 8,
        width : 34,
        fontSize : FONT_15,
        color : '#F46859'
    },
    midHalfScoreBox : {
        flex : 3,
        marginBottom : 6,
        justifyContent : 'center',
        alignItems : 'center'
    },
    midHalfScore : {
        fontFamily : 'PingFang-SC-Medium',
        fontSize : FONT_12,
        color : '#AAAAAA'
    },
});