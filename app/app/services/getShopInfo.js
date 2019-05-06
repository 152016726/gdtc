/**
 * Created by marcus on 2018/11/27.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'owner/getOwners';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};