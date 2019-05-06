import service from '@easylotto/service';
let isDebug = __DEBUGDATA__;
let action = isDebug ? 'live/team_info' : '';

module.exports = {
    getData: (data = {}) => {
        return service.getData(action, data);
    }
};