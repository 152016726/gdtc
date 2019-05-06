/**
 * Created by marcus on 2019/1/7.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'expert/handleInterestedExperts';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};