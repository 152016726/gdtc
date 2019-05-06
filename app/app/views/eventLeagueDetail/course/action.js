/**
 * Created by marcus on 2018/12/11.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from '../../../constants/storeKeys';
import getStages from '../../../services/getStages';
import getMuseumMatchs from '../../../services/getMuseumMatchs';
import getStandings from '../../../services/getStandings';
import getRounds from '../../../services/getRounds';

const type = 3; // 1: 赛季, 2: 阶段, 3: 轮次

let actions = {
     /**
     * 获取阶段信息 { "lid": "联赛id", "seasonId":"赛季id", }           
     * @returns {function()}
     */
    getStages(){
        return (
            (dispatch, getState) => {
                const {id, seasonId} = getState()[storeKey.EVENTLEAGUEDETAIL_STORE];
                getStages.getData({
                    lid: id,
                    seasonId
                }).then(rsp=> {
                    let flag = true;
                    let list = rsp.data.list;
                    dispatch(actions.updateState({
                        stageList: rsp.data.list,
                        isRankorTeam: true      // 每一次重新进入都重置为true让其默认展示队伍信息
                    }));
                    list.forEach((item, index)=>{
                        if(item.isCurrentStage === 'true'){
                            flag = false;
                            dispatch(actions.updateState({
                                defaultStageIndex: index,
                                stage: item
                            }));
                            // 更改默认的stageId
                            dispatch(actions.updateEventLeagueInfoState({
                                stageId: item.stageId
                            }))
                        }
                    });
                    // 如果list中没有正在进行的阶段则默认为最后一个
                    if(flag){
                        dispatch(actions.updateState({
                            defaultStageIndex: list.length - 1,
                            stage: list[list.length - 1]
                        }));
                        // 更改默认的stageId
                        dispatch(actions.updateEventLeagueInfoState({
                            stageId: list[list.length - 1].stageId
                        }))
                    }
                },rej=> {
                    dispatch(actions.updateState({
                        stageList: [],
                        defaultStageIndex: '',
                        stage: {}
                    }));
                    dispatch(actions.updateEventLeagueInfoState({
                        stageId: ''
                    }));
                    console.log(rej.rspMsg);
                });
            }
        )
    },
    /**
     * 获取分组或者轮次信息   { "lid": "联赛id", "seasonId":"赛季id", "stageId": "阶段id" }
     * @returns {function()}
     */
    getRoundsInfo(){
        return (
            (dispatch, getState) => {
                const {id, seasonId, stageId} = getState()[storeKey.EVENTLEAGUEDETAIL_STORE];
                getRounds.getData({
                    lid: id,
                    seasonId,
                    stageId
                }).then(rsp=> {
                    let flag = true;
                    let list = rsp.data.list;
                    dispatch(actions.updateState({
                        groupList: list
                    }));
                    list.forEach((item, index)=> {
                        if(item.isCurrentRound === 'true'){
                            flag = false;
                            dispatch(actions.updateState({
                                group: item,
                                defaultGroupIndex: index,
                                staticGroupIndex: index
                            }));
                            dispatch(actions.updateEventLeagueInfoState({
                                roundId: item.roundId
                            }))
                        }
                    });
                    // 如果list中没有正在进行的轮次则默认为最后一个
                    if(flag){
                        dispatch(actions.updateState({
                            defaultGroupIndex: list.length - 1,
                            group: list[list.length - 1]
                        }));
                        // 更改默认的stageId
                        dispatch(actions.updateEventLeagueInfoState({
                            roundId: list[list.length - 1].roundId
                        }))
                    }
                }, rej=> {
                    dispatch(actions.updateState({
                        groupList: [],
                        group: {},
                        defaultGroupIndex: 0,
                        staticGroupIndex: 0
                    }));
                    dispatch(actions.updateEventLeagueInfoState({
                        roundId: ''
                    }));
                    console.log(rej.rspMsg);
                });
            }
        )
    },
    /**
     * 获取比赛队伍信息 { "lid": "联赛id", "seasonId":"赛季id", "stageId": "阶段id" ,"roundId":"轮次Id"}
     * @returns {function()}
     */
    getMuseumMatchsInfo(){
        return (
            (dispatch, getState) => {
                const {id, seasonId, stageId, roundId} = getState()[storeKey.EVENTLEAGUEDETAIL_STORE];
                getMuseumMatchs.getData({
                    lid: id,
                    seasonId,
                    stageId,
                    roundId
                }).then(rsp=> {
                    dispatch(actions.updateState({
                        matchData: rsp.data.list
                    }));
                },rej=>{
                    dispatch(actions.updateState({
                        matchData: []
                    }));
                    console.log(rej.rspMsg);
                });
            }
        )
    },
    /**
     * 获取积分信息{ "type":"积分榜类型, 1: 赛季, 2: 阶段, 3: 轮次", "id":"或赛季,或阶段,或轮次的id" }
     * @returns {function()}
     */
    getStandingsInfo(){
      return(
          (dispatch, getState) => {
              const {roundId} = getState()[storeKey.EVENTLEAGUEDETAIL_STORE];
              getStandings.getData({
                  type,
                  id: roundId
              }).then(rsp=> {
                  dispatch(actions.updateState({
                      rankDataList: rsp.data.list,
                      rankColorArr: rsp.data.color
                  }))
              }, rej=> {
                  dispatch(actions.updateState({
                      rankDataList: [],
                      rankColorArr: {}
                  }));
                  console.log(rej.rspMsg);
              })
          }
      )
    },
    /**
     * 赛事阶段点击事件
     * @param item     被点击的阶段对象
     * @param index    索引
     * @returns {function()}
     * @private
     */
    _clickStage(item, index){
        return (
            (dispatch) => {
                dispatch(actions.updateEventLeagueInfoState({
                    stageId: item.stageId
                }));
                // 改变默认展示的阶段的Index
                dispatch(actions.updateState({
                    defaultStageIndex: index,
                    stage: item
                }));
            }
        )
    },
    /**
     * 联赛轮次或分组点击事件
     * @param item          轮次/分组对象
     * @param index         轮次/分组的索引
     * @returns {function()}
     * @private
     */
    _clickGroup(item, index){
        return((dispatch) => {
                dispatch(actions.updateEventLeagueInfoState({
                    roundId: item.roundId
                }));
                // 改变默认展示的阶段的Index和默认展示的轮次或者分组
                dispatch(actions.updateState({
                    defaultGroupIndex: index,
                    group: item
                }));
            }
        )
    },
    updateState: createAction(ActionTypes.UPDATE_COURSE,(obj)=>obj),
    updateEventLeagueInfoState: createAction(ActionTypes.UPDATE_EVENTLEAGUEDETAIL,(obj)=>obj),
};
export default actions
