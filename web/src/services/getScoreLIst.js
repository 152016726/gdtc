/**
 * Created by easyLottoMac on 2018/11/8.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'score/eventScoreList' : 'soccer/versusLive';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};