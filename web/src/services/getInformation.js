/**
 * Created by oWEn on 2018/4/20.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'article/information' : 'cmscp/core/generate_push/informations';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};