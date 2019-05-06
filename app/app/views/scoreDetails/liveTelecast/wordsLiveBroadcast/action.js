/**
 * Created by easyLottoMac on 2018/10/16.
 */

import {createAction} from 'redux-actions'
import * as ActionTypes from '../../../../constants/ActionTypes'
import * as storeKey from '../../../../constants/storeKeys'
import getBroadcastListService from '../../../../services/getBroadcastListService'
import selfState from './state'

let actions = {
    /**
     * 重置状态
     */
    initState: createAction(ActionTypes.INIT_WORDS_STATE, (selfState) => selfState),
    /**
     * 获取页面直播文字信息
     * @returns {Function}
     */
    getBroadcastList(vid) {
        return ((dispatch, getState) => {
            getBroadcastListService.getData({vid}).then((resData) => {
                const {info = []} = resData.data;
                info.reverse();
                dispatch(actions.setLiveAllData({
                    info: info
                }))
            })
        })
    },
    /**
     * 更新页面数据
     */
    setLiveAllData: createAction(ActionTypes.UPDATE_LIVE_ALL_DATA, (obj) => obj)
};

export default actions;