/**
 * Created by easyLottoMac_Feng on 2019/2/28.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : '/getCMSNewsById';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};
