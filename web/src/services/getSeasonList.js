/**
 * Created by ljx on 2019/1/17.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'eventCenter/season' : 'museum/getSeasons';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};