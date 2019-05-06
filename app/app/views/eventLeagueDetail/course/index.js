/**
 * Created by marcus on 2018/12/3.
 */
import React,{Component} from 'react';
import {View,ScrollView} from 'react-native';
import {connectReducerComponent} from "../../../reduxCfg";
import * as storeKey from "../../../constants/storeKeys";
import reducer from "./reducer";
import state from "./state";
import action from "./action";
import HistoryBattles from './components/historyBattles';
import Pagination from './components/pagination';
import GroupHeader from './components/groupHeader';
import RoundMatch from './components/roundMatch';
import RoundRank from './components/roundRank';

export class Course extends Component{
    static defaultProps = {
        seasonId: '',
        stageId: '',
        roundId: ''
    };
    
    render(){
        const {
            seasonId,                              // 赛季ID
            stageId,                               // 阶段ID
            roundId,                               // 轮次ID
            matchData,                             // 轮次下的具体队伍信息
            rankDataList,                          // 轮次下的排名信息
            rankColorArr,                          // 轮次下的排名颜色
            group,                                 // 被选中的分组或者轮次信息
            isRankorTeam,                          // 切换显示轮次下的排名还是队伍信息
            stageList,                             // 阶段list
            groupList,                             // 轮次或者分组list
            defaultStageIndex,                     // 默认展示的阶段索引
            defaultGroupIndex,                     // 默认展示的轮次或分组索引
            staticGroupIndex,                      // 默认展示的轮次或分组索引不会变的
            _clickGroup,                           // 轮次或分组点击事件
            _clickStage,                           // 阶段点击事件
            getStages,                             // 获取阶段接口请求方法
            getRoundsInfo,                         // 获取轮次接口请求方法
            getMuseumMatchsInfo,                   // 获取轮次下的队伍信息接口请求方法
            updateState,                           // action中更新当前course里State方法
            getStandingsInfo                       // 获取轮次下的队伍排名接口请求方法
        } = this.props;
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
            >
                <View style={{flex:1}}>
                    <Pagination
                        seasonId={seasonId}
                        getStages={getStages}
                        stageList={stageList}
                        defaultStageIndex={defaultStageIndex}
                        _clickStage={_clickStage}
                    />
                    {groupList && <RoundMatch
                                stageId={stageId}
                                getRoundsInfo={getRoundsInfo}
                                _clickGroup={_clickGroup}
                                groupList={groupList}
                                defaultGroupIndex={defaultGroupIndex}
                                staticGroupIndex={staticGroupIndex}
                            />
                    }
                    {group && <GroupHeader
                        updateState={updateState}
                        data={group}
                    />
                    }
                    {isRankorTeam && matchData && <HistoryBattles
                                data={matchData}
                                roundId={roundId}
                                getMuseumMatchsInfo={getMuseumMatchsInfo}
                            />}
                    {!isRankorTeam && rankDataList && <RoundRank
                                colorArr={rankColorArr}
                                dataList={rankDataList}
                                roundId={roundId}
                                getStandingsInfo={getStandingsInfo}
                            />}
                </View>
            </ScrollView>
        )
    }
}

export default connectReducerComponent(storeKey.COURSE_STORE, reducer, state, action)(Course);