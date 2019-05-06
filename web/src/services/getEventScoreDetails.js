/**
 * Created by easyLottoMac on 2018/11/7.
 */

let service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'score/eventScoreDetails' : 'soccer/versusInfo';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};