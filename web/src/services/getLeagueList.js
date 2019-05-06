/**
 * Created by ljx on 2019/1/16.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'eventCenter/leagueList' : 'museum/getLeagues';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};