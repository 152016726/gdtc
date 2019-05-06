/**
 * Created by marcus on 2018/11/17.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'user/doLogin';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};