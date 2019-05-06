/**
 * Created by feng on 2018/4/20.
 */
var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'market/leagueArr' : '/soccer/getLeaguesBtwDates';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};