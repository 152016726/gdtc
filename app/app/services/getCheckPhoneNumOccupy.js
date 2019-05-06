/**
 * Created by marcus on 2019/3/22.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'user/checkPhoneNumOccupy';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};