/**
 * Created by mac-ddt on 2018/8/9.
 */
import getCurrentClientService from '../../services/getCurrentClientService'
import getVersionUpdate from '../../services/getVersionUpdate';
import getRegistration from '../../services/getRegistrationId';
import Account from '#/account'
import { createAction } from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import {Platform} from 'react-native';
import getHostsInfo from '../../services/getHostsInfo';
import config from '../../config';

let actions = {
    getCurrentClient() {
        return ((dispatch, getState) => {
            getCurrentClientService.getData().then((data) => {
                let accountInfo = Account.updateAccountInfo(data.data || {});
                dispatch(actions.updatePersonal(accountInfo))
            }, (rejectData) => {
                console.log(rejectData);
            })
        })
    },
    getVersionUpdate(fn) {
        let reqObj = {
            sysType : Platform.OS === 'ios' ? 1 : 0
        };
        return ((dispatch, getState) => {
            getVersionUpdate.getData(reqObj).then(data => {
                let dataJson = data.data;
                // console.log('@@@@@@@@@@@@@@@@',dataJson);
                if (Platform.OS === 'ios') {
                    dispatch(actions.updateVersion({
                        iOS_Version : dataJson.version,
                        content : dataJson.content,
                        url : dataJson.url,
                        isForce : dataJson.isForce
                    }));
                } else {
                    dispatch(actions.updateVersion({
                        Android_Version : dataJson.version,
                        content : dataJson.content,
                        url : dataJson.url,
                        isForce : dataJson.isForce
                    }));
                }
                fn();
            }, rejectData => {
                console.log(rejectData);
            })
        })
    },
    //设置设备的推送id  0: 不推送, 1: 只推送关注的赛事, 2: 全部推送
    getRegistrationID(registrationID){
        let registration = { registrationID : registrationID,
                                       level: '1'
                            };
        return ((dispatch, getState) => {
            // console.log('推送设备ID', registrationID);
            dispatch(actions.updateVersion({
                registrationID : registrationID
            }));
            getRegistration.getData(registration).then(data => {
                // console.log('推送设置成功', data);
            }).catch(e => {
                // console.log('推送设置错误', e);
            });
        });

    },
    updateRegistrationID(registrationID){
      return ((dispatch, getState) => {
            dispatch(actions.updateVersion({
                registrationID : registrationID
            }));
      });
    },
    /**
     * 请求静态资源的 host
     * @returns {Function}
     */
    getHostsInfo() {
        return ((dispatch, getState) => {
            getHostsInfo.getData().then(rsq => {
                config.staticHost = rsq.data.staticHost;
                config.staticResourceHost = rsq.data.staticResourceHost;
            }, rsp => {
                console.log('rsp.........', rsp)
            });
        })
    },

    /**
     * 更新个人信息
     */
    updatePersonal : createAction(ActionTypes.UPDATE_PERSONAL, (obj) => obj),
    updateVersion : createAction(ActionTypes.UPDATE_ROOT_PAGE_STORE, (obj) => obj)
};
export default actions;