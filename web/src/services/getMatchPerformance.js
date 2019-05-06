/**
 * Created by easyLottoMac_Feng on 2018/12/19.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'scoreDetailAnalysis/matchPerformance' : 'museum/histSimilarVersus';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};