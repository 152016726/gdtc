/**
 * Created by marcus on 2019/3/21.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'museum/getRuleForLeague';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};