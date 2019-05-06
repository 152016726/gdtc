/**
 * Created by Sanji on 2019/2/26.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'device/addDeviceRelVid';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};