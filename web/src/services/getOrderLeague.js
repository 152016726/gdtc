/**
 * Created by ljx on 2019/2/18.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'expert/getOrderLeague';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};