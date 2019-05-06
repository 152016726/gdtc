/**
 * Created by easyLottoMac_Feng on 2019/3/13.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'msg/getUserMessages';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};