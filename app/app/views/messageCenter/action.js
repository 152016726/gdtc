/**
 * Created by easyLottoMac_Feng on 2019/3/5.
 */
import {createAction} from 'redux-actions'
import * as ActionTypes from '../../constants/ActionTypes'
import * as storeKey from '../../constants/storeKeys'
import getUserMessages from '~/services/getUserMessages'

let actions = {
    /**
     * 清空信息按钮
     * @returns {Function}
     */
    clearHandle() {
        return ((dispatch, getState) => {
            console.log('123');
            dispatch(actions.updateData({
                flatData: []
            }));
            dispatch(actions.updatePersonal({
                latestMsgCount: ''
            }))
        })
    },
    /**
     * 接口数据请求
     */
    getFlatData() {
        return ((dispatch, getState) => {
            getUserMessages.getData().then(rsp => {
                let rspData = rsp.data.list;
                let unreadNews = rspData.filter(RF => RF.isRead === 'false').length;
                dispatch(actions.updateData({
                    flatData:rspData,
                    unreadNews: unreadNews
                }))
            }, err => {
                console.log(err);
            });
        })
    },
    /**
     * 更新阅读 Icon
     */
    updateRead(item) {
        return((dispatch, getState) => {
            let {flatData, unreadNews}  = getState()[storeKey.MESSAGECENTER_STORE];
            flatData.forEach(list => {
                if(list.id === item.id) {
                    list.isRead = 'true';
                }
            });
            dispatch(actions.updateData({
                flatData:flatData.slice(),
                unreadNews: -- unreadNews
            }))
        })
    },
    updateData: createAction(ActionTypes.UPDATE_MESSAGECENTER, (obj) => obj),
    updatePersonal: createAction(ActionTypes.UPDATE_PERSONAL,(obj)=>obj)
};

export default actions;