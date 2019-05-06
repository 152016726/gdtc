/**
 * Created by easyLottoMac_Feng on 2019/1/9.
 */

import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'expert/leagueList' : 'expert/getOrderLeague';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};