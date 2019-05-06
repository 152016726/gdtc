/**
 * Created by mac-ddt on 2018/8/10.
 */
export default {
    data: [],                 //比分列表数据
    dataAll: [],              //初次请求的所有比分列表数据
    matchTypeList: [],
    showDialog: true,         //是否现实弹窗
    datePickerIOSVisi: false, //是否显示datePickerIOS
    refreshing: false,
    showDatePicker: false,
    lArr: [],                 //联赛信息
    leagueId: [],             //更新列表接口参数 联赛id
    startDate: '',            //更新列表接口参数 开始时间(暂时不需要改变，只起到初始值作用，endDate相同)
    endDate: '',              //更新列表接口参数 截止时间
    showScoreListIndex: 0,    //显示第几个列表
    initDate: '',             //日期插件的初始化时间
    matchCanSelect: 0         //筛选页面显示的共有多场比赛
}