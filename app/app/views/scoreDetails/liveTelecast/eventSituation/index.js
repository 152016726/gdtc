/**
 * Created by easyLottoMac on 2018/10/16.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import {connectReducerComponent} from '../../../../reduxCfg';
import reducer from './reducer';
import state from './state';
import action from './action';
import * as storeKey from '../../../../constants/storeKeys';
import TabFolderContent from './components/tabFolderContent';
import StrokeAnalysis from './strokeAnalysis';
import EventTimeBar from './eventTimeBar';
import EventExample from './eventExample';
import ScoreScrollView from '../../components/scoreScrollView';
import ToggleItem from '../../../../components/toggleItem';

class ScoreInformation extends Component{
    static defaultProps = {
        vid: '',        // 比赛id
        homeName: '',   // 主队名
        awayName: ''    // 客队名
    };

    componentWillMount() {
        this.props.getData(this.props.vid);
    }

    render(){
        let {homeName, awayName, homeData, awayData, events, firstKickOff, isTimeData, isStrokeData} = this.props;
        return (
            <ScoreScrollView style={styles.container}>
                {
                    (isTimeData || isStrokeData) &&
                    <View style={styles.teamVs}>
                        <View style={styles.teamHome}>
                            <View style={styles.leftBlock}/>
                            <Text>{homeName}</Text>
                        </View>
                        <View style={styles.teamAway}>
                            <View style={styles.rightBlock}/>
                            <Text>{awayName}</Text>
                        </View>
                    </View>
                }
                {
                    isStrokeData &&
                    <ToggleItem
                        title={<Text style={styles.titleStyle}>技术统计</Text>}
                        content={<StrokeAnalysis homeData={homeData} awayData={awayData} firstKickOff={firstKickOff}/>}
                    />
                }
                {
                    isTimeData &&
                    <ToggleItem
                        title={<Text style={styles.titleStyle}>比赛事件</Text>}
                        content={<EventTimeBar events={events}/>}
                    />
                }
                {
                    isTimeData &&
                    <EventExample />
                }
                {
                    !isTimeData && !isStrokeData &&
                    <View style={styles.noDataWarp}>
                        <Text style={styles.noDataText}>暂无赛况数据</Text>
                    </View>
                }
            </ScoreScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleStyle: {
        fontSize: 16,
        paddingLeft: 20
    },
    teamVs: {
        height: 40,
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    teamHome: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    teamAway: {
        flex:1,
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    leftBlock: {
        width: 3,
        height: 14,
        backgroundColor: '#E3696D',
        marginLeft: 8,
        marginRight: 8
    },
    rightBlock: {
        width: 3,
        height: 14,
        backgroundColor: '#669DF6',
        marginLeft: 8,
        marginRight: 8
    },
    noDataWarp: {
        paddingTop: 150,
        alignItems: 'center'
    },
    noDataText: {
        color: '#909090'
    }
});

export default connectReducerComponent(storeKey.SCORE_DETAILS_LIVE_EVENT_STORE, reducer, state, action)(ScoreInformation)