import { createAction } from 'redux-actions'
import * as ActionTypes from '../../../../../constants/ActionTypes'
import * as storeKey from '../../../../../constants/storeKeys';
import getRegistration from '../../../../../services/getRegistrationId';
import getPushDeviceStatu from '../../../../../services/getPushDeviceStatu';

let actions = {
    updateShowRanking(ele){
        return ((dispatch, getState) => {
            dispatch(actions.updateScoreSetting({
                isShowRanking : !ele
            }));
        })
    },
    updateShowRedYellowCard(ele){
        return ((dispatch, getState) => {
            dispatch(actions.updateScoreSetting({
                isShowRedYellowCard : !ele
            }));
        })
    },
    updatePushMyFavouriteGame(ele){
        return ((dispatch, getState) => {
            let reqData = {};
            let { registrationID } = getState()[storeKey.ROOT_PAGE_STORE];
            //设置reqData 默认0: 不推送, 1: 只推送关注的赛事, 2: 全部推送"
            if (ele) {
                reqData = {
                    registrationID : registrationID,
                    level : '0'
                };
            } else {
                reqData = {
                    registrationID : registrationID,
                    level : '1'
                };
            }
            getRegistration.getData(reqData).then(data => {
                // console.log('推送设置成功', ele, reqData);
            }).catch(e => {
                // console.log('推送设置错误', e);
            });
            dispatch(actions.updateScoreSetting({
                isPushMyFavouriteGame : !ele
            }));
        })
    },
    getPushDeviceStatus(){
        return ((dispatch, getState) => {
            let { registrationID } = getState()[storeKey.ROOT_PAGE_STORE];
            let reqData = { registrationID : registrationID };
            getPushDeviceStatu.getData(reqData).then(data => {
                console.log('推送设置读取', data, reqData);
                if(data.data.level === '1'){
                    // console.log('1111',data.data.level);
                    dispatch(actions.updateScoreSetting({
                        isPushMyFavouriteGame : true
                    }));
                }else{
                    // console.log('2222',data.data.level);
                    dispatch(actions.updateScoreSetting({
                        isPushMyFavouriteGame : false
                    }));
                }
            }).catch(e => {
                // console.log('推送设置读取', e);
            });

        })
    },
    updateScoreSetting : createAction(ActionTypes.UPDATE_SCORE_SETTING, (obj) => obj)

};
export default actions