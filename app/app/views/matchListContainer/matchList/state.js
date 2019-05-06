export default {
    filterOps: {
        sort: 'mix',        //默认选中的玩法
        selLeague: [],      //联赛类型,可多选，默认全选
        selRate: '-',       //赔率区间 只有胜平负以及让球胜平负玩法有这个刷选，默认全选, 全选为'-'，1.5以下为0，1.5-2.0为1， 2.0以上为2
    },
    selSort: 'mix',         //当前选中的玩法
    leagueList: [],         //联赛信息
    isRefreshing: false,    //是否在刷新
    outcomeCount: 0,        //当前选中的注数
    betslipList: [],        //betslip当前的赛事数
    eventCount: 0,          //所选赛事的场数
    outcomeList: [],        //投注揽现有的注项
    count: 0,               //当前显示的赛事场数
    currentKey: '',         // 当前操作的outcome对应的key [+key] 代表增加赔率，[-key] 代表代表删除赔率

    isNullData: false,      // 是否没有数据展示
    grpEvent: {},           // 按日期分组的赛事
    hideGrp: [],            // 隐藏组元素对应key
}