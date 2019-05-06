import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'live/timeLine' : '';

module.exports = {
    getData: (data = {}) => {
        return service.getData(action, data);
    }
};