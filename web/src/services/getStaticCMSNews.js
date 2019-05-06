let service = require('@easylotto/service');
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'getStaticCMSNews':'getStaticCMSNews';

module.exports = {
    getData: function(data){
        return service.getData(action, data || {}, {});
    }
};