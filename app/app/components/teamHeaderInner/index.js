/**
 * Created by Roger(ljx) on 2018/9/20.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as CommonColor from '../../constants/color';

export default class TeamHeaderInner extends Component {
    static defaultProps = {
        isHome: true            // 是否為主隊
    };

    render() {
        const {isHome, homeRank, courtRank, homeShortName, awayShortName} = this.props;
        return (
            <View style={isHome ? styles.homeTeam : styles.courtTeam}>

                {isHome ? <View style={styles.teamRank}>
                    <Text style={[styles.rank,styles.sm]}>{homeRank?'['+homeRank+']':''}</Text>
                </View> : <Text style={styles.courtTeamName}>{awayShortName}</Text>}

                {isHome ? <Text style={styles.homeTeamName}>{homeShortName}</Text> :
                    <View style={styles.teamRank}>
                        <Text style={[styles.rank,styles.sm]}>{courtRank?'['+courtRank+']':''}</Text>
                    </View>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    homeTeam:{
        flexDirection:'row',
        justifyContent:"flex-end",
        alignItems:'center',
        height:30,
        flex:39
    },
    courtTeam:{
        flexDirection:'row',
        justifyContent:"flex-start",
        alignItems:'center',
        height:45,
        flex:39
    },
    teamRank:{
        justifyContent:"flex-end",
        alignItems:"center",
        paddingTop:5
    },
    homeTeamName: {
        fontSize: 15,
        paddingLeft:2,
        paddingTop:5,
        textAlign:'center',
        color: '#333333'
    },
    courtTeamName: {
        fontSize: 15,
        paddingRight:2,
        paddingTop:5,
        textAlign:'center',
        color: '#333333'
    },
    sm: {
        fontSize: 10
    },
    rank: {
        fontSize: 13,
        color: CommonColor.teamRankGrey
    }
});