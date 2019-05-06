import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'museum/getStages';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};