/**
 * Created by mac-ddt on 2018/8/14.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import MarketSort from '../../constants/MarketSort';
import * as storeKey from '../../constants/storeKeys'
import getHomeMarketList from '../../services/getMatchListService';
import getInformationList from '../../services/getInformationList';
import getHomeBannerList from '../../services/getHomeBanner';
import {
    PAGE_SIZE,
    DEVICER_TYPE,
    EXPERT_NODEID,
    HOME_INFORMATIONS
} from '../../constants/articleConfig';
import {HOME_BANNER_PAGEID} from '../../constants/articleConfig';

let actions = {
    /**
     * 轮播图的数据请求
     * @returns {Function}
     */
    getHomeBanner() {
      return ((dispatch, getState)=>{
          let reqObj = {
              pageId: HOME_BANNER_PAGEID
          };
          getHomeBannerList.getData(reqObj).then(rsp => {
              dispatch(actions.updateHomeData({
                  bannerList: rsp.data.list
              }))
          })
      })
    },

    /**
     *  焦点赛事数据
     * @returns {Function}
     */
    getFocusMarket() {
        return ((dispatch, getState) => {
            let obj = {
                isFocus: true,
                getWay: "include",
                include: [MarketSort.WIN_DRAW_WIN]
            };
            getHomeMarketList.getData(obj).then((rsp) => {
                let MarketObj = {
                    focusMarkets: actions.setEventsData(rsp.data.events),
                    hasMakert: rsp.data.events.length > 0
                };
                dispatch(actions.updateHomeData(MarketObj))
            }, (rsb) => {
                dispatch(actions.updateHomeData({
                    focusMarkets: []
                }))
            })
        })
    },

    /**
     *  赛事资讯文章列表数据
     * @param pageIndexNum 页码
     * @param MaxHeight 页面的最大高度
     * @returns {Function}
     */
    getInformationList(pageIndexNum = 0, MaxHeight = 0) {
        return ((dispatch, getState) => {
            let {information} = getState()[storeKey.HOME_STORE];
            let isFooter = false;
            let rspObj = {
                nodeIds: HOME_INFORMATIONS,         // 请求竞彩资讯文章列表
                deviceType: DEVICER_TYPE,           // 设别类型
                pageIndex: pageIndexNum,            // 页码
                pageSize: PAGE_SIZE                 // 每次请求的文章条数
            };
            information = pageIndexNum === 0 ? [] : information;
            getInformationList.getData(rspObj).then((rsp) => {
                if (rsp.data.list.length > 0) {
                    if (rsp.data.list.length < PAGE_SIZE) isFooter = true;      // 若条数不足请求条数则显示到底提示
                    dispatch(actions.updateHomeData({
                        information: information.concat(rsp.data.list),         // 储存资讯文章 list
                        pageIFIndex: pageIndexNum,  // 记录页面的最高高度
                        MaxHeight: MaxHeight,       // 记录页面的最高高度
                        isFooterIF: isFooter
                    }))
                } else {                            // 当资讯文章已加载完
                    dispatch(actions.updateHomeData({
                        pageIFIndex: --pageIndexNum,
                        MaxHeight: 0,
                        isFooterIF: true
                    }))
                }
            })
        })
    },

    /**
     * 专家预测文章列表数据
     * @param pageIndexNum 页码
     * @param MaxHeight 页面的最大高度
     * @returns {Function}
     */
    getExpertsList(pageIndexNum = 0, MaxHeight = 0) {
        return ((dispatch, getState) => {
            let {expertsList} = getState()[storeKey.HOME_STORE];
            let isFooter = false;
            let rspObj = {
                nodeIds: [EXPERT_NODEID],
                deviceType: DEVICER_TYPE,
                pageIndex: pageIndexNum,
                pageSize: PAGE_SIZE
            };
            expertsList = pageIndexNum === 0 ? [] : expertsList;
            getInformationList.getData(rspObj).then((rsp) => {
                if (rsp.data.list.length > 0) {
                    if (rsp.data.list.length < PAGE_SIZE) isFooter = true;
                    dispatch(actions.updateHomeData({
                        expertsList: expertsList.concat(rsp.data.list),         // 储存专家文章 list
                        pageExIndex: pageIndexNum,      // 记录页面的最高高度
                        MaxHeight: MaxHeight,           // 记录页面的最高高度
                        isFooterEx: isFooter
                    }))
                } else {
                    dispatch(actions.updateHomeData({
                        pageExIndex: --pageIndexNum,
                        MaxHeight: 0,
                        isFooterEx: true
                    }))
                }
            })
        })
    },

    /**
     * 上拉加载更多
     * @param eNative scrollView 的滚动事件
     * @returns {Function}
     */
    onScrollHandle(eNative) {
        return ((dispatch, getState) => {
            let {pageExIndex, MaxHeight, pageIFIndex, isFooterIF, isFooterEx} = getState()[storeKey.HOME_STORE];
            let {activeIndex} = getState()[storeKey.HOME_SMG_STORE];                                // 获取文章显示的下标索引
            let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height;         // 计算页面的总高度
            switch (activeIndex) {
                case 0:
                    let isLoadingIF = false;
                    if(!isFooterIF) {
                        isLoadingIF = (eNative.contentOffset.y + eNative.layoutMeasurement.height) > eNative.contentSize.height;
                    }
                    dispatch(actions.updateHomeData({
                        isLoadingIF: isLoadingIF
                    }));
                    break;
                case 1:
                    let isLoadingEx = false;
                    if(!isFooterEx) {
                        isLoadingEx = (eNative.contentOffset.y + eNative.layoutMeasurement.height) > eNative.contentSize.height;
                    }
                    dispatch(actions.updateHomeData({
                        isLoadingEx: isLoadingEx
                    }));
                    break;
            }
            // 确保只有滑到页面底部才开始重新请求数据且只请求一次
            if (parseInt(contentHeight) === parseInt(eNative.contentSize.height) && eNative.contentSize.height > MaxHeight) {
                switch (activeIndex) {
                    case 0:
                        pageIFIndex++;
                        dispatch(actions.getInformationList(pageIFIndex, eNative.contentSize.height));
                        break;
                    case 1:
                        pageExIndex++;
                        dispatch(actions.getExpertsList(pageExIndex, eNative.contentSize.height));
                        break;
                }
            }
        })
    },


    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshPress() {
        return ((dispatch, getState) => {
            dispatch(actions.getHomeBanner());
            dispatch(actions.getFocusMarket());
            dispatch(actions.getInformationList());
            dispatch(actions.getExpertsList())
        })
    },

    /**
     * 焦点赛事的显示数据处理
     * @param events
     * @returns {*}
     */
    setEventsData(events) {
        let time = '2000-01-01';
        let simpleNo = "";
        let weekNum = '';
        let week = "";
        events = events.sort((a, b)=>{
            if (a.vsDate > b.vsDate) {
                return 1;
            } else {
                return - 1;
            }
        });
        events.forEach((event, index) => {
            weekNum = event.simpleNo.substring(0, 1);
            switch (weekNum) {
                case "1":
                    week = "周一";
                    break;
                case "2":
                    week = "周二";
                    break;
                case "3":
                    week = "周三";
                    break;
                case '4':
                    week = "周四";
                    break;
                case "5":
                    week = "周五";
                    break;
                case "6":
                    week = "周六";
                    break;
                case "0":
                    week = "周日";
                    break;
                default:
                    week = "";
            }
            let newData = Date.prototype.parseISO8601(event.vsDate);
            simpleNo = event.simpleNo.substring(1);
            time = week + simpleNo + ' ' + newData.format('MM-dd hh:mm');
            event.raceCourse = time
        });
        return events;
    },

    updateHomeData: createAction(ActionTypes.UPDATE_HOME, (MarketObj) => MarketObj)
};
export default actions