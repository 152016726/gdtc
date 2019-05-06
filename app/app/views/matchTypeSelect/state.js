/**
 * Created by owen on 2018/8/10.
 */
import oddsRangeData from '../../common/js/oddsRangeData'

export default {
    oddsRangeList: oddsRangeData.data,    //赔率区间 列表数据
    matchTypeVal: [],                     //赛事选择 已选择数据
    oddsVal: [],                          //赔率区间 已选择数据
    companyVal: [],                       //公司筛选 已选择数据
    matchCanSelect: 0                     //多少场比赛可选，用redux改变
}