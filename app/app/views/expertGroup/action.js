/**
 * Created by easyLottoMac_Feng on 2019/1/2.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'
import * as storeKey from '~/constants/storeKeys'
import getExpertList from "~/services/getExpertGetExperts";

const PAGESIZE = '40';

let actions = {

    /**
     * 精选专家团列表
     * @returns {Function}
     */
    getExpertListData() {
        return ((dispatch, getState) => {
            let {expertList, pageIndex} = getState()[storeKey.EXPERT_GROUP_STORE];
            let reqObj = {
                keywords: "",
                isAttention: "false",
                orderBy: "2",
                pageIndex,
                pageSize: PAGESIZE
            };
            if (pageIndex === '0') {
                expertList = [];
            }
            getExpertList.getData(reqObj).then(rsp => {
                dispatch(actions.updateData({
                    expertList: expertList.concat(rsp.data.list),
                    isFooter: rsp.data.list.length < PAGESIZE
                }));
            })
        })
    },

    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle() {
        return ((dispatch, getState) => {
            dispatch(actions.getExpertListData());
            dispatch(actions.updateData({
                expertList: [],
                pageIndex: '0'
            }));
        })
    },

    /**
     * 上拉加载更多
     * @returns {Function}
     */
    pullUpLoad() {
        return ((dispatch, getState) => {
            let {pageIndex, isFooter} = getState()[storeKey.EXPERT_GROUP_STORE];
            if (isFooter) return;
            dispatch(actions.updateData({
                pageIndex: ++pageIndex
            }));
            dispatch(actions.getExpertListData());

        })
    },

    updateData: createAction(ActionTypes.UPDATE_EXPERT_GROUP, (obj) => obj)
};

export default actions;