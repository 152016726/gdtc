/**
 * Created by mac-ddt on 2018/9/3.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys';
import getMyProjectData from '../../services/getMyProjectDataList';
import { HOT_NEWS_NODEID, PAGE_SIZE, DEVICER_TYPE} from '../../constants/articleConfig';

let actions = {
    /**
     * 数据请求
     * @param pageIndexNum 页码
     * @returns {Function}
     */
    reqData(pageIndexNum = 0) {
        return ((dispatch, getState) => {
            let {dataList} = getState()[storeKey.MY_PROJECT];
            let isFooter = false;
            let projectData = [];
            let defNodeReq = {
                pageIndex: pageIndexNum,
                pageSize: PAGE_SIZE
            };
            dataList = pageIndexNum === 0 ? [] : dataList;  //有页码则进行数据叠加，没页码则赋值空数组进行重新赋值

            getMyProjectData.getData(defNodeReq).then(rsp => {
                if (rsp.data.length > 0) {
                    if (rsp.data.length < PAGE_SIZE) isFooter = true;
                    projectData = dataList.concat(rsp.data);


                    dispatch(actions.updateData({
                        dataList: dataList.concat(rsp.data),
                        pageIndex: pageIndexNum || 0,
                        isFooter: isFooter
                    }))
                } else {
                    dispatch(actions.updateData({
                        pageIndex: --pageIndexNum,
                        dataList: [],
                        isFooter: true
                    }))
                }
            }).catch((e)=>{
                console.log(e.rspMsg);
            })
        })
    },
    /**
     * 删除方案
     */
    handleDelete(id){
        return ((dispatch,getState)=>{
            getMyProjectData.deleteData({id:id}).then(rsp=>{
                if(rsp){
                    dispatch(actions.reqData());
                }
            }).catch((e)=>{
                console.log(e);
            });
        });
    },

    /**
     * 上拉加载更多 Pull up loading
     * @returns {Function}
     */
    pullUpLoad() {
        return ((dispatch, getState) => {
            let {pageIndex} = getState()[storeKey.MY_PROJECT];
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

    updateData: createAction(ActionTypes.UPDATE_MY_PROJECT, (dataObj) => dataObj)
};

export default actions