/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */

export default{
    isExpert: false,            // 当前用户是否是专家
    flatListData: [],           // 最新推单列表
    expertList: [],             // 专家列表
    needShowSorts: [],          // 专家进入赛程需要显示的玩法
    loginStatus: 0,             // 登录状态0  未登录 1   已登录
    MaxHeight: 0,               // 页面最大高度
    pageIndex: '0',             // 页码
    isFooter: false,            // 推荐是否已加载完
    isNoRecommend: false,       // 是否没有最新推荐
    isActiveNum: 0,             // 当前的推荐状态 0=>最新推荐 1=>昨日推荐
    isReceiveProps: false,      // 是否刷新页面重新请求数据
    isShowExpert: false         // 是否展示专家模块
}