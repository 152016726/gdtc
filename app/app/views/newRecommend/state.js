/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */

export default {
    flatListData: [],                // 列表数据
    orderBy: '0',                    // 排序规则 0: 综合排序 1: 近5场 2: 连胜 3: 周命中率 4: 月命中率
    type: '0',                       // 荐单类型, 0: 全部; 1: 胜平负2串1; 2: 单关; 3: 总进球
    pageIndex: '0',                  // 页面索引
    isFooter: false,                 // 数据是否加载完成
    lids: [],                        // 选中的联赛
    leagueList: [],                  // 所有推单的联赛
    isNoRecommend: false             // 是否没有最新推荐
}