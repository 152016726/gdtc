/**
 * Created by marcus on 2018/11/17.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'user/register';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};