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

import {FONT_12, FONT_14} from '../../constants/fontSize';
import {MainColor, BgColor, contentText} from '../../constants/color';

let marketName = {
    wdw: '胜平负',
    hwdw: '让球',
    tg: '总球数',
    cs: '比分',
    hft: '半全场'

};
export default class BonusMarketList extends Component{
    static defaultProps = {
        marketList:[], //展示的赛事信息数组
        setDanHandle: ()=>{}, //设胆事件
        delMarket:()=>{}, //删除赛事事件回调
        selectMarket:()=>{}  //弹出当场赛事的所有玩法回调
    };

    renderOddText(odd){
        return(
            <View style={styles.listRight}>
                {
                    odd.map((od,index)=>{
                        return(
                            <Text style={styles.listRightText} key={index}>
                                {od}{index < odd.length - 1 && ', '}
                            </Text>
                        )
                    })
                }
            </View>
        )
    }

    renderOdds(odd, index){
        return(
            <View style={styles.marketList} key={index}>
                <View style={styles.listLeft}>
                    {
                        odd.marketName === "hwdw" ?
                        <Text style={styles.listLeftText}>
                            {marketName[odd.marketName]}({odd.handicap})
                        </Text> :
                        <Text style={styles.listLeftText}>
                            {marketName[odd.marketName]}
                        </Text>
                    }
                </View>
                {this.renderOddText(odd.odds)}
            </View>
        )
    }

    render(){
        const{setDanHandle, delMarket, marketList, selectMarket} = this.props;
        return(
            <View style={{padding: 10}}>
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
                    <TouchableOpacity style={styles.delBtn}
                                      onPress={()=>delMarket(marketList.matchInfo.vid)}>
                        <Image source={require('./images/deleteIcon.png')}
                               style={styles.imageS}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.marketBox}
                                      onPress={()=>selectMarket(marketList.matchInfo.vid)}>
                        {
                            marketList && marketList.oddsAry && marketList.oddsAry.map((odd, index)=>this.renderOdds(odd, index))
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.setDanBtn}
                                      onPress={()=>setDanHandle(marketList.matchInfo.vid, marketList.isBanker)}>
                        <Image source={marketList.isBanker ? require('./images/select_icon.png'): require('./images/clickIcon.png')}
                               style={styles.imageS}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    teamTitle: {
        flexDirection: 'row',
        paddingHorizontal: 28
    },
    tTitleLeft: {
        flex:2
    },
    titleVs: {
        flex: 2,
        paddingHorizontal: 5,
        textAlign:'center'
    },
    titleTeamName: {
        flex:5,
        textAlign: 'center'
    },
    titleText:{
        color: contentText,
        fontSize: FONT_14
    },
    teamNames: {
        flex: 5,
        flexDirection: 'row'
    },
    content: {
        flexDirection:'row',
        marginTop: 10,
        alignItems: 'center'
    },
    delBtn: {
        marginRight: 10
    },
    imageS: {
        width: 20,
        height: 20
    },
    marketBox: {
        flex: 1,
        backgroundColor: BgColor,
        paddingVertical: 8,
        paddingHorizontal: 10
    },
    marketList: {
        flexDirection: 'row',
        paddingVertical: 4
    },
    listLeft: {
        flex: 3
    },
    listLeftText: {
        textAlign: "right",
        color: "#666666",
        fontSize: FONT_12,
        lineHeight: 13,
        marginRight: 6
    },
    listRight: {
        flex: 5,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    listRightText: {
        color: MainColor,
        fontSize: FONT_12 ,
        lineHeight: 13
    },
    setDanBtn: {
        marginLeft: 10
    }
});