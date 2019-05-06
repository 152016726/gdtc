/**
 * Created by marcus on 2018/11/21.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'personal/updateInfo';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};