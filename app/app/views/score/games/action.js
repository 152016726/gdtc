import { createAction } from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import getScoreList from '../../../services/getScoreList';
import { PAGE_SIZE, DEVICER_TYPE } from '../../../constants/articleConfig';
import getAttentionMatchList from '../../../services/getAttentionMatchList';

let actions = {
    /**
     * 数据请求
     * @param
     * @returns {Function}
     */
    reqData(dateStr){
        return ((dispatch, getState) => {
            let { gamesList,pageIndex } = getState()[ storeKey.SCORE_GAMES ];
            let defNodeReq = {
                tabType : 3,
                to : dateStr,
                from : dateStr
            };

            let { registrationID } = getState()[storeKey.ROOT_PAGE_STORE];

            let reqData = { registrationID : registrationID };
            //获取比赛列表
            getScoreList.getGamesData(defNodeReq).then(rsp => {
                new Promise((resolve) =>{
                    if (rsp.data.events.length > 0) {
                        /**
                         * 排序
                         */
                        rsp.data.events.sort((a, b) => {
                            return Date.prototype.parseISO8601(a.vsDate) - Date.prototype.parseISO8601(b.vsDate);
                        });
                        //获取已收藏的比赛vid
                        getAttentionMatchList.getData(reqData)
                            .then(data => {
                                let res = data.data.vids;
                                if(res) {
                                    for(let i = 0 ;i < res.length ; i ++){
                                        let tempA = res[i];
                                        for(let j = 0 ;j < rsp.data.events.length;j++){
                                            let tempB = rsp.data.events[j];
                                            //对比两个数组的vid 合并和标记收藏 找出相同项
                                            if( parseInt(tempA) === parseInt(tempB.vid)  ){
                                                Object.assign(tempB,{isFavourite:true});
                                                break;
                                            }
                                        }
                                    }
                                    //找出不同项
                                    for(let i = 0 ;i < rsp.data.events.length;i++){
                                        if(!rsp.data.events[i].isFavourite){
                                            Object.assign(rsp.data.events[i],{isFavourite:false});
                                        }
                                    }
                                }
                                resolve(rsp.data.events);
                            })
                            .catch(e=>{});
                    }else{
                        resolve([]);
                    }

                }).then((data)=>{
                    dispatch(actions.updateData({
                        gamesList : data,
                        dateStr:dateStr,
                        pageIndex:2
                    }))
                    dispatch(actions.updateScoreList(data));
                })

            }).catch(e=>{});

        })
    },

    /**
     * 上拉加载更多 Pull up loading
     * @returns {Function}
     */
    pullUpLoad(){
        return ((dispatch, getState) => {
            let { pageIndex, dateStr } = getState()[ storeKey.SCORE_GAMES ];
            pageIndex++;
            dispatch(actions.reqData(dateStr, pageIndex));
        });

    },
    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle(){
        return ((dispatch, getState) => {
            let { dateStr } = getState()[ storeKey.SCORE_GAMES ];
            dispatch(actions.reqData(dateStr));
            // console.log('下拉刷新');
        })
    },
    /**
     * 筛选时传数据到外层进行筛选操作
     * @returns {function(*, *)}
     */
    updateScoreList(data){
        return((dispatch, getState) => {
                dispatch(actions.updateScoreData({
                    dataList:data
                }));
        })
    },
    updateScoreData:createAction(ActionTypes.UPDATE_SCORE, (dataObj) => dataObj),

    updateData : createAction(ActionTypes.UPDATE_GAMES, (dataObj) => dataObj)
};

export default actions