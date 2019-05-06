import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? '' : 'server/getHostsInfo';

module.exports = {
    getData: (data = {}) => {
        return service.getData(action, data);
    }
};