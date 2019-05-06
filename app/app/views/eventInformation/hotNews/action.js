/**
 * Created by mac-ddt on 2018/9/3.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import getInformationList from '../../../services/getInformationList';
import {HOT_NEWS_NODEID, PAGE_SIZE, DEVICER_TYPE} from '../../../constants/articleConfig';

let actions = {
    /**
     * 数据请求
     * @param pageIndexNum 页码
     * @returns {Function}
     */
    reqData(pageIndexNum = 0) {
        return ((dispatch, getState) => {
            let {informationList} = getState()[storeKey.HOTNEWS_STORE];
            let isFooter = false;
            let defNodeReq = {
                nodeIds: [HOT_NEWS_NODEID],
                deviceType: DEVICER_TYPE,
                pageIndex: pageIndexNum,
                pageSize: PAGE_SIZE
            };
            informationList = pageIndexNum === 0 ? [] : informationList;  //有页码则进行数据叠加，没页码则赋值空数组进行重新赋值

            getInformationList.getData(defNodeReq).then(rsp => {
                if (rsp.data.list.length > 0) {
                    if (rsp.data.list.length < PAGE_SIZE) isFooter = true;
                    dispatch(actions.updateData({
                        informationList: informationList.concat(rsp.data.list),
                        pageIndex: pageIndexNum || 0,
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
     * 上拉加载更多 Pull up loading
     * @returns {Function}
     */
    pullUpLoad() {
        return ((dispatch, getState) => {
            let {pageIndex} = getState()[storeKey.HOTNEWS_STORE];
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

    updateData: createAction(ActionTypes.UPDATE_HOTNEWS, (dataObj) => dataObj)
};

export default actions