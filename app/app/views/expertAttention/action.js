/**
 * Created by mac-ddt on 2018/9/3.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys';
import getExpertGetExperts from '../../services/getExpertGetExperts';
import { PAGE_SIZE } from '../../constants/articleConfig';

let actions = {
    /**
     * 数据请求
     * @param pageIndexNum 页码
     * @returns {Function}
     */
    reqData(pageIndexNum = 0) {
        return ((dispatch, getState) => {
            let {dataList} = getState()[storeKey.EXPERT_ATTENTION_STORE];
            let isFooter = false;
            let attentionData = [];
            let reqData = {
                keywords: "",
                isAttention: "true",
                orderBy: "2",
                pageIndex: pageIndexNum,
                pageSize: PAGE_SIZE
            };
            dataList = pageIndexNum === 0 ? [] : dataList;  //有页码则进行数据叠加，没页码则赋值空数组进行重新赋值

            getExpertGetExperts.getData(reqData).then(rsp => {
                if (rsp.data.list.length > 0) {
                    if (rsp.data.list.length < PAGE_SIZE) isFooter = true;
                    attentionData = dataList.concat(rsp.data.list);

                    dispatch(actions.updateData({
                        dataList: attentionData,
                        pageIndex: pageIndexNum || 0,
                        isFooter: isFooter
                    }))
                } else {
                    dispatch(actions.updateData({
                        dataList:[],
                        pageIndex: --pageIndexNum,
                        isFooter: true
                    }))
                }
            }).catch((e)=>{
                console.log(e.rspMsg);
            })
        })
    },
    /**
     * 取消关注专家
     *  eid 专家id
     *
     */
    cancelExpert(eid,fn){
        return ((dispatch, getState) => {
            let reqData = {
                isAttention: "false",
                eid:eid
            };
            getExpertGetExperts.handleInterestedExperts(reqData).then(rsp => {
                fn();
                console.log(rsp);
            }).catch((e)=>{
                console.log(e.rspMsg);
            })
        })
    },
    /**
     *  添加关注
     *  eid 专家id
     */
    addExpert(eid,fn){
        return ((dispatch, getState) => {
            let reqData = {
                isAttention: "true",
                eid:eid
            };
            getExpertGetExperts.handleInterestedExperts(reqData).then(rsp => {
                fn();
                console.log(rsp);
            }).catch((e)=>{
                console.log(e.rspMsg);
            })
        })
    },
    /**
     * 上拉加载更多 Pull up loading
     * @returns {Function}
     */
    pullUpLoad() {
        return ((dispatch, getState) => {
            let {pageIndex} = getState()[storeKey.EXPERT_ATTENTION_STORE];
            pageIndex++;
            dispatch(actions.reqData(pageIndex));
        });

    },

    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle() {
        return ((dispatch, getState) => {
            dispatch(actions.reqData());
            // console.log('下拉刷新');
        })
    },

    updateData: createAction(ActionTypes.UPDATE_EXPERT_ATTENTION, (dataObj) => dataObj)
};

export default actions