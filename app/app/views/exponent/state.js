/**
 * Created by mac-ddt on 2018/8/10.
 */
import {oddsCfg, filterOpsConf} from './filterOpsConf'

export default {
    events: [],               //赛事数组
    eventsAll: [],            //所有赛事数组
    dateList: [],             //当前日期前三后七天日期
    leagueList: [],           //保存当前日期的联赛
    filterOps: filterOpsConf,
    oddsCfg: oddsCfg,
    count: 0                 //共有多少场比赛
}