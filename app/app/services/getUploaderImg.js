/**
 * Created by marcus on 2019/1/22.
 */
import service from '@easylotto/service';
import config from '../config'
let isDebug = config.debugData;
let action = isDebug ? '' : 'uploadApi/upload';

module.exports = {
    getData: function (data) {
        return service.getData(action, data || {}, {isUploadFile: true});
    }
};