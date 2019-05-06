/**
 * Created by easyLottoMac_Feng on 2018/12/24.
 */
import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'scoreDetailAnalysis/recentRecord' : 'museum/histRecentSimilarVersus';

module.exports = {
    getData: (data = {}) => {
        return service.getData(action, data);
    }
};