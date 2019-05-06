/**
 * Created by Roger(ljx) on 2018/9/6.
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import BetButton from '../betButton';
import GoalsInner from '../goalsInner';
import * as CommonColor from '#/constants/color';
import TeamHeader from '../teamHeader';
import matchDataCenter from '#/matchDataCenter';

export default class TotalGoals extends Component {
    static defaultProps = {
        vid: '',        // 比赛vid
        sort: '',       // 显示的sort分类，可能是 min 混合过关，dg 单固
        currentKey: ''  // 当前改变的outcome的key
    };

    model = {};

    componentWillMount() {
        this.initModel();
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.vid !== this.props.vid){
            this.initModel(nextProps);
        }
    }

    initModel(props) {
        let {vid} = (props || this.props);
        this.model.event = matchDataCenter.getEventObject(vid);
    }

    /**
     *
     * @param sort 比赛玩法
     * @returns {*}
     */
    renderBetButton(){
        const {sort, currentKey} = this.props;
        const {event} = this.model;
        let mkt = event.markets[sort];
        let cls = {
            height:30,
            borderRightWidth: 1,
            borderBottomWidth:1,
            borderColor:CommonColor.DarkerBorderColor
        };
        return mkt.outcomes.map((oc, index) => <BetButton
                vid={event.vid}
                sort={sort}
                key={`${event.vid}#${sort}#${oc.key}`}
                betKey={`${event.vid}#${sort}#${oc.key}`}
                text={oc.shortTitle}
                rate={oc.rate}
                cls={cls}
                num={index}
                currentKey={currentKey}
                ContentElement={GoalsInner}
                />
        );
    }

    shouldComponentUpdate(nextProps) {
        let flag = false;
        for(let p in nextProps){
            !flag && (flag = nextProps[p] !== this.props[p]);
        }
        return flag;
    }

    render(){
        const {event} = this.model;
        let arrBetButton = this.renderBetButton();
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
                    <View style={[styles.flexRow,styles.upBorder]}>
                        {
                            arrBetButton.slice(0, arrBetButton.length/2)
                        }
                    </View>
                    <View style={[styles.flexRow,styles.downBorder]}>
                        {
                            arrBetButton.slice(arrBetButton.length/2)
                        }
                    </View>
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