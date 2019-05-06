/**
 * Created by mac-ddt on 2018/9/3.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import getInformationList from '../../../services/getInformationList';
import {PAGE_SIZE, DEVICER_TYPE, PLAYING_SKILLS_NODEID} from '../../../constants/articleConfig';

let actions = {
    /**
     * 文章列表接口请求
     * @param pageIndexNum
     * @returns {Function}
     */
    reqData(pageIndexNum = 0) {
        return ((dispatch, getState) => {
            let {informationList} = getState()[storeKey.PSKILLS_STORE];
            let defNodeReq = {
                nodeIds: [PLAYING_SKILLS_NODEID],
                deviceType: DEVICER_TYPE,
                pageIndex: pageIndexNum,
                pageSize: PAGE_SIZE
            };
            // 有页码则进行数据叠加，没页码则赋值空数组进行重新赋值
            informationList = pageIndexNum === 0 ? [] : informationList;
            getInformationList.getData(defNodeReq).then(rsp => {
                if (rsp.data.list.length > 0) {                             // 若数据不为空，则进行数据叠加
                    dispatch(actions.updateData({
                        informationList: informationList.concat(rsp.data.list),
                        pageIndex: pageIndexNum || 0,
                        isFooter: rsp.data.list.length < PAGE_SIZE
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
            let {pageIndex, isFooter} = getState()[storeKey.PSKILLS_STORE];
            if(isFooter) return;
            pageIndex++;
            dispatch(actions.reqData(pageIndex));
        });
    },
    /**
     * 下拉刷新功能
     * @returns {Function}
     */
    refreshHandle() {
        return ((dispatch, getState) => {
            dispatch(actions.reqData());
        })
    },

    updateData: createAction(ActionTypes.UPDATE_PSKILLS, (dataObj) => dataObj)
};

export default actions