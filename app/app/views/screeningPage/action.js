/**
 * Created by easyLottoMac_Feng on 2018/12/12.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'

let actions = {
    /**
     * 赛事筛选事件
     * @returns {Function}
     */
    selectMarketHandle() {
        return ((dispatch, getState) => {
            let {homeWinValue, dropValue, awayValue, selectBtns} = getState()[storeKey.SCREENINGPAGE_STORE];
            let {allFlatListData} = getState()[storeKey.PEER_REVIEW_STORE];
            let showFlatL = allFlatListData.filter(AFL => {
                return selectBtns.indexOf(AFL.leagueShortName) !== -1
            });
            if(homeWinValue !== '' && homeWinValue !== '0.00') {
                showFlatL = showFlatL.filter(SF => {
                    return SF.win === homeWinValue
                })
            }
            if(dropValue !== '' && dropValue !== '0.00') {
                showFlatL = showFlatL.filter(SF => {
                    return SF.draw === dropValue
                })
            }
            if(awayValue !== '' && awayValue !== '0.00') {
                showFlatL = showFlatL.filter(SF => {
                    return SF.defeat === awayValue
                })
            }
            dispatch(actions.updatePRData({
                showFlatListData: showFlatL
            }))
        })
    },
    updateDate: createAction(ActionTypes.UPDATE_SCREENINGPAGE, (obj) => obj),
    updatePRData: createAction(ActionTypes.UPDATE_PEER_REVIEW, (obj) => obj)
};

export default actions