/**
 * Created by mac-ddt on 2018/8/28.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'user/currentClient';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};