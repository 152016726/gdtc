/**
 * Created by oWEn on 2018/4/20.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'dot/cityList' : 'owner/getOwners';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};