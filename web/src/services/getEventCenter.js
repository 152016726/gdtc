/**
 * Created by ljx on 2019/1/15.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'eventCenter/nationList' : 'museum/getCountrys';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};