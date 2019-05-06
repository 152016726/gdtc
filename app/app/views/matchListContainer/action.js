import {createAction} from 'redux-actions'
import * as ActionTypes from '~/constants/ActionTypes'
import matchDataCenter from '#/matchDataCenter';
import util from '~/common/js/util'
import * as storeKey from "~/constants/storeKeys";

let actions = {
    /**
     * 过滤比赛
     * @param 过滤的选项
     */
    filterMatch(opt, isFromExpert) {
        return ((dispatch, getState) => {
            // 先清空内容，加快渲染
            dispatch(actions.setMatchListConf({
                grpEvent: {},
                isRefreshing: false
            }));
            // 专家推荐默认当天比赛
            if(isFromExpert){
                Object.assign(opt, {
                    grpDate: true
                })
            }
            setTimeout(() => {
                let data = matchDataCenter.filterMatch(opt, true);
                dispatch(actions.setMatchListConf({
                    grpEvent: data.grpEvent,
                    isNullData: util.isEmptyObject(data.grpEvent),
                    hideGrp: [],
                    isRefreshing: false
                }));
            }, 100);
        });
    },
    /**
     * 清空选中过关方式
     * @returns {Function}
     */
    clearSelectStickAll(){
        return ((dispatch, getState)=>{
            dispatch(actions.clearStickAll({
                selectComboArr: [],
                selectFreeArr:[]
            }));
        })
    },
    clearStickAll: createAction(ActionTypes.UPDATE_STICK_ALL,(obj)=> obj),
    setMatchListConf: createAction(ActionTypes.UPDATE_ALL_EVENTS, (obj) => obj)
};
export default actions