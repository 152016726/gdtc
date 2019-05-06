import { createAction } from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import getScoreList from '../../../services/getScoreList';
import { PAGE_SIZE, DEVICER_TYPE } from '../../../constants/articleConfig';

let actions = {
    /**
     * 数据请求
     * @param
     * @returns {Function}
     */
    reqData(dateStr){
        return ((dispatch, getState) => {
            let { completionList,pageIndex } = getState()[ storeKey.SCORE_COMPLETION ];
            let defNodeReq = {
                tabType : 2,
                to : dateStr,
                from : dateStr
            };

            getScoreList.getCompletionData(defNodeReq).then(rsp => {
                if (rsp.data.events.length > 0) {

                    rsp.data.events.sort((a, b) => {
                        return Date.prototype.parseISO8601(a.vsDate) - Date.prototype.parseISO8601(b.vsDate);
                    });

                    dispatch(actions.updateData({
                        completionList : rsp.data.events,
                        dateStr:dateStr
                    }))
                }else{
                    dispatch(actions.updateData({
                        completionList : [],
                        dateStr:dateStr
                    }))
                }
                dispatch(actions.updateScoreList());
            }).catch(e=>{});

        })
    },

    /**
     * 上拉加载更多 Pull up loading
     * @returns {Function}
     */
    pullUpLoad(){
        return ((dispatch, getState) => {
            let { dateStr } = getState()[ storeKey.SCORE_COMPLETION ];
            dispatch(actions.reqData(dateStr));
        });

    },

    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle(){
        return ((dispatch, getState) => {
            let { dateStr } = getState()[ storeKey.SCORE_COMPLETION ];
            dispatch(actions.reqData(dateStr));
            // console.log('下拉刷新');
        })
    },
    /**
     * 筛选时传数据到外层进行筛选操作
     * @returns {function(*, *)}
     */
    updateScoreList(){
        return((dispatch, getState) => {
            let { completionList,pageIndex } = getState()[ storeKey.SCORE_COMPLETION ];
                dispatch(actions.updateScoreData({
                    dataList:completionList
                }));
        })
    },
    updateScoreData:createAction(ActionTypes.UPDATE_SCORE, (dataObj) => dataObj),

    updateData : createAction(ActionTypes.UPDATE_COMPLETION, (dataObj) => dataObj)
};

export default actions