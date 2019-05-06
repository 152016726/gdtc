/**
 * Created by easyLottoMac on 2018/11/13.
 */
let service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : '/company/getcompanys';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};