/**
 * Created by mac-ddt on 2018/8/28.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'exponent/exponentList' : 'odds/oldOdds';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};