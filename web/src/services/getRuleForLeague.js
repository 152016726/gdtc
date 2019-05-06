import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'museum/getRuleForLeague';

module.exports = {
    getData: (data = {}) => {
        return service.getData(action, data);
    }
};