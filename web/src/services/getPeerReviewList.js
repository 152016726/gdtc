/**
 * Created by easyLottoMac_Feng on 2019/2/18.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'museum/getVersusSameOdds';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};