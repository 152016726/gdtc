/**
 * Created by Roger(ljx) on 2018/9/20.
 */
import React,{Component} from 'react';
import {View,Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import TeamHeaderInner from '~/components/teamHeaderInner';
import * as CommonColor from '~/constants/color';

export default class TeamHeader extends Component{
    static defaultProps = {
        isCP:true,            // 是否展示讓球
        homeRank:'',          // 主隊排名
        courtRank:'',         // 客隊排名
        homeShortName:'',     // 主隊簡稱
        awayShortName:''      // 客隊簡稱
    };

    render(){
        const {isCP,homeRank,courtRank,homeShortName,awayShortName,cls} = this.props;
        return (
            <View style = {[styles.container,cls]}>
                {isCP && <View style={styles.CP}>
                    <Text style={[styles.grey,styles.sm]}>让</Text>
                    <Text style={[styles.grey,styles.sm]}>球</Text>
                </View>}
                <View style={isCP ? styles.teamStyle : styles.onlyTeamStyle}>
                    <TeamHeaderInner
                        isHome = {true}
                        homeRank = {homeRank}
                        homeShortName = {homeShortName}
                    />
                    <View style={styles.VSstyle}><Text style={styles.grey}>VS</Text></View>
                    <TeamHeaderInner
                        isHome = {false}
                        courtRank = {courtRank}
                        awayShortName = {awayShortName}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height: Platform.OS === 'IOS' ? 20 : 25
    },
    CP:{
        flex:8,
        alignItems:"center",
        justifyContent:"flex-end",
        paddingBottom:3,
    },
    teamStyle:{
        flex:92,
        flexDirection:'row',
        paddingBottom:12,
        justifyContent:"center",
        alignItems:"center"
    },
    onlyTeamStyle:{
        flex:1,
        flexDirection:'row',
        paddingBottom:12,
        justifyContent:"center",
        alignItems:"center"
    },
    VSstyle:{
        flex:22,
        alignItems:"center"
    },
    sm:{
        ...Platform.select({
            ios:{
                fontSize:10,
            },
            android:{
                flex:1,
                fontSize:7
            }
        }),

    },
    grey:{
        color:CommonColor.teamRateGrey
    }
});