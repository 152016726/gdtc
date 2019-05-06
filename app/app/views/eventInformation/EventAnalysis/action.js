/**
 * Created by easyLottoMac on 2018/9/3.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import getInformationList from '../../../services/getInformationList';
import getUnderlingNodesById from '../../../services/getUnderlingNodesById';
import {
    ANALYSIS_NODEID,
    PAGE_SIZE,
    DEVICER_TYPE,
    ANALYSIS_NODEIDS
} from '../../../constants/articleConfig';

let actions = {

    /**
     * 文章列表请求
     * @param nodeIds 文章 id
     * @param pageIndex 文章页码
     * @returns {Function}
     */
    reqData(nodeIds = [], pageIndex = 0) {
        return ((dispatch, getState) => {
            let {leagueMatch} = getState()[storeKey.ANALYSIS_STORE];
            let isFooter = false;
            let listArr = [];
            if(nodeIds.length <=0){             // nodeIds默认为当前栏目的全部数据
                nodeIds = leagueMatch[0].nodeIds;
            }
            let defNodeReq = {
                nodeIds: nodeIds,               // 请求文章的 nodeId
                deviceType: DEVICER_TYPE,       // 设备类型
                pageIndex: pageIndex,           // 页码
                pageSize: PAGE_SIZE             // 每页显示的条数
            };
            getInformationList.getData(defNodeReq).then(rsp => {
                leagueMatch.forEach((list, i) => {
                    if (list.nodeIds === nodeIds) {
                        if (rsp.data.list.length > 0) {             // 上拉加载更多的逻辑
                            if (rsp.data.list.length < PAGE_SIZE) isFooter = true;
                            listArr = pageIndex === 0 ? [] : list.content;
                            list.content = listArr.concat(rsp.data.list);
                            list.pageIndexNum = pageIndex;
                            list.isFooter = isFooter;
                        } else {                                    // 上拉加载更多若没有数据则显示脚部 tips，回退页码
                            list.pageIndexNum = --pageIndex;
                            list.isFooter = true;
                        }
                    }
                });
                dispatch(actions.updateData({
                    leagueMatch: leagueMatch.concat([])              // 改变数组使View重新 render
                }))
            })
        })
    },

    /**
     *   tab 栏目 id 数据请求
     * @returns {Function}
     */
    reqTitleData() {
        return ((dispatch, getState) => {
            let leagueMatch = [{
                name:'全部',
                nodeIds: ANALYSIS_NODEIDS,
                content:[],
                pageIndex:0,
                isFooter: false
            }];
            let obj = {
                nodeId: ANALYSIS_NODEID
            };
            getUnderlingNodesById.getData(obj).then((rsp) => {
                let rspData = rsp.data.list;
                let AllNodeIds = [];
                rspData.forEach((list) => {                         // 根据栏目 id 创建相对应的 list 内容栏目
                    AllNodeIds.push(list.nodeId);
                    let obj = {
                        name: list.name,
                        content: [],
                        pageIndexNum: 0,
                        nodeIds:[list.nodeId]
                    };
                    leagueMatch.push(obj);
                });
                leagueMatch[0].nodeIds = AllNodeIds;                // 记录赛事分析页面的所有栏目 ID
                dispatch(actions.updateData({
                    leagueMatch: leagueMatch                        // 拼接栏目数组
                }));
                dispatch(actions.reqData(AllNodeIds));              // 请求赛事数据
            })
        })
    },

    /**
     *  tab栏切换事件
     * @param eObj
     * @returns {Function}
     */
    changeTabHandle(eObj) {
        return ((dispatch, getState) => {
            let {leagueMatch} = getState()[storeKey.ANALYSIS_STORE];
            let nodeId = leagueMatch[eObj.i].nodeIds;
            if (leagueMatch[eObj.i].content.length <= 0) {          // 只在第一次切换 tab 时请求数据
                dispatch(actions.reqData(nodeId));                  // 根据 nodeId 请求数据
            }
            dispatch(actions.updateData({                           // 记录当前的 tab 索引下标
                activeIndex: eObj.i
            }))
        })
    },

    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle() {
        return ((dispatch, getState) => {
            let {activeIndex, leagueMatch} = getState()[storeKey.ANALYSIS_STORE];
            let nodeId = leagueMatch[activeIndex].nodeId;           // 获取当前页面的赛事 nodeId
            dispatch(actions.reqData(nodeId));                      // 根据 nodeId 重新获取数据
        })
    },

    /**
     * 上拉加载更多
     * @returns {Function}
     */
    pullUpLoad() {
        return ((dispatch, getState) => {
            let {activeIndex, leagueMatch} = getState()[storeKey.ANALYSIS_STORE];
            let pageIndex = leagueMatch[activeIndex].pageIndexNum;
            let nodeId = leagueMatch[activeIndex].nodeId;
            pageIndex++;
            dispatch(actions.reqData(nodeId, pageIndex));           // 根据 nodeId以及页码请求数据
        })
    },

    updateData: createAction(ActionTypes.UPDATE_ANALYSIS, (dataObj) => dataObj)
};

export default actions