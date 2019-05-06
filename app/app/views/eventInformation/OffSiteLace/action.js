/**
 * Created by mac-ddt on 2018/9/3.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import getInformationList from '../../../services/getInformationList';
import {OFFSITELACE_NODEID, PAGE_SIZE, DEVICER_TYPE} from '../../../constants/articleConfig';

let actions = {
    /**
     * 数据接口请求
     * @param pageIndexNum 页码
     * @returns {Function}
     */
    reqData(pageIndexNum = 0) {
        return ((dispatch, getState) => {
            let {informationList} = getState()[storeKey.SITELACE_STORE];
            let isFooter = false;
            let defNodeReq = {
                nodeIds: [OFFSITELACE_NODEID],  // 场外花边文章的 nodeId
                deviceType: DEVICER_TYPE,       // 设备类型
                pageIndex: pageIndexNum,
                pageSize: PAGE_SIZE             // 每次请求数据的条数
            };
            informationList = pageIndexNum === 0 ? [] : informationList;

            getInformationList.getData(defNodeReq).then(rsp => {
                if (rsp.data.list.length > 0) {
                    if (rsp.data.list.length < PAGE_SIZE) isFooter = true;
                    dispatch(actions.updateData({
                        informationList: informationList.concat(rsp.data.list),
                        pageIndex: pageIndexNum,
                        isFooter: isFooter
                    }))
                } else {
                    dispatch(actions.updateData({
                        pageIndex: --pageIndexNum,
                        isFooter: true
                    }))
                }
            })
        })
    },

    /**
     * 上拉加载更多
     * @returns {Function}
     */
    pullUpLoad() {
        return ((dispatch, getState) => {
            let {pageIndex} = getState()[storeKey.SITELACE_STORE];
            pageIndex++;
            dispatch(actions.reqData(pageIndex));
        })
    },

    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle() {
        return ((dispatch, getState) => {
            dispatch(actions.reqData());
        })
    },

    updateData: createAction(ActionTypes.UPDATE_SITELACE, (dataObj) => dataObj)
};

export default actions