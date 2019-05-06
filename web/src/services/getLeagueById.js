var service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : '/museum/getLeagueById';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};