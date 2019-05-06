/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'
import * as storeKey from '~/constants/storeKeys'
import Account from '#/account';
import getRecommendationList from '~/services/getRecommendationList';
import getExpertList from '~/services/getExpertGetExperts';

const PAGESIZE = '20';                  // 请求的推荐单列表数
const ONEDAYTIME = 24 * 60 * 60 * 1000; // 一天的毫秒数

let actions = {
    /**
     * 最新推单列表
     * @returns {Function}
     */
    getRecommendationData() {
        return ((dispatch, getState) => {
            let {flatListData, pageIndex, isActiveNum} = getState()[storeKey.EXPERT_HOME_STORE];
            let _nowDate = new Date();
            if (isActiveNum) {
                _nowDate = new Date(_nowDate.getTime() - ONEDAYTIME);
            }
            let dataStr = _nowDate.format('yyyy-MM-dd');
            /**
             * 查看最新推荐时isHistory参数为false,查看昨天推荐时isHistory参数为true -ljx 2019/01/18
             **/
            let reqObj = Object.assign({},
                {
                    type: '0',
                    orderBy: '0',
                    date: isActiveNum ? dataStr: '',
                    pageIndex,
                    pageSize: PAGESIZE
                },
                isActiveNum ? {isHistory: "true"} : {isHistory: "false"}
            );
            if (!parseInt(pageIndex)) {
                flatListData = [];
            }
            getRecommendationList.getData(reqObj).then(rsp => {
                dispatch(actions.updateData({
                    flatListData: flatListData.concat(rsp.data.list),
                    isFooter: rsp.data.list.length < PAGESIZE,
                    pageIndex: !parseInt(pageIndex) ? pageIndex : --pageIndex,
                    isNoRecommend:!parseInt(pageIndex) && !(rsp.data.list.length)
                }));
            }, err => {
                console.log(err);
            })
        })
    },

    /**
     * 精选专家团列表
     * @returns {Function}
     */
    getExpertListData() {
        return ((dispatch, getState) => {
            let reqObj = {
                keywords: "",
                isAttention: "false",
                orderBy: "2",
                pageIndex: "0",
                pageSize: "8"
            };
            getExpertList.getData(reqObj).then(rsp => {
                dispatch(actions.updateData({
                    expertList: rsp.data.list
                }))
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
            let {MaxHeight, pageIndex, isFooter} = getState()[storeKey.EXPERT_HOME_STORE];
            let contentHeight = eNative.contentOffset.y + eNative.layoutMeasurement.height;         // 计算页面的总高度
            // 确保只有滑到页面底部才开始重新请求数据且只请求一次
            if (parseInt(contentHeight) === parseInt(eNative.contentSize.height)
                && eNative.contentSize.height > MaxHeight
                && !isFooter) {
                dispatch(actions.updateData({
                    MaxHeight: eNative.contentSize.height,
                    pageIndex: ++pageIndex
                }));
                dispatch(actions.getRecommendationData())
            }
        })
    },

    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshPress() {
        return ((dispatch, getState) => {
            dispatch(actions.updateAllInfo());
        })
    },
    /**
     * 获取用户信息
     */
    getAccountInfo() {
        return ((dispatch, getState) => {
            const {
                isExpert = false, needShowSorts = [], loginStatus = 0, isSpecialist='false',
                isOwner='false'
            } = Account.getAccountInfo() || {};
            dispatch(actions.updateData({
                isExpert: isExpert,
                needShowSorts: needShowSorts,
                loginStatus: loginStatus,
                isShowExpert: isSpecialist === 'true' || isOwner === 'true' || isExpert === 'true'
            }))
        })
    },
    /**
     * 页面的数据更新
     * @returns {Function}
     */
    updateAllInfo() {
        return ((dispatch, getState) => {
            // 判断时间是否是11点之前
            let _nowDate = new Date();
            let dataStr = _nowDate.format('yyyy-MM-dd');
            let tenHDate = Date.prototype.parseISO8601(dataStr + ' 11:00:00');
            // 判断当前是时间是否是10点半前，若是则默认优先显示昨天推荐
            if (tenHDate.getTime() > _nowDate.getTime()) {
                dispatch(actions.updateData({
                    isActiveNum: 1
                }))
            }
            dispatch(actions.updateData({
                pageIndex: '0',
                MaxHeight: 0,
                flatListData: []
            }));
            dispatch(actions.getAccountInfo());
            dispatch(actions.getRecommendationData());
            dispatch(actions.getExpertListData());
        })
    },

    /**
     * 推荐title按钮事件
     * @param HA
     * @returns {Function}
     */
    titleRECHandle(HA) {
        return ((dispatch, getState) => {
            dispatch(actions.updateData({
                isActiveNum: HA.statusNum
            }));
            dispatch(actions.getRecommendationData());
        });

    },

    updateData: createAction(ActionTypes.UPDATE_EXPERT_HOME, (obj) => obj)
};

export default actions;