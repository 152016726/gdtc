import { createAction } from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import getScoreList from '../../../services/getScoreList';
import { PAGE_SIZE, DEVICER_TYPE } from '../../../constants/articleConfig';
import DictData from '../../../common/js/dictData';
import getAttentionMatchList from '../../../services/getAttentionMatchList';

let actions = {
    /**
     * 数据请求
     * @param pageIndexNum 页码
     * @returns {Function}
     */
    reqData(dateStr){
        return ((dispatch, getState) => {
            let defNodeReq = {
                tabType : 4,
                to : dateStr,
                from : dateStr
            };
            let { registrationID } = getState()[storeKey.ROOT_PAGE_STORE];
            let reqData = { registrationID : registrationID };
            //获取比赛列表
            getScoreList.getInstantData(defNodeReq).then(rsp => {
                new Promise((resolve) =>{
                    if (rsp.data.events.length > 0) {

                        rsp.data.events.sort((a, b) => {
                            return Date.prototype.parseISO8601(a.vsDate) - Date.prototype.parseISO8601(b.vsDate);
                        });

                        //将完场排最后 eventState为9
                        //将进行中的比赛往上排 2：上半场 4：下半场 5：加时上半场 7：加时下半场
                        let arr =[];
                        for(let i = 0;i < rsp.data.events.length;i++){
                            if(rsp.data.events[i].eventState === DictData.eventState[ 9 ].id){
                                arr.push(rsp.data.events[i]);
                                rsp.data.events.splice(i,1);
                                i--;
                            } else if(rsp.data.events[i].eventState === DictData.eventState[ 2 ].id ||
                                rsp.data.events[i].eventState === DictData.eventState[ 4 ].id ||
                                rsp.data.events[i].eventState === DictData.eventState[ 5 ].id ||
                                rsp.data.events[i].eventState === DictData.eventState[ 7 ].id
                            ){
                                rsp.data.events.unshift(rsp.data.events[i]);
                                rsp.data.events.splice(i+1,1);
                                i++;
                            }

                        }
                        rsp.data.events = rsp.data.events.concat(arr);

                        //到缓存中对比数据是否收藏了
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
                                                // console.log(tempA,tempB);
                                                Object.assign(tempB,{isFavourite:true});
                                                break;
                                            }
                                        }
                                    }
                                    //找出不同项
                                    for(let i = 0 ;i < rsp.data.events.length;i++){
                                        if( rsp.data.events[i].isFavourite === undefined){
                                            // console.log(rsp.data.events[i].isFavourite);
                                            Object.assign(rsp.data.events[i],{isFavourite:false});
                                        }
                                    }
                                }

                                resolve(rsp.data.events);
                            })
                            .catch(e=>{});
                    }
                }).then((data)=>{
                    dispatch(actions.updateData({
                        instantList : data,
                        dateStr:dateStr
                    }));
                    dispatch(actions.updateScoreList());
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
            let { dateStr } = getState()[ storeKey.SCORE_INSTANT ];
            dispatch(actions.reqData( dateStr ));
        });

    },
    /**
     * 下拉刷新
     * @returns {Function}
     */
    refreshHandle(){
        return ((dispatch, getState) => {
            let { dateStr } = getState()[ storeKey.SCORE_INSTANT ];
            dispatch(actions.reqData(dateStr));
        })
    },
    /**
     * 筛选时传数据到外层进行筛选操作
     * @returns {function(*, *)}
     */
    updateScoreList(){
       return((dispatch, getState) => {
           let { instantList } = getState()[ storeKey.SCORE_INSTANT ];
              dispatch(actions.updateScoreData({
                  dataList:instantList
              }));
       })
    },
    updateScoreData:createAction(ActionTypes.UPDATE_SCORE, (dataObj) => dataObj),

    updateData : createAction(ActionTypes.UPDATE_INSTANT, (dataObj) => dataObj)
};

export default actions