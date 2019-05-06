/**
 * 定义字典数据
 * Created by DDT on 2018/10/30.
 */
import * as EventState from '../../constants/eventState';
import * as MatchStatisticsType from '../../constants/matchStatisticsType';

module.exports = {
    // 比赛状态字典
    eventState: [
        {id: EventState.CANCEL_MATCH,   text: '取消比赛', shortText: '取消'},
        {id: EventState.NOT_START,      text: '未开赛', shortText: '未'},
        {id: EventState.FIRST_HALF,     text: '上半场', shortText: '上'},
        {id: EventState.HALF_TIME,      text: '上半场完', shortText: '中'},
        {id: EventState.SECOND_HALF,    text: '下半场', shortText: '下'},
        {id: EventState.OT_FIRST_HALF,  text: '加时上半场', shortText: '加时上'},
        {id: EventState.OT_HALF_TIME,   text: '加时上半场完', shortText: '加时中'},
        {id: EventState.OT_SECOND_HALF, text: '加时下半场', shortText: '加时下'},
        {id: EventState.PENALTY_KICK,   text: '12码', shortText: '12码'},
        {id: EventState.FULL_TIME,      text: '完场', shortText: '完'},
        {id: EventState.BREAK_OFF,      text: '比赛中断', shortText: '中断'},
        {id: EventState.UNDETERMINED,   text: '比赛待定', shortText: '待定'},
        {id: EventState.PUT_OFF,        text: '比赛推迟', shortText: '推迟'},
        {id: EventState.CUTTING_MATCH,  text: '比赛腰斩', shortText: '腰斩'}
    ],
    // 比赛统计数据
    matchStatisticsType: [
        {id: MatchStatisticsType.CORNER_BALL,       text: '角球'},
        {id: MatchStatisticsType.HALF_CORNER_BALL,  text: '半场角球'},
        {id: MatchStatisticsType.YELLOW_CARD_ALL,   text: '黄牌'},
        {id: MatchStatisticsType.RED_CARD_ALL,      text: '红牌'},
        {id: MatchStatisticsType.SHOTS,             text: '射门'},
        {id: MatchStatisticsType.SHOT_ON_TARGET,    text: '射正'},
        {id: MatchStatisticsType.ATTACK,            text: '进攻'},
        {id: MatchStatisticsType.DANGEROUS_ATTACK,  text: '危险进攻'},
        {id: MatchStatisticsType.FOULS,             text: '犯规'},
        {id: MatchStatisticsType.FREE_KICKS,        text: '任意球'},
        {id: MatchStatisticsType.POSSESSION,        text: '控球率'},
        {id: MatchStatisticsType.HALF_POSSESSION,   text: '半场控球率'},
        {id: MatchStatisticsType.OFFSIDE,           text: '越位'},
        {id: MatchStatisticsType.PASSES,            text: '传球'},
        {id: MatchStatisticsType.SHOT_SAVES,        text: '救球'},
        {id: MatchStatisticsType.HEADER,            text: '头球'},
        {id: MatchStatisticsType.TACKLES,           text: '铲球'},
        {id: MatchStatisticsType.THROW_IN,          text: '界外球'},
        {id: MatchStatisticsType.CROSSES,           text: '过人'},
        {id: MatchStatisticsType.SHOT_WOOD_WORK,    text: '中柱'},
        {id: MatchStatisticsType.FIRST_KICK_OFF,    text: '先开球'}
    ]
};