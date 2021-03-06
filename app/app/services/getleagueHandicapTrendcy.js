/**
 * Created by marcus on 2018/12/14.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'museum/getPanLuTrend';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};