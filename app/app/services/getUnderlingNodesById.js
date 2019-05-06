/**
 * Created by easylottoMac on 2018/9/13.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? 'eventInformation/underlingNodesById' : 'getUnderlingNodesById';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {});
    }
};