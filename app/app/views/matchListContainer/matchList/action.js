import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../constants/ActionTypes'
import * as storeKey from "../../../constants/storeKeys";
import util from '~/common/js/util'
import games from '@easylotto/bet';
import matchDataCenter from '#/matchDataCenter';

let actions = {
    /**
     * 获取赛事列表信息
     * @param ops
     * @returns {Function}
     */
    getMatchList({isFocus, isReload=false, sort='', isFromExpert=false}) {
        return ((dispatch) => {
            matchDataCenter.getMatchData({
                isFocus,
                isReload,
                sort,
                callback(events) {
                    games.Betslip.initEvents(events);
                }
            }).then((data) => {
                let opsFilter = { sort };
                // 专家推荐默认当天比赛
                if(isFromExpert){
                    Object.assign(opsFilter, {
                        grpDate: true
                    })
                }
                //重新reload 页面增加玩法filter
                data = (isReload || isFromExpert) ? matchDataCenter.filterMatch(opsFilter) : data;
                dispatch(actions.setAllEvents({
                    grpEvent: data.grpEvent,
                    isNullData: util.isEmptyObject(data.grpEvent),
                    isRefreshing: false
                }));
            });
        });
    },
    /**
     * 过滤玩法比赛
     * @param sort 需要显示的玩法
     */
    filterSort(sort, isFromExpert) {
        return ((dispatch) => {
            // 先清空内容，加快渲染
            dispatch(actions.setAllEvents({
                grpEvent: {},
                isRefreshing: false
            }));
            setTimeout(() => {
                let opsFilter = { sort };
                // 专家推荐默认当天比赛
                if(isFromExpert){
                    Object.assign(opsFilter, {
                        grpDate: true
                    })
                }
                let data = matchDataCenter.filterMatch(opsFilter);
                dispatch(actions.setAllEvents({
                    grpEvent: data.grpEvent,
                    isNullData: util.isEmptyObject(data.grpEvent),
                    hideGrp: [],
                    isRefreshing: false
                }));
            }, 100);
        });
    },
    /**
     * 更新刷新状态
     * @param obj
     * @returns {Function}
     */
    updateRefreshStatus() {
        return ((dispatch, getState) => {
            dispatch(actions.setRefreshStatus({
                isRefreshing: true
            }))
        });
    },
    /**
     * 获取投注揽存储的选中注项Key
     * @returns {Function}
     */
    getChooseOutcomes() {
        return ((dispatch, getState) => {
            let outcomeList = games.Betslip.getChooseOutcomes();
            dispatch(actions.setChooseOutcomes({
                outcomeList: outcomeList,
                outcomeCount: outcomeList.length
            }))
        })
    },
    updateHideGroup(key) {
        return ((dispatch, getState) => {
            const store = getState()[storeKey.MATCH_LIST_STORE];
            let hideGrp = store.hideGrp;
            let idx = hideGrp.indexOf(key);
            if (idx === -1) {
                hideGrp.push(key);
            } else {
                hideGrp.splice(idx, 1);
            }

            dispatch(actions.setShowEvents({
                hideGrp: hideGrp.slice(0)
            }));
        })
    },
    setBetsilpList: createAction(ActionTypes.UPDATE_BETSLIP_LIST, (obj) => obj),
    setChooseOutcomes: createAction(ActionTypes.UPDATE_CHOOSE_OUTCOMES, (obj) => obj),
    /**
     * 更新所有赛事对象方法
     * */
    setAllEvents: createAction(ActionTypes.UPDATE_ALL_EVENTS, (obj) => obj),
    updateCanSelMatch: createAction(ActionTypes.UPDATE_MATCH_TYPE_SELECT, (obj) => obj),
    /**
     * 更新显示赛事对象方法
     */
    setShowEvents: createAction(ActionTypes.UPDATE_SHOW_EVENTS, (obj) => obj),
    /**
     * 更新当前选择的玩法
     */
    updateSelSort: createAction(ActionTypes.UPDATE_SEL_SORT, (obj) => obj),

    setRefreshStatus: createAction(ActionTypes.UPDATE_REFRESH_STATUS, (obj) => obj),

    updateSelectOutcomeCount: createAction(ActionTypes.UPDATE_SEL_OUTCOME_COUNT, (obj) => obj),
    /**
     * 更新赛事涮选
     */
    setMTSData: createAction(ActionTypes.UPDATE_MATCH_TYPE_SELECT, (obj) => obj)
};
export default actions