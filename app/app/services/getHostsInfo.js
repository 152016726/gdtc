/**
 * Created by easyLottoMac_Feng on 2019/3/5.
 */
import service from '@easylotto/service';
import config from '../config'

let isDebug = config.debugData;
let action = isDebug ? '' : 'server/getHostsInfo';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};
