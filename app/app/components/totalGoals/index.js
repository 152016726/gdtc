/**
 * Created by Roger(ljx) on 2018/9/6.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import BetButton from '../betButton';
import GoalsInner from '../goalsInner';
import * as CommonColor from '../../constants/color';
import TeamHeader from '../../components/teamHeader';
import oddDealCtrl from '../../constants/oddDealCtrl.js';
import games from '@easylotto/bet';
import * as CommonSort from '../../constants/MarketSort'

let Opts = [];
oddDealCtrl.getOdds(CommonSort.TOTAL_GOALS).map(function(item){
    Opts.push(item.shortTitle);
});

export default class TotalGoals extends Component{
    static defaultProps = {
        WDWOpts:Opts  // 总进球数
    };

    /**
     *
     * @param index 索引
     * @param sort  比赛玩法
     * @returns {{outcomeName: string, rate: *, isSelected: *}}
     */
    initName(index, sort) {
        let {event} = this.props;
        let vid = event.vid;
        let _props = {
            outcomeName:'goal'+index,
            rate:event.showMarkets[sort]['goal'+index],
            isSelected:this.getSelectStatus(vid, sort, 'goal'+index)
        };
        return _props;
    }

    /**
     *
     * @param vid  比赛的vid
     * @param sort 比赛的玩法如WDW,HWDW等等
     * @param outcomeName 每个玩法对应的赛果如WDW对应homeOdds,drawOdds等(胜负平),TG对应goals1,goals2等(进球数)
     * @returns {*|{example}|boolean} 返回当前玩法赛果是否为已选状态
     */
    getSelectStatus(vid, sort, outcomeName){
        let outcomeList = games.Betslip.getChooseOutcomes();
        let isSelected = outcomeList.some((oc)=>{
            return oc ===`${vid}#${sort}#${outcomeName}`
        });
        return isSelected;
    }

    /**
     *
     * @param sort 比赛玩法
     * @returns {*}
     */
    renderBetButton(sort){
        const {event,outcomeCount,WDWOpts} = this.props;
        return (WDWOpts.map((val,index) => {
            let opts = this.initName(index,sort);
            let cls = {
                height:30,
                borderRightWidth: 1,
                borderBottomWidth:1,
                borderColor:CommonColor.DarkerBorderColor
            };
            return <BetButton
                key = {index}
                sort={sort}
                vid={event.vid}
                text={val}
                cls={cls}        
                name={val}
                num={index}
                outcomeCount={outcomeCount}
                ContentElement={GoalsInner}
                {...opts}
                />
        }))

    }

    render(){
        const {event} = this.props;
        return (
            <View style={styles.bg}>
                <TeamHeader
                    isCP = {false}
                    homeShortName={event.homeShortName}
                    awayShortName={event.awayShortName}
                    homeRank={event.homeLeagueRank}
                    courtRank={event.awayLeagueRank}
                />
                <View style={styles.team}>
                    <View style={[styles.flexRow,styles.upBorder]}>{
                        this.renderBetButton(CommonSort.TOTAL_GOALS).slice(0,this.renderBetButton(CommonSort.TOTAL_GOALS).length/2)
                    }</View>
                    <View style={[styles.flexRow,styles.downBorder]}>{
                        this.renderBetButton(CommonSort.TOTAL_GOALS).slice(this.renderBetButton(CommonSort.TOTAL_GOALS).length/2)
                    }</View>
                </View>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    bg:{
        backgroundColor:CommonColor.BgColor
    },
    //比分投注
    team:{
        height:60,
        justifyContent:"center"
    },
    flexRow:{
        flex:1,
        height:30,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:"center"
    },
    upBorder:{
        borderLeftWidth:1,
        borderTopWidth:1,
        borderColor:CommonColor.DarkerBorderColor
    },
    downBorder:{
        borderLeftWidth:1,
        borderTopWidth:1,
        borderColor:CommonColor.DarkerBorderColor
    }
});