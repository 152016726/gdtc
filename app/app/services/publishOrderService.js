/**
 * Created by marcus on 2018/12/6.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'expert/saveExpertOrder';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};