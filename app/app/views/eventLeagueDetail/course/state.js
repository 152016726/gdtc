/**
 * Created by marcus on 2018/12/11.
 */
export default {
    stageList: [],          // 阶段信息
    stage:{},               // 被选中的阶段信息
    groupList: [],          // 轮次或者分组list
    group: {},              // 被选中的分组或者轮次信息
    defaultStageIndex: '',   // 默认选中的赛事阶段index
    defaultGroupIndex: 0,   // 默认选中的赛事轮次index
    staticGroupIndex: 0 ,   // 默认选中的赛事轮次index不会变化
    matchData: [],          // 比赛数据
    rankDataList:[],        // 积分队伍数据
    rankColorArr:{},        // 积分颜色数据
    isRankorTeam: true      // 是展示排名还是队伍信息
}