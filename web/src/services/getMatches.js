import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'museum/getMatchs';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};