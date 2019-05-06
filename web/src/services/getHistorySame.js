/**
 * Created by easyLottoMac_Feng on 2018/12/21.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'scoreDetailAnalysis/historySame' : 'museum/getSameAsiaOdds';

module.exports = {
    getData: (data = {}) => {
        return service.getData(action, data);
    }
};