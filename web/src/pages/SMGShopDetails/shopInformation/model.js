/**
 * Created by easyLottoMac on 2018/11/16.
 */
import localStore from '@easylotto/store';
import {DOT_INFO} from 'constants/localStoreKeys';
import TplModel from 'modules/tplModel';

let model = new TplModel({
    model: {
        userInfo: {}
    },
    initData(){
        // 读取localStorage里的用户信息
        this.model.userInfo = localStore.get(DOT_INFO);
        // 清除 localStore的缓存
        localStore.erase(DOT_INFO);
    }
});

module.exports = model;
