/**
 * Created by marcus on 2018/11/19.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'user/forgetPassword';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};