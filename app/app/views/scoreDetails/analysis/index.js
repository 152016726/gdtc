/**
 * Created by easyLottoMac on 2018/10/16.
 */
import React,{Component} from 'react';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';
import {connectReducerComponent} from '../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../constants/storeKeys';
import homeIcon from '../images/homeIcon_Min.png';
import awayIcon from '../images/awayIcon_Min.png';
import FutureThreeMatches from './futureThreeMatches';          // 未来三场
import LeagueHandicapTrendcy from './leagueHandicapTrendcy';    // 联赛盘路走势
import LeaguePointRank from './leaguePointRank';                // 联赛记分排名
import PastCombatGains from './pastCombatGains';                // 对赛往绩
import RecentCombatGains from './recentCombatGains';            // 近期战绩
import SameHistoryHandicap from './sameHistoryHandicap';        // 相同历史盘口
import ScoreScrollView from '../components/scoreScrollView';

class Analysis extends Component{
    static navigationOptions = ({navigation})=>{
        return {
            title: '分析'
        }
     };
    render(){
        const {vid, homeName, awayName, homeTid, awayTid, vsDate} = this.props;
        return (
            <ScoreScrollView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
                <LeaguePointRank
                    vid={vid}
                    homeName={homeName}
                    homeIcon={homeIcon}
                    awayIcon={awayIcon}
                    awayName={awayName}
                />
                <PastCombatGains
                    vid={vid}
                    homeName={homeName}
                    awayName={awayName}
                    homeTid={homeTid}
                    awayTid={awayTid}
                    homeIcon={homeIcon}
                    awayIcon={awayIcon}
                />
                <RecentCombatGains
                    vid={vid}
                    homeName={homeName}
                    awayName={awayName}
                    vsDate={vsDate}
                    homeTid={homeTid}
                    awayTid={awayTid}
                    homeIcon={homeIcon}
                    awayIcon={awayIcon}
                />
                <LeagueHandicapTrendcy
                    vid={vid}
                    homeName={homeName}
                    awayName={awayName}
                    homeIcon={homeIcon}
                    awayIcon={awayIcon}
                />
                <SameHistoryHandicap
                    vid={vid}
                    homeName={homeName}
                    awayName={awayName}
                    homeIcon={homeIcon}
                    awayIcon={awayIcon}
                />
                <FutureThreeMatches
                    vid={vid}
                    homeName={homeName}
                    awayName={awayName}
                    homeIcon={homeIcon}
                    awayIcon={awayIcon}
                />
            </ScoreScrollView>
        )
    }
}

export default connectReducerComponent(storeKey.SCORE_DETAILS_ANALYSIS_STORE, reducer, state, action)(Analysis)