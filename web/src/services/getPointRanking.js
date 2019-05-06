/**
 * Created by easyLottoMac_Feng on 2018/12/20.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'scoreDetailAnalysis/getStandingsByVid' : 'museum/getStandingsByVid';

module.exports = {
    getData: (data = {}) => {
        return service.getData(action, data);
    }
};
